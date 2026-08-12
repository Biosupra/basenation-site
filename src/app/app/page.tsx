'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract, Interface, parseUnits, formatEther } from "ethers";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

const VAULT_ADDRESS = "0x623Cef80f15eE6FF68F7E82cc92adC90Ce9AD97D";
const BASE_CHAIN_ID = BigInt(8453);
const BASE_CHAIN_HEX = '0x2105'; 

const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const POOL_ADDRESS = "0x3fe04a59ebd38cf06080a6f60a98d124eb59392a";

const PAYMASTER_URL = "https://api.developer.coinbase.com/rpc/v1/base/8f1MMWPWHdnAALIhkdiG9qF17tNCHbNc";

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)"
];

const POOL_ABI = [
    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, bool unlocked)"
];

const VAULT_ABI = [
    "function claimRewards(uint256 tokenId) external",
    "function withdrawPosition(uint256 tokenId) external",
    "function positionOwner(uint256 tokenId) external view returns (address)",
    "function getUserPositions(address user) external view returns (uint256[])",
    "function depositAndStake(uint256 amount0ToAdd, uint256 amount1ToAdd, uint256 amount0Min, uint256 amount1Min, int24 tickSpacing, int24 tickLower, int24 tickUpper) external returns (uint256)",
    "event RewardsClaimed(address indexed user, uint256 userReward, uint256 protocolFee)"
];

