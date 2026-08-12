import Link from "next/link";

export default function Whitepages() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'left' }}>
      <Link href="/" className="back-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>
        &larr; Back to Home
      </Link>
      
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', color: 'var(--base-blue)', marginBottom: '5px', marginTop: '40px' }}>Base Nation</h1>
      <p className="subtitle" style={{ fontSize: '0.95rem', marginBottom: '40px', color: 'var(--text-muted)' }}>Automated Liquidity Manager (ALM) Whitepaper</p>

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '8px', color: 'var(--text-main)', marginTop: '40px' }}>1. Introduction to Base Nation</h2>
      <p style={{ color: 'var(--text-muted)' }}>Base Nation is an open, decentralized Automated Liquidity Manager (ALM) built specifically for the Base network. Inspired by the necessity to streamline decentralized finance (DeFi), Base Nation natively leverages the advanced concentrated liquidity architecture of Aerodrome Slipstream. The platform&apos;s smart contracts and off-chain keeper network ensure a frictionless user experience, serving as an accessible gateway to advanced yield generation without the complexity traditionally associated with active liquidity management.</p>

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '8px', color: 'var(--text-main)', marginTop: '40px' }}>2. Our Mission</h2>
      <p style={{ color: 'var(--text-muted)' }}>Concentrated liquidity provides incredible capital efficiency, but it requires constant, vigilant management to ensure positions do not fall &quot;out of range.&quot; For the average retail user, monitoring tick boundaries and actively rebalancing positions is unrealistic. We are here to rewrite this narrative.</p>
      <p style={{ color: 'var(--text-muted)' }}>Our overarching mission is to empower everyone, everywhere. In just a few seamless interactions on Base Nation, users can effortlessly deposit WETH and USDC, delegating the complex, gas-intensive work of active liquidity rebalancing to our automated keeper network. By fostering universal accessibility and prioritizing simplified workflows, Base Nation aims to democratize access to institutional-grade DeFi yields.</p>

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '8px', color: 'var(--text-main)', marginTop: '40px' }}>3. Platform Architecture</h2>
      <p style={{ color: 'var(--text-muted)' }}>The technical foundation of Base Nation emphasizes unmatched security, performance, and automation. The platform consists of two primary layers: the on-chain Smart Vault and the off-chain Rust Keeper Bot.</p>
      
      <h3 style={{ color: 'var(--text-main)', marginTop: '40px' }}>Aerodrome Slipstream Integration</h3>
      <p style={{ color: 'var(--text-muted)' }}>At the core of Base Nation&apos;s yield optimization strategy is a deep integration with the Aerodrome Slipstream protocol. The Vault creates highly concentrated, ultra-narrow liquidity positions in Aerodrome pools to maximize trading fee capture per dollar deposited. Because these narrow ranges easily fall out of bounds during market movements, the architecture relies heavily on our keeper automation to shift the liquidity to the active price tick.</p>

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '8px', color: 'var(--text-main)', marginTop: '40px' }}>4. Vault Smart Contract Mechanics</h2>
      <p style={{ color: 'var(--text-muted)' }}>Asset management is strictly governed by the proprietary Base Nation Vault Smart Contract (`BaseNationVault.sol`). This architecture guarantees that funds remain highly secure, adhering to programmatic, immutable rules.</p>
      
      <h3 style={{ color: 'var(--text-main)', marginTop: '40px' }}>Non-Custodial ERC721 Integration</h3>
      <p style={{ color: 'var(--text-muted)' }}>Unlike traditional vaults that pool all user funds into a single contract-owned liquidity position (creating accounting complexities), the Base Nation Vault mints individual Aerodrome Slipstream NFTs directly to the user&apos;s wallet. The Vault acts as a highly optimized router and manager. The user retains sole ownership of their NFT position at all times, making the platform fully non-custodial.</p>

      <h3 style={{ color: 'var(--text-main)', marginTop: '40px' }}>Proportional Withdrawal Logic</h3>
      <p style={{ color: 'var(--text-muted)' }}>When a user initiates a withdrawal, the Vault automatically burns the underlying Aerodrome NFT, harvests all accumulated trading fees, and returns the exact proportional share of WETH and USDC directly to the user&apos;s wallet. There are no exit fees, and the user&apos;s principal and rewards are immediately settled.</p>

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '8px', color: 'var(--text-main)', marginTop: '40px' }}>5. The Rust Keeper Network</h2>
      <p style={{ color: 'var(--text-muted)' }}>To perpetually guarantee optimal capital efficiency, Base Nation operates an off-chain network of Keeper Bots written in Rust. These bots monitor the Aerodrome pool state block-by-block.</p>
      <p style={{ color: 'var(--text-muted)' }}>When the active market price moves outside of a user&apos;s concentrated liquidity bounds, the Keeper Bot detects the &quot;out of range&quot; status. It immediately triggers the `rebalance()` function on the Vault. The Vault then automatically withdraws the old liquidity, recalculates the current tick, and redeploys the assets into a new, perfectly centered narrow range. This automated shifting ensures that user liquidity is always actively earning fees, without any manual intervention from the user.</p>

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '8px', color: 'var(--text-main)', marginTop: '40px' }}>6. Security &amp; Trust</h2>
      <p style={{ color: 'var(--text-muted)' }}>Unwavering security is the cornerstone of the Base Nation philosophy. Comprehensive measures are implemented across the protocol stack to safeguard the community&apos;s assets, allowing users to invest with absolute peace of mind.</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', backgroundColor: '#111827', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #1F2937', color: 'var(--text-main)', backgroundColor: '#1F2937', fontSize: '14px' }}>Security Mechanism</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #1F2937', color: 'var(--text-main)', backgroundColor: '#1F2937', fontSize: '14px' }}>Implementation Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #1F2937', color: 'var(--text-muted)', fontSize: '14px' }}><strong>Non-Custodial Design</strong></td>
            <td style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #1F2937', color: 'var(--text-muted)', fontSize: '14px' }}>The operators have absolutely no access to user funds. NFT positions are minted directly to the depositor&apos;s wallet, ensuring that only the user can authorize withdrawals.</td>
          </tr>
          <tr>
            <td style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #1F2937', color: 'var(--text-muted)', fontSize: '14px' }}><strong>Permissionless Rebalancing</strong></td>
            <td style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #1F2937', color: 'var(--text-muted)', fontSize: '14px' }}>While the Rust Keeper Bot automates the process, the `rebalance()` function is entirely permissionless. In the event the official bot goes offline, any user or third party can call the function to re-center the liquidity.</td>
          </tr>
          <tr>
            <td style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #1F2937', color: 'var(--text-muted)', fontSize: '14px' }}><strong>Strict State Validation</strong></td>
            <td style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #1F2937', color: 'var(--text-muted)', fontSize: '14px' }}>The Vault uses exact `msg.sender` validation and Aerodrome `NonfungiblePositionManager` verifications to ensure that only the rightful owner of a position can withdraw or modify it.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
