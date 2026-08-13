const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");

    const VAULT_ADDRESS = "0x623Cef80f15eE6FF68F7E82cc92adC90Ce9AD97D";
    const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
    const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    const POOL_ADDRESS = "0x3fe04a59ebd38cf06080a6f60a98d124eb59392a";
    
    const TEST_USER = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik for testing, we'll override approvals
    
    const POOL_ABI = [
        "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, bool unlocked)",
        "function tickSpacing() external view returns (int24)"
    ];
    
    const poolContract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, provider);
    const slot0 = await poolContract.slot0();
    const currentTick = Number(slot0.tick);
    const tickSpacing = Number(await poolContract.tickSpacing());
    console.log("Pool Tick Spacing:", tickSpacing);
    
    const wEthVal = 0;
    const usdcVal = 5;
    
    const ratio = Math.pow(1.0001, currentTick);
    const wethPriceUsd = ratio * Math.pow(10, 12); 
    const wethTokens = wEthVal / wethPriceUsd;
    const usdcTokens = usdcVal;
    
    const wethWei = ethers.parseUnits(wethTokens.toFixed(18), 18);
    const usdcMwei = ethers.parseUnits(usdcTokens.toFixed(6), 6);
    
    // Test the same math from the frontend
    const tickLower = currentTick - (currentTick % 50) - 150;
    const tickUpper = currentTick - (currentTick % 50) + 150;
    
    console.log("Current Tick:", currentTick);
    console.log("Tick Lower:", tickLower);
    console.log("Tick Upper:", tickUpper);
    console.log("WETH Wei:", wethWei.toString());
    console.log("USDC Mwei:", usdcMwei.toString());
    
    const VAULT_ABI = [
        "function depositAndStake(uint256 amount0ToAdd, uint256 amount1ToAdd, uint256 amount0Min, uint256 amount1Min, int24 tickSpacing, int24 tickLower, int24 tickUpper) external returns (uint256)"
    ];
    
    const vaultIface = new ethers.Interface(VAULT_ABI);
    const data = vaultIface.encodeFunctionData("depositAndStake", [
        wethWei, usdcMwei, 0, 0, 50, tickLower, tickUpper
    ]);
    
    const vaultContractTest = new ethers.Contract(VAULT_ADDRESS, [
        "function gauge() external view returns (address)",
        "function positionManager() external view returns (address)"
    ], provider);
    const gaugeAddr = await vaultContractTest.gauge();
    const posManagerAddr = await vaultContractTest.positionManager();
    console.log("Vault Gauge:", gaugeAddr);
    console.log("Vault PositionManager:", posManagerAddr);
    
    // Create raw JSON RPC request with state overrides
    // Allowance mapping slot calculation
    const encodeSlot = (addr, slot) => ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [addr, slot]));
    
    // WETH balance slot is 3
    const wethBalSlot = encodeSlot(TEST_USER, 3);
    // WETH allowance slot is 4
    const wethAllowSlot = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["address", "bytes32"], [VAULT_ADDRESS, encodeSlot(TEST_USER, 4)]));
    
    // USDC balance slot is 9 (on Base, Circle USDC uses slot 9)
    const usdcBalSlot = encodeSlot(TEST_USER, 9);
    // USDC allowance slot is 10
    const usdcAllowSlot = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["address", "bytes32"], [VAULT_ADDRESS, encodeSlot(TEST_USER, 10)]));

    const stateOverrides = {
        [WETH_ADDRESS]: {
            stateDiff: {
                [wethBalSlot]: ethers.toBeHex(ethers.parseEther("100"), 32),
                [wethAllowSlot]: ethers.toBeHex(ethers.parseEther("100"), 32)
            }
        },
        [USDC_ADDRESS]: {
            stateDiff: {
                [usdcBalSlot]: ethers.toBeHex(ethers.parseUnits("10000", 6), 32),
                [usdcAllowSlot]: ethers.toBeHex(ethers.parseUnits("10000", 6), 32)
            }
        },
        [TEST_USER]: {
            balance: ethers.toBeHex(ethers.parseEther("10"))
        }
    };
    
    try {
        const result = await provider.send("eth_call", [{
            to: VAULT_ADDRESS,
            from: TEST_USER,
            data: data
        }, "latest", stateOverrides]);
        console.log("Simulation succeeded! Result:", result);
    } catch (e) {
        console.log("Simulation reverted:", e.message);
        if (e.info) console.log(e.info);
    }
}

main().catch(console.error);