export default function VaultDashboard() {
  const [globalUserAddress, setGlobalUserAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coinbaseWalletProvider, setCoinbaseWalletProvider] = useState<any>(null);
  const [showTosModal, setShowTosModal] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  
  const [stats, setStats] = useState({
      unclaimed: '0.0000',
      lifetime: '0.0000',
      apy: '~45.5%'
  });
  const [positions, setPositions] = useState<string[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  
  const [wethUsd, setWethUsd] = useState("");
  const [usdcUsd, setUsdcUsd] = useState("");
  
  const [manageError, setManageError] = useState<{ title?: string, message: string } | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null); // For claim/withdraw buttons

  useEffect(() => {
      const accepted = localStorage.getItem('tos_accepted') === 'true';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTosAccepted(accepted);
  }, []);

  const connectWallet = () => {
      if (tosAccepted) {
          executeWalletConnection();
      } else {
          setShowTosModal(true);
      }
  };

  const acceptTosAndConnect = () => {
      localStorage.setItem('tos_accepted', 'true');
      setTosAccepted(true);
      setShowTosModal(false);
      executeWalletConnection();
  };

  const executeWalletConnection = async () => {
      try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let cbProvider: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof window !== 'undefined' && (window as any).ethereum !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cbProvider = (window as any).ethereum;
          } else {
              const sdk = new CoinbaseWalletSDK({
                  appName: 'BaseNation',
                  appLogoUrl: 'https://basenation.org/splash.png',
                  appChainIds: [8453]
              });
              cbProvider = sdk.makeWeb3Provider();
          }
          setCoinbaseWalletProvider(cbProvider);
          
          const newProvider = new BrowserProvider(cbProvider);
          setProvider(newProvider);
          
          const network = await newProvider.getNetwork();
          if (network.chainId !== BASE_CHAIN_ID) {
              await cbProvider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE_CHAIN_HEX }] });
          }
          
          const accounts = await cbProvider.request({ method: "eth_requestAccounts" });
          setGlobalUserAddress(accounts[0]);
          
          await loadUserPositions(accounts[0], newProvider);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
          alert("Connection failed: " + error.message);
      }
  };

  const loadUserPositions = async (userAddress: string, ethersProvider: BrowserProvider) => {
      setIsLoadingPositions(true);
      setManageError(null);
      try {
          const vaultContract = new Contract(VAULT_ADDRESS, VAULT_ABI, ethersProvider);
          const userPos = await vaultContract.getUserPositions(userAddress);
          
          if (userPos.length === 0) {
              setPositions([]);
          } else {
              setPositions(userPos.map((id: unknown) => String(id)));
          }

          // Fetch APY
          try {
              const query = { query: `{ gauges(where: {id: "0xa0b61fdb9f1fb9b917fe38b49427fd4d87472d28"}) { apy } }` };
              const response = await fetch("https://api.studio.thegraph.com/query/50802/aerodrome-base-mainnet/version/latest", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(query)
              });
              const result = await response.json();
              if (result.data && result.data.gauges && result.data.gauges.length > 0) {
                  const apy = parseFloat(result.data.gauges[0].apy);
                  if (apy > 0) setStats(prev => ({ ...prev, apy: apy.toFixed(2) + "%" }));
              }
          } catch (e) {
              console.error("Failed to fetch APY", e);
          }

          // Fetch Lifetime
          try {
              const cdpProvider = new ethers.JsonRpcProvider(PAYMASTER_URL);
              const vaultEventContract = new Contract(VAULT_ADDRESS, VAULT_ABI, cdpProvider);
              const checksumAddress = ethers.getAddress(userAddress);
              const filter = vaultEventContract.filters.RewardsClaimed(checksumAddress);
              const latestBlock = await cdpProvider.getBlockNumber();
              const events = await vaultEventContract.queryFilter(filter, 18000000, latestBlock);
              let totalClaimed = BigInt(0);
              for (const event of events) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  totalClaimed += (event as any).args[1];
              }
              setStats(prev => ({ ...prev, lifetime: parseFloat(formatEther(totalClaimed)).toFixed(6) }));
          } catch (e) {
              console.error("Failed to fetch lifetime", e);
          }

          // Fetch Unclaimed
          let totalUnclaimed = BigInt(0);
          const gaugeContract = new Contract("0xA0B61fdB9f1FB9b917Fe38b49427Fd4D87472D28", ["function earned(address,uint256) external view returns (uint256)"], ethersProvider);
          
          for (let i = 0; i < userPos.length; i++) {
              const tokenId = userPos[i];
              try {
                  const unclaimed = await gaugeContract.earned(VAULT_ADDRESS, tokenId);
                  const userShare = (unclaimed * BigInt(80)) / BigInt(100);
                  totalUnclaimed += userShare;
              } catch(e) {
                  console.error("Failed to fetch unclaimed for " + tokenId, e);
              }
          }
          setStats(prev => ({ ...prev, unclaimed: parseFloat(formatEther(totalUnclaimed)).toFixed(6) }));

      } catch (error) {
          console.error(error);
          setManageError({ message: "Failed to load positions." });
      } finally {
          setIsLoadingPositions(false);
      }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendSponsoredTx = async (calls: any[], message: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const capabilities: any = {};
      if (PAYMASTER_URL) {
          capabilities.paymasterService = { url: PAYMASTER_URL };
      }
      
      setManageError({ message: "Confirm transaction in your wallet (Gas Sponsored!)..." });
      
      const bundleId = await coinbaseWalletProvider.request({
          method: 'wallet_sendCalls',
          params: [{
              version: '1.0',
              chainId: BASE_CHAIN_HEX,
              from: globalUserAddress,
              calls: calls,
              capabilities: capabilities
          }]
      });
      
      setManageError({ message: "Transaction submitted! Waiting for network confirmation..." });
      
      while (true) {
          await new Promise(r => setTimeout(r, 2000));
          const status = await coinbaseWalletProvider.request({
              method: 'wallet_getCallsStatus',
              params: [bundleId]
          });
          if (status.status === 'CONFIRMED') {
              return status.receipts[0].transactionHash;
          } else if (status.status === 'FAILED') {
              throw new Error("Transaction failed on-chain.");
          }
      }
  };

  const runLedgerCheck = async (vaultContract: Contract, tokenIdRaw: string) => {
      try {
          const owner = await vaultContract.positionOwner(BigInt(tokenIdRaw.trim()));
          if (owner === "0x0000000000000000000000000000000000000000") {
              setManageError({ title: "NFT DELETED BY BOT", message: "Your Keeper Bot likely rebalanced this position! NFT " + tokenIdRaw + " was destroyed and a new one was minted. Check the 'ERC721 Token Txns' tab on your Vault's BaseScan page to find your new Token ID." });
              return false;
          }
          if (owner.toLowerCase() !== globalUserAddress?.toLowerCase()) {
              setManageError({ title: "WRONG OWNER", message: "This NFT is registered to a different wallet address in the Vault ledger." });
              return false;
          }
          return true; 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
          setManageError({ title: "LEDGER READ ERROR", message: error.message });
          return false;
      }
  };

  const executeDeposit = async () => {
      if (!globalUserAddress || !provider) return alert("Connect wallet first.");
      const wEthVal = parseFloat(wethUsd) || 0;
      const usdcVal = parseFloat(usdcUsd) || 0;
      if (wEthVal <= 0 && usdcVal <= 0) return alert("Enter a valid USD amount in at least one box.");

      setIsDepositing(true);
      setManageError({ message: "Step 1: Calculating WETH/USDC amounts from live price..." });

      try {
          const poolContract = new Contract(POOL_ADDRESS, POOL_ABI, provider);
          const slot0 = await poolContract.slot0();
          const currentTick = Number(slot0.tick);
          
          const ratio = Math.pow(1.0001, currentTick);
          const wethPriceUsd = ratio * Math.pow(10, 12); 

          const wethTokens = wEthVal / wethPriceUsd;
          const usdcTokens = usdcVal;

          const wethWei = parseUnits(wethTokens.toFixed(18), 18);
          const usdcMwei = parseUnits(usdcTokens.toFixed(6), 6);

          const tickLower = currentTick - (currentTick % 50) - 150;
          const tickUpper = currentTick - (currentTick % 50) + 150;

          setManageError({ message: "Step 2: Preparing batch transaction (Approve + Deposit)..." });

          const erc20Iface = new Interface(ERC20_ABI);
          const vaultIface = new Interface(VAULT_ABI);

          const calls = [];
          if (wethWei > BigInt(0)) {
              calls.push({
                  to: WETH_ADDRESS,
                  data: erc20Iface.encodeFunctionData("approve", [VAULT_ADDRESS, wethWei])
              });
          }
          if (usdcMwei > BigInt(0)) {
              calls.push({
                  to: USDC_ADDRESS,
                  data: erc20Iface.encodeFunctionData("approve", [VAULT_ADDRESS, usdcMwei])
              });
          }
          calls.push({
              to: VAULT_ADDRESS,
              data: vaultIface.encodeFunctionData("depositAndStake", [
                  wethWei, usdcMwei, BigInt(0), BigInt(0), BigInt(50), BigInt(tickLower), BigInt(tickUpper)
              ])
          });

          const txHash = await sendSponsoredTx(calls, "Sending deposit...");
          
          setManageError({ message: "Deposit successful! Hash: " + txHash + "\nLoading your new position..." });
          setWethUsd("");
          setUsdcUsd("");
          await new Promise(r => setTimeout(r, 3000));
          await loadUserPositions(globalUserAddress, provider);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
          console.error(error);
          setManageError({ title: "DEPOSIT FAILED", message: error.reason || error.shortMessage || error.message });
      } finally {
          setIsDepositing(false);
      }
  };

  const executeClaim = async (tokenIdRaw: string) => {
      if (!globalUserAddress || !provider) return alert("Connect wallet first.");
      setProcessingId(tokenIdRaw);
      setManageError(null);

      try {
          const vaultContract = new Contract(VAULT_ADDRESS, VAULT_ABI, provider);
          const isOwned = await runLedgerCheck(vaultContract, tokenIdRaw);
          if (!isOwned) { setProcessingId(null); return; }

          const vaultIface = new Interface(VAULT_ABI);
          const calls = [{
              to: VAULT_ADDRESS,
              data: vaultIface.encodeFunctionData("claimRewards", [BigInt(tokenIdRaw.trim())])
          }];

          const txHash = await sendSponsoredTx(calls, "Claiming rewards...");
          
          setManageError({ message: "AERO Rewards successfully claimed! Hash: " + txHash });
          await new Promise(r => setTimeout(r, 3000));
          await loadUserPositions(globalUserAddress, provider);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
          setManageError({ title: "CLAIM FAILED", message: error.reason || error.shortMessage || error.message });
      } finally {
          setProcessingId(null);
      }
  };

  const executeWithdraw = async (tokenIdRaw: string) => {
      if (!globalUserAddress || !provider) return alert("Connect wallet first.");
      setProcessingId(tokenIdRaw);
      setManageError(null);

      try {
          const vaultContract = new Contract(VAULT_ADDRESS, VAULT_ABI, provider);
          const isOwned = await runLedgerCheck(vaultContract, tokenIdRaw);
          if (!isOwned) { setProcessingId(null); return; }
          
          const vaultIface = new Interface(VAULT_ABI);
          const calls = [{
              to: VAULT_ADDRESS,
              data: vaultIface.encodeFunctionData("withdrawPosition", [BigInt(tokenIdRaw.trim())])
          }];

          const txHash = await sendSponsoredTx(calls, "Withdrawing position...");
          
          setManageError({ message: "Position Withdrawn! The NFT is back in your wallet. Hash: " + txHash });
          await new Promise(r => setTimeout(r, 3000));
          await loadUserPositions(globalUserAddress, provider);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
          setManageError({ title: "WITHDRAW FAILED", message: error.reason || error.shortMessage || error.message });
      } finally {
          setProcessingId(null);
      }
  };

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 4rem 2rem' }}>
      <header style={{ paddingTop: '70px', marginBottom: '3rem' }}>
        <Image 
          src="/logo_black.png" 
          alt="Base Nation Logo" 
          width={350} 
          height={100} 
          style={{ width: '100%', maxWidth: '350px', height: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block', filter: 'drop-shadow(0px 10px 20px rgba(0, 82, 255, 0.15))' }}
          priority
        />
        <p style={{ color: 'var(--text-muted)', marginTop: '15px' }}>Ledger X-Ray V5</p>
      </header>

      <section className="vault-container">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Vault Dashboard</h2>
        
        {!globalUserAddress ? (
          <div id="connect-section">
            <button className="vault-btn" onClick={connectWallet}>Connect Wallet</button>
          </div>
        ) : (
          <div id="deposit-section">
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '2px' }}>Connected Wallet:</p>
            <p id="wallet-address-display" style={{ color: 'var(--base-blue)', fontSize: '15px', textAlign: 'center', fontWeight: 'bold', marginTop: 0 }}>
                {globalUserAddress.substring(0, 6)}...{globalUserAddress.substring(globalUserAddress.length - 4)}
            </p>
            
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '30px 0' }} />
            
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Manage Vault (v4)</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 0 }}>Enter USD value for each token.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '5px' }}>
                <input type="number" className="vault-input" placeholder="$ WETH" step="1" value={wethUsd} onChange={e => setWethUsd(e.target.value)} disabled={isDepositing} />
                <input type="number" className="vault-input" placeholder="$ USDC" step="1" value={usdcUsd} onChange={e => setUsdcUsd(e.target.value)} disabled={isDepositing} />
            </div>
            <button className="vault-btn btn-claim" onClick={executeDeposit} disabled={isDepositing} style={{ marginTop: '5px', backgroundColor: 'var(--base-blue)' }}>
                {isDepositing ? 'Processing...' : 'Deposit & Stake'}
            </button>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '30px 0' }} />
            
            <h3 style={{ textAlign: 'center', marginBottom: '5px' }}>Your Vault Performance</h3>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ flex: 1, background: '#1A1C20', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase' }}>Unclaimed AERO</div>
                    <div style={{ color: 'var(--base-blue)', fontSize: '20px', fontWeight: 'bold' }}>{stats.unclaimed}</div>
                </div>
                <div style={{ flex: 1, background: '#1A1C20', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase' }}>Lifetime Claimed</div>
                    <div style={{ color: 'var(--aero-red)', fontSize: '20px', fontWeight: 'bold' }}>{stats.lifetime}</div>
                </div>
                <div style={{ flex: 1, background: '#1A1C20', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase' }}>Current APY</div>
                    <div style={{ color: '#4ade80', fontSize: '20px', fontWeight: 'bold' }}>{stats.apy}</div>
                </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '30px 0' }} />
            
            <h3 style={{ textAlign: 'center', marginBottom: '5px' }}>Your Active Positions</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 0 }}>Manage your deposited Aerodrome NFTs.</p>
            
            <div id="positions-container">
                {isLoadingPositions ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading positions...</p>
                ) : positions.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No active positions found.</p>
                ) : (
                    positions.map(tokenId => (
                        <div key={tokenId} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '15px', marginTop: '10px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--base-blue)' }}>NFT ID: {tokenId}</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="vault-btn btn-claim" onClick={() => executeClaim(tokenId)} disabled={processingId === tokenId} style={{ marginTop: 0 }}>Claim AERO</button>
                                <button className="vault-btn btn-withdraw" onClick={() => executeWithdraw(tokenId)} disabled={processingId === tokenId} style={{ marginTop: 0 }}>Withdraw</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {manageError && (
                <p style={{ color: manageError.title ? '#FF4444' : '#10B981', fontSize: '14px', marginTop: '15px', textAlign: 'left', fontWeight: 'bold', wordBreak: 'break-all', background: manageError.title ? 'rgba(255,0,0,0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '6px' }}>
                    {manageError.title && <><span style={{color: '#FF4444'}}>🚨 {manageError.title}</span><br/><br/></>}
                    <span style={{color: manageError.title ? 'var(--text-main)' : 'inherit'}}>{manageError.message}</span>
                </p>
            )}
          </div>
        )}
      </section>

      {/* Socials Section */}
      <section style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>Socials</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <a href="https://x.com/Base__Nation?s=20" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', backgroundColor: '#1A1C20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', transition: '0.2s', textDecoration: 'none' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            </a>
            <a href="https://t.me/+81lZS1CP_882YzNh" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', backgroundColor: '#0088cc', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', transition: '0.2s', textDecoration: 'none' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.31-.35-.11l-6.4 4.027-2.76-.862c-.602-.19-.616-.602.126-.892l10.8-4.16c.5-.19.95.115.784.887z"/>
                </svg>
            </a>
        </div>
      </section>

      {/* ToS Modal */}
      {showTosModal && (
        <div id="tos-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#1A1C20', border: '1px solid #333', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'center' }}>
                <h2 style={{ color: 'white', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '15px' }}>Terms of Service</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', textAlign: 'left' }}>
                    By connecting your wallet, you agree to the BaseNation Terms of Service. This is a non-custodial decentralized platform. The operators have no control over your funds and accept no liability for any losses, smart contract bugs, or market volatility.<br /><br />
                    Furthermore, you must certify that you are not a U.S. person.
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '25px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <input type="checkbox" id="tos-checkbox" onChange={e => setTosAccepted(e.target.checked)} style={{ marginTop: '4px' }} />
                    <label htmlFor="tos-checkbox" style={{ color: 'var(--text-main)', fontSize: '14px', cursor: 'pointer' }}>I confirm I am not a U.S. citizen or resident, and I accept the Terms of Service.</label>
                </div>
                <button className="vault-btn" onClick={acceptTosAndConnect} disabled={!tosAccepted} style={{ opacity: tosAccepted ? 1 : 0.5, cursor: tosAccepted ? 'pointer' : 'not-allowed', marginTop: 0 }}>Accept & Connect</button>
                <button className="vault-btn" onClick={() => setShowTosModal(false)} style={{ backgroundColor: 'transparent', border: '1px solid #333', marginTop: '10px', color: 'var(--text-muted)' }}>Decline</button>
            </div>
        </div>
      )}
    </div>
  );
}
