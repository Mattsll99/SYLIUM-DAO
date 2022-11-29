const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const chalk = require("chalk");

describe(chalk.blue("Core test"), function () {
  let governance; 
  let player1; 
  let player2; 
  let player3; 
  let player4; 
  let player5; 
  let Oracle; 
  let Aquafina; 
  let PoolFactory; 
  let POR;
  let RewardsController;
  let Exchange;
  let SYLI; 
  let SYLIX; 
  let stSYLIX;
  let syAAVE; 
  let syCAKE; 
  let syCOMP; 
  let syCRV; 
  let syDAI; 
  let syETH; 
  let syFRAX;
  let syLINK; 
  let syMKR; 
  let sySUSHI; 
  let syUNI; 
  let syUSDC; 
  let syUSDT;

  before(async () => {
    [governance, player1, player2, player3, player4, player5] = await ethers.getSigners();

    const getSyAAVE = await ethers.getContractFactory("syAAVE");
    const getSyCAKE = await ethers.getContractFactory("syCAKE");
    const getSyCOMP = await ethers.getContractFactory("syCOMP");
    const getSyCRV = await ethers.getContractFactory("syCRV");
    const getSyDAI = await ethers.getContractFactory("syDAI");
    const getSyETH = await ethers.getContractFactory("syETH");
    const getSyFRAX = await ethers.getContractFactory("syFRAX");
    const getSyLINK = await ethers.getContractFactory("syLINK");
    const getSyMKR = await ethers.getContractFactory("syMKR");
    const getSySUSHI = await ethers.getContractFactory("sySUSHI");
    const getSyUNI = await ethers.getContractFactory("syUNI");
    const getSyUSDC = await ethers.getContractFactory("syUSDC");
    const getSyUSDT = await ethers.getContractFactory("syUSDT");

    syAAVE = await getSyAAVE.deploy();
    syCAKE = await getSyCAKE.deploy();
    syCOMP = await getSyCOMP.deploy();
    syCRV = await getSyCRV.deploy();
    syDAI = await getSyDAI.deploy();
    syETH = await getSyETH.deploy();
    syFRAX = await getSyFRAX.deploy();
    syLINK = await getSyLINK.deploy();
    syMKR = await getSyMKR.deploy();
    sySUSHI = await getSySUSHI.deploy();
    syUNI = await getSyUNI.deploy();
    syUSDC = await getSyUSDC.deploy();
    syUSDT = await getSyUSDT.deploy();
   
    await syAAVE.deployed();
    await syCAKE.deployed();
    await syCOMP.deployed();
    await syCRV.deployed();
    await syDAI.deployed();
    await syETH.deployed();
    await syFRAX.deployed();
    await syLINK.deployed();
    await syMKR.deployed();
    await sySUSHI.deployed();
    await syUSDC.deployed();
    await syUNI.deployed();
    await syUSDT.deployed();

    console.log(chalk.blue("MOCK TOKENS DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getOracle = await ethers.getContractFactory("Oracle");
    Oracle = await getOracle.deploy(governance.address); 
    await Oracle.deployed();
    console.log(chalk.blue("ORACLE DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE ADDS ALL THE PRICE FEEDS"))
    await Oracle.connect(governance).addPriceFeed("ETH", "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");
    await Oracle.connect(governance).addPriceFeed("AAVE", "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9");
    await Oracle.connect(governance).addPriceFeed("CAKE", "0xEb0adf5C06861d6c07174288ce4D0a8128164003");
    await Oracle.connect(governance).addPriceFeed("COMP", "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5");
    await Oracle.connect(governance).addPriceFeed("CRV", "0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f");
    await Oracle.connect(governance).addPriceFeed("DAI", "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9");
    await Oracle.connect(governance).addPriceFeed("FRAX", "0xB9E1E3A9feFf48998E45Fa90847ed4D467E8BcfD");
    await Oracle.connect(governance).addPriceFeed("LINK", "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c");
    await Oracle.connect(governance).addPriceFeed("MKR", "0xec1D1B3b0443256cc3860e24a46F108e699484Aa");
    await Oracle.connect(governance).addPriceFeed("SUSHI", "0xCc70F09A6CC17553b2E31954cD36E4A2d89501f7");
    await Oracle.connect(governance).addPriceFeed("USDC", "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6");
    await Oracle.connect(governance).addPriceFeed("UNI", "0x553303d460EE0afB37EdFf9bE42922D8FF63220e");
    await Oracle.connect(governance).addPriceFeed("USDT", "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D");

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getAquafina = await ethers.getContractFactory("Aquafina");
    Aquafina = await getAquafina.deploy(governance.address, Oracle.address);
    await Aquafina.deployed();
    console.log(chalk.blue("AQUAFINA DEPLOYED")); 

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getPoolFactory = await ethers.getContractFactory("poolFactory");
    PoolFactory = await getPoolFactory.deploy(governance.address, Oracle.address); 
    await PoolFactory.deployed(); 
    console.log(chalk.blue("POOL FACTORY DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getRewardsController = await ethers.getContractFactory("rewardsController");
    RewardsController = await getRewardsController.deploy(governance.address, Oracle.address); 
    await RewardsController.deployed(); 
    console.log(chalk.blue("REWARDS CONTROLLER DEPLOYED"));

    console.log(chalk.blue("THE GOVERNANCE ADDS ALL THE TOKENS TO THE REWARDS CONTROLLER")); 
    await RewardsController.connect(governance).addToken("AAVE", syAAVE.address);
    await RewardsController.connect(governance).addToken("CAKE", syCAKE.address);
    await RewardsController.connect(governance).addToken("COMP", syCOMP.address);
    await RewardsController.connect(governance).addToken("CRV", syCRV.address);
    await RewardsController.connect(governance).addToken("DAI", syDAI.address);
    await RewardsController.connect(governance).addToken("ETH", syETH.address);
    await RewardsController.connect(governance).addToken("FRAX", syFRAX.address);
    await RewardsController.connect(governance).addToken("LINK", syLINK.address);
    await RewardsController.connect(governance).addToken("MKR", syMKR.address);
    await RewardsController.connect(governance).addToken("SUSHI", sySUSHI.address);
    await RewardsController.connect(governance).addToken("UNI", syUNI.address);
    await RewardsController.connect(governance).addToken("USDC", syUSDC.address);
    await RewardsController.connect(governance).addToken("USDT", syUSDT.address);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getSYLI = await ethers.getContractFactory("SYLI"); 
    SYLI = await getSYLI.deploy(governance.address); 
    await SYLI.deployed(); 
    console.log(chalk.blue("SYLI DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getSYLIX = await ethers.getContractFactory("SYLIX"); 
    SYLIX = await getSYLIX.deploy(governance.address); 
    await SYLIX.deployed(); 
    console.log(chalk.blue("SYLIX DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getStSYLIX = await ethers.getContractFactory("stSYLIX"); 
    stSYLIX = await getStSYLIX.deploy(governance.address); 
    await stSYLIX.deployed(); 
    console.log(chalk.blue("stSYLIX DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getPOR = await ethers.getContractFactory("POR"); 
    POR = await getPOR.deploy(governance.address, Oracle.address,RewardsController.address, stSYLIX.address);
    await POR.deployed(); 
    console.log(chalk.blue("P.O.R. DEPLOYED"));

    console.log(chalk.blue("THE GOVERNANCE SETS ALL THE AQUAFINA STARTERS"));
    await Aquafina.connect(governance).setTokenStarter("ETH");
    await Aquafina.connect(governance).setTokenStarter("AAVE");
    await Aquafina.connect(governance).setTokenStarter("CAKE");
    await Aquafina.connect(governance).setTokenStarter("COMP");
    await Aquafina.connect(governance).setTokenStarter("CRV");
    await Aquafina.connect(governance).setTokenStarter("LINK");
    await Aquafina.connect(governance).setTokenStarter("MKR");
    await Aquafina.connect(governance).setTokenStarter("SUSHI");
    await Aquafina.connect(governance).setTokenStarter("UNI");

  })
  it(chalk.blue("TRANSACTION TESTING"), async function() {
    
    console.log(chalk.blue("OPENING TWO POOLS"))
    const getSYLIUMPools = await ethers.getContractFactory("SYLIUMPools");
    const AAVExDAIPool = await getSYLIUMPools.deploy(governance.address, "AAVE", syAAVE.address, "DAI", syDAI.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 
    const CRVxFRAXPool = await getSYLIUMPools.deploy(governance.address, "CRV", syCRV.address, "FRAX", syFRAX.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address);
    await AAVExDAIPool.deployed(); 
    await CRVxFRAXPool.deployed(); 
    console.log(chalk.blue("AAVExDAI POOL DEPLOYED")); 
    console.log(chalk.blue("CRVxFRAX POOL DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("OPENING AAVExDAI EMERGENCY POOL & CRVxFRAX EMERGENCY POOL")); 
    const getEmergencyPools = await ethers.getContractFactory("emergencyPools");
    const AAVExDAIEmergencyPool = await getEmergencyPools.deploy(governance.address, Oracle.address);
    const CRVxFRAXEmergencyPool = await getEmergencyPools.deploy(governance.address, Oracle.address);
    await AAVExDAIEmergencyPool.deployed(); 
    await CRVxFRAXEmergencyPool.deployed();
    console.log(chalk.blue("AAVExDAI EMERGENCY POOL DEPLOYED")); 
    console.log(chalk.blue("CRVxFRAX EMERGENCY POOL DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("OPENING AAVExDAI REWARDS POOL & CRVxFRAX REWARDS POOL"));
    const getRewardsPools = await ethers.getContractFactory("poolRewards"); 
    const AAVExDAIRewardsPool = await getRewardsPools.deploy(governance.address, Oracle.address);
    const CRVxFRAXRewardsPool = await getRewardsPools.deploy(governance.address, Oracle.address);
    await AAVExDAIRewardsPool.deployed();
    await CRVxFRAXRewardsPool.deployed();
    console.log(chalk.blue("AAVExDAI REWARDS POOL DEPLOYED")); 
    console.log(chalk.blue("CRVxFRAX REWARDS POOL DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCES LINKS UP THE TWO EMERGENCY POOLS TO THEIR TRANSACTION POOLS")); 
    await AAVExDAIEmergencyPool.connect(governance).linkSyliumPools(AAVExDAIPool.address, "DAI", syDAI.address);
    await CRVxFRAXEmergencyPool.connect(governance).linkSyliumPools(CRVxFRAXPool.address, "FRAX", syFRAX.address);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE LINKS UP THE TWO TRANSACTION POOLS TO THEIR EMERGENCY POOLS"));
    await AAVExDAIPool.connect(governance).linkEmergencyPool(AAVExDAIEmergencyPool.address); 
    await CRVxFRAXPool.connect(governance).linkEmergencyPool(CRVxFRAXEmergencyPool.address);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE LINKS UP BOTH OF THE TRANSACTION POOLS WITH THE REWARDS CONTROLLER"));
    await AAVExDAIPool.connect(governance).linkRewardsController(RewardsController.address); 
    await CRVxFRAXPool.connect(governance).linkRewardsController(RewardsController.address);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE LINKS UP BOTH OF THE TRANSACTION POOLS WITH THEIR REWARDS POOLS"));
    await AAVExDAIPool.connect(governance).linkRewardsPool(AAVExDAIRewardsPool.address); 
    await CRVxFRAXPool.connect(governance).linkRewardsPool(CRVxFRAXRewardsPool.address);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("FILLING THE TWO EMERGENCY POOLS WITH WORTH $500_000 OF STABLECOINS"))
    const genesisBalance = BigNumber.from("500000000000000000000000");
    await syDAI.mint_syDAI(AAVExDAIEmergencyPool.address, genesisBalance);
    await syFRAX.mint_syFRAX(CRVxFRAXEmergencyPool.address, genesisBalance);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("PROVIDING 70 CENTS OF STABLECOIN AND 30 CENTS OF VOLATILE TOKEN TO THE POOL FOR DATA GATHERING & EQUATIONS"))
    const genesisStableBalance = BigNumber.from("700000000000000000");
    const genesisCrvBalance = BigNumber.from("300000000000000000");
    const genesisAaveBalance = BigNumber.from("4000000000000000");

    await syDAI.mint_syDAI(AAVExDAIPool.address, genesisStableBalance);
    await syFRAX.mint_syFRAX(CRVxFRAXPool.address, genesisStableBalance);
    await syCRV.mint_syCRV(CRVxFRAXPool.address, genesisCrvBalance);
    await syAAVE.mint_syAAVE(AAVExDAIPool.address, genesisAaveBalance);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("DATA GATHERING FOR THE AAVExDAI POOL")); 
    console.log(chalk.blue("AAVExDAI POOL TOKEN RESERVE: "), await AAVExDAIPool.getReserve());
    console.log(chalk.blue("AAVExDAI POOL RESERVE VALUE; "), await AAVExDAIPool.callStatic.getReserveValue());
    console.log(chalk.blue("AAVExDAI POOL TOTAL RESERVE VALUE: "), await AAVExDAIPool.callStatic.getTotalReserveValue());
    console.log(chalk.blue("AAVExDAI POOL INTER RATIO: "), await AAVExDAIPool.callStatic.getInterRatio());
    console.log(chalk.blue("AAVE REGULATOR: "), await AAVExDAIPool.callStatic.getRegulator());
    console.log(chalk.blue("AAVE EQUALIZER: "), await AAVExDAIPool.callStatic.getEqualizer());
    console.log(chalk.blue("ALGORITHMIC DESIGN: "), await AAVExDAIPool.callStatic.getAlgorithmicDesign());
    console.log(chalk.blue("SYLI IN COLLATERAL: "), await AAVExDAIPool.callStatic.getSyliInCollateral());

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("DATA GATHERING FOR THE CRVxFRAX POOL"));
    console.log(chalk.blue("CRVxFRAX POOL TOKEN RESERVE: "), await CRVxFRAXPool.getReserve());
    console.log(chalk.blue("CRVxFRAX POOL RESERVE VALUE; "), await CRVxFRAXPool.callStatic.getReserveValue());
    console.log(chalk.blue("CRVxFRAX POOL TOTAL RESERVE VALUE: "), await CRVxFRAXPool.callStatic.getTotalReserveValue());
    console.log(chalk.blue("CRVxFRAX POOL INTER RATIO: "), await CRVxFRAXPool.callStatic.getInterRatio());
    console.log(chalk.blue("CRV REGULATOR: "), await CRVxFRAXPool.callStatic.getRegulator());
    console.log(chalk.blue("CRV EQUALIZER: "), await CRVxFRAXPool.callStatic.getEqualizer());
    console.log(chalk.blue("ALGORITHMIC DESIGN: "), await CRVxFRAXPool.callStatic.getAlgorithmicDesign());
    console.log(chalk.blue("SYLI IN COLLATERAL: "), await CRVxFRAXPool.callStatic.getSyliInCollateral());

    console.log(chalk.blue("SENDING WORTH $120_OO0 OF TOKENS TO EACH PLAYERS (FOR BOTH POOLS)"))
    //SyDAI MINTING
    const daiPlayerBalance = BigNumber.from("70000000000000000000000")
    await syDAI.mint_syDAI(player1.address, daiPlayerBalance);
    await syDAI.mint_syDAI(player2.address, daiPlayerBalance);
    await syDAI.mint_syDAI(player3.address, daiPlayerBalance);
    await syDAI.mint_syDAI(player4.address, daiPlayerBalance);
    await syDAI.mint_syDAI(player5.address, daiPlayerBalance);
    //SyFRAX MINTING
    const fraxPlayerBalance = BigNumber.from("70000000000000000000000")
    await syFRAX.mint_syFRAX(player1.address, fraxPlayerBalance);
    await syFRAX.mint_syFRAX(player2.address, fraxPlayerBalance);
    await syFRAX.mint_syFRAX(player3.address, fraxPlayerBalance);
    await syFRAX.mint_syFRAX(player4.address, fraxPlayerBalance);
    await syFRAX.mint_syFRAX(player5.address, fraxPlayerBalance);
    //SYAAVE MINTING
    const aavePlayerBalance = BigNumber.from("4100000000000000000000")
    await syAAVE.mint_syAAVE(player1.address, aavePlayerBalance);
    await syAAVE.mint_syAAVE(player2.address, aavePlayerBalance);
    await syAAVE.mint_syAAVE(player3.address, aavePlayerBalance);
    await syAAVE.mint_syAAVE(player4.address, aavePlayerBalance);
    await syAAVE.mint_syAAVE(player5.address, aavePlayerBalance);
    //SyCRV MINTING
    const crvPlayerBalance = BigNumber.from("357000000000000000000000")
    await syCRV.mint_syCRV(player1.address, crvPlayerBalance);
    await syCRV.mint_syCRV(player2.address, crvPlayerBalance);
    await syCRV.mint_syCRV(player3.address, crvPlayerBalance);
    await syCRV.mint_syCRV(player4.address, crvPlayerBalance);
    await syCRV.mint_syCRV(player5.address, crvPlayerBalance);
    //SYLIX MINTING; 
    const sylixPlayerBalance = BigNumber.from("2000000000000000000000");
    await SYLIX.mintSylix(player1.address, sylixPlayerBalance);
    await SYLIX.mintSylix(player2.address, sylixPlayerBalance);
    await SYLIX.mintSylix(player3.address, sylixPlayerBalance);
    await SYLIX.mintSylix(player4.address, sylixPlayerBalance);
    await SYLIX.mintSylix(player5.address, sylixPlayerBalance);

    console.log(chalk.blue("GETTING THE ALLOWANCES FOR ALL THE TOKENS"));
    //DAI ALLOWANCE
    await syDAI.connect(player1).approve(AAVExDAIPool.address, await syDAI.balanceOf(player1.address));
    await syDAI.connect(player2).approve(AAVExDAIPool.address, await syDAI.balanceOf(player2.address));
    await syDAI.connect(player3).approve(AAVExDAIPool.address, await syDAI.balanceOf(player3.address));
    await syDAI.connect(player4).approve(AAVExDAIPool.address, await syDAI.balanceOf(player4.address));
    await syDAI.connect(player5).approve(AAVExDAIPool.address, await syDAI.balanceOf(player5.address));
    //FRAX ALLOWANCE
    await syFRAX.connect(player1).approve(CRVxFRAXPool.address, await syFRAX.balanceOf(player1.address));
    await syFRAX.connect(player2).approve(CRVxFRAXPool.address, await syFRAX.balanceOf(player2.address));
    await syFRAX.connect(player3).approve(CRVxFRAXPool.address, await syFRAX.balanceOf(player3.address));
    await syFRAX.connect(player4).approve(CRVxFRAXPool.address, await syFRAX.balanceOf(player4.address));
    await syFRAX.connect(player5).approve(CRVxFRAXPool.address, await syFRAX.balanceOf(player5.address));
    //CRV ALLOWANCE
    await syCRV.connect(player1).approve(CRVxFRAXPool.address, await syCRV.balanceOf(player1.address));
    await syCRV.connect(player2).approve(CRVxFRAXPool.address, await syCRV.balanceOf(player2.address));
    await syCRV.connect(player3).approve(CRVxFRAXPool.address, await syCRV.balanceOf(player3.address));
    await syCRV.connect(player4).approve(CRVxFRAXPool.address, await syCRV.balanceOf(player4.address));
    await syCRV.connect(player5).approve(CRVxFRAXPool.address, await syCRV.balanceOf(player5.address));
    //AAVE ALLOWANCE
    await syAAVE.connect(player1).approve(AAVExDAIPool.address, await syAAVE.balanceOf(player1.address));
    await syAAVE.connect(player2).approve(AAVExDAIPool.address, await syAAVE.balanceOf(player2.address));
    await syAAVE.connect(player3).approve(AAVExDAIPool.address, await syAAVE.balanceOf(player3.address));
    await syAAVE.connect(player4).approve(AAVExDAIPool.address, await syAAVE.balanceOf(player4.address));
    await syAAVE.connect(player5).approve(AAVExDAIPool.address, await syAAVE.balanceOf(player5.address));
    //SYLIX ALLOWANCE FOR AAVEXDAI POOL
    await SYLIX.connect(player1).approve(AAVExDAIPool.address, await SYLIX.balanceOf(player1.address));
    await SYLIX.connect(player2).approve(AAVExDAIPool.address, await SYLIX.balanceOf(player2.address));
    await SYLIX.connect(player3).approve(AAVExDAIPool.address, await SYLIX.balanceOf(player3.address));
    await SYLIX.connect(player4).approve(AAVExDAIPool.address, await SYLIX.balanceOf(player4.address));
    await SYLIX.connect(player5).approve(AAVExDAIPool.address, await SYLIX.balanceOf(player5.address));
    //SYLIX ALLOWANCE FOR CRVXFRAX POOL
    await SYLIX.connect(player1).approve(CRVxFRAXPool.address, await SYLIX.balanceOf(player1.address));
    await SYLIX.connect(player2).approve(CRVxFRAXPool.address, await SYLIX.balanceOf(player2.address));
    await SYLIX.connect(player3).approve(CRVxFRAXPool.address, await SYLIX.balanceOf(player3.address));
    await SYLIX.connect(player4).approve(CRVxFRAXPool.address, await SYLIX.balanceOf(player4.address));
    await SYLIX.connect(player5).approve(CRVxFRAXPool.address, await SYLIX.balanceOf(player5.address));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    /*console.log(chalk.blue("THE GOVERNANCE SETS A 10% ALPHA FOR AAVRxDAI POOL AND A 5% ALPHA FOR THE CRVxFRAX POOL"));
    await AAVExDAIPool.connect(governance).setAlpha(10); 
    await CRVxFRAXPool.connect(governance).setAlpha(5);*/

    console.log(chalk.blue("SYLI ALGORITHMIC DESIGN FROM AAVExDAI POOL: "), await AAVExDAIPool.callStatic.getAlgorithmicDesign());
    console.log(chalk.blue("SYLI ALGORITHMIC DESIGN FROM CRVxFRAX POOL: "), await CRVxFRAXPool.callStatic.getAlgorithmicDesign());

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("SETTING THE SYLIX AND stSYLIX VERIFICATION FOR BOTH POOLS"));
    await SYLI.connect(governance).setPoolAllowance(AAVExDAIPool.address); 
    await SYLI.connect(governance).setPoolAllowance(CRVxFRAXPool.address);
    await SYLIX.connect(governance).setVerification(AAVExDAIPool.address);
    await SYLIX.connect(governance).setVerification(CRVxFRAXPool.address);
    await stSYLIX.connect(governance).setVerification(AAVExDAIPool.address); 
    await stSYLIX.connect(governance).setVerification(CRVxFRAXPool.address);

    console.log(chalk.blue("THE GOVERNANCE SETS A 3 PERCENT FEES FOR BOTH POOL"));
    const fees = BigNumber.from("30000000000000000")
    await AAVExDAIPool.connect(governance).setMintingFees(fees);
    await CRVxFRAXPool.connect(governance).setMintingFees(fees);
    await AAVExDAIPool.connect(governance).setRedemptionFees(fees); 
    await CRVxFRAXPool.connect(governance).setRedemptionFees(fees);

    console.log(chalk.blue("MINTING TRANSACTION FOR THE FIRST POOL (+ PRECISION AND FEES COLLECTNG)"))
    //Each player mints 5_000 SYLI from the AAVExDAIPool 
    const SYLIBalance = BigNumber.from("5000000000000000000000")
    await AAVExDAIPool.connect(player1).mintSYLI(SYLIBalance);
    await AAVExDAIPool.connect(player2).mintSYLI(SYLIBalance);
    await AAVExDAIPool.connect(player3).mintSYLI(SYLIBalance);
    await AAVExDAIPool.connect(player4).mintSYLI(SYLIBalance);
    await AAVExDAIPool.connect(player5).mintSYLI(SYLIBalance);

    console.log(chalk.blue("PLAYER 1 SYLI BALANCE: "), await SYLI.balanceOf(player1.address));
    console.log(chalk.blue("PLAYER 1 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player1.address));

    console.log(chalk.blue("PLAYER 2 SYLI BALANCE: "), await SYLI.balanceOf(player2.address));
    console.log(chalk.blue("PLAYER 2 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player2.address));

    console.log(chalk.blue("PLAYER 3 SYLI BALANCE: "), await SYLI.balanceOf(player3.address));
    console.log(chalk.blue("PLAYER 3 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player3.address));

    console.log(chalk.blue("PLAYER 4 SYLI BALANCE: "), await SYLI.balanceOf(player4.address));
    console.log(chalk.blue("PLAYER 4 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player4.address));

    console.log(chalk.blue("PLAYER 5 SYLI BALANCE: "), await SYLI.balanceOf(player5.address));
    console.log(chalk.blue("PLAYER 5 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player5.address));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("UPDATED RESERVE FROM THE TRANSACTION POOL AND THE EMERGENCY POOL")); 
    console.log(chalk.blue("UPDATED TOTAL RESERVE VALUE: "), await AAVExDAIPool.callStatic.getTotalReserveValue())
    console.log(chalk.blue("UPDATED RATIOS: "), await AAVExDAIPool.callStatic.getInterRatio());


    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("SHARE DATA FROM THE AAVExDAI POOL")); 
    console.log(chalk.blue("PLAYER 1 SHARES FROM MINTING: "), await AAVExDAIPool.connect(player1).callStatic.sharesFromMinting());
    console.log(chalk.blue("PLAYER 2 SHARES FROM MINTING: "), await AAVExDAIPool.connect(player2).callStatic.sharesFromMinting());
    console.log(chalk.blue("PLAYER 3 SHARES FROM MINTING: "), await AAVExDAIPool.connect(player3).callStatic.sharesFromMinting());
    console.log(chalk.blue("PLAYER 4 SHARES FROM MINTING: "), await AAVExDAIPool.connect(player4).callStatic.sharesFromMinting());
    console.log(chalk.blue("PLAYER 5 SHARES FROM MINTING: "), await AAVExDAIPool.connect(player5).callStatic.sharesFromMinting());

    
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("ACCESSING REWARDS CONTROLLER DATA"));
    console.log("TOTAL FEES FOR REWARDS: ", await RewardsController.callStatic.getTotalFund());

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("ACCESSING REWARDS DATA (CLAIMABLE AND UPCOMING"));
    console.log(chalk.blue("POOL ESTIMATED A.P.R.: "), await AAVExDAIPool.callStatic.getEstimatedAPR());



    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("EXTREM PRICE'S DROP TO SIMULATE THE FILLING OF THE EMERGENCY POOL"))



    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("MINTING TRANSACTION FOR THE SECOND POOL (+ PRECISION AND FEES COLLECTNG)"))

    console.log(chalk.blue("REDEMPTION TRANSACTION FOR THE FIRST POOL (+ PRECISION AND FEES COLLECTNG)"))
    //Test redemption in the wrong pool

    console.log(chalk.blue("REDEMPTION TRANSACTION FOR THE SECOND POOL (+ PRECISION AND FEES COLLECTNG)"))


    console.log(chalk.blue("DATA COLLECTION IN THE POOL FACTORY")); 

    console.log(chalk.blue("DATA GATHERING FOT THE REWARDS POOL"));

    console.log(chalk.blue("SHARES POOLS EVALUATION INSIDE EACH POOL"))



    console.log(chalk.blue("INTERN TOKEN MANAGEMENT TESTING")); 

    console.log(chalk.blue("PRICE DROP SIMULATION TO TEST THE FILLING OF EACH POOLS"))


  })
})