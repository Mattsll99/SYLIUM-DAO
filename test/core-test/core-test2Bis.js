const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const chalk = require("chalk");

describe(chalk.magenta("CORE TEST"), function () {
  let governance; 
  let player1; 
  let player2; 
  let player3; 
  let player4; 
  let player5; 
  let Oracle; 
  let Aquafina; 
  let PoolFactory; 
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

  it("TESTING POOLS DEPLOYMENT AND DATA RETRIEVEMENT", async function() {
    const getSYLIUMPools = await ethers.getContractFactory("SYLIUMPools"); 

    console.log(chalk.blue("THE GOVERNANCE ADDS THE TOKENS TO THE POOL FACTORY")); 

    await PoolFactory.connect(governance).addVolatileToken("CRV", syCRV.address);
    await PoolFactory.connect(governance).addVolatileToken("UNI", syUNI.address);
    await PoolFactory.connect(governance).addVolatileToken("COMP", syCOMP.address);

    await PoolFactory.connect(governance).addStableToken("DAI", syDAI.address); 
    await PoolFactory.connect(governance).addStableToken("FRAX", syFRAX.address); 
    await PoolFactory.connect(governance).addStableToken("USDC", syUSDC.address); 


    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CREATING THE SYLIUM POOLS"))

    const CRVxDAIPool = await getSYLIUMPools.deploy(governance.address, "CRV", syCRV.address, "DAI", syDAI.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address);
    const UNIxFRAXPool = await getSYLIUMPools.deploy(governance.address, "UNI", syUNI.address, "FRAX", syFRAX.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address);
    const COMPxUSDCPool = await getSYLIUMPools.deploy(governance.address, "COMP", syCOMP.address, "USDC", syUSDC.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address);

    await CRVxDAIPool.deployed();
    await UNIxFRAXPool.deployed(); 
    await COMPxUSDCPool.deployed(); 

    console.log(chalk.blue("CRVxDAI POOL DEPLOYED"));
    console.log(chalk.blue("UNIxFRAX POOL DEPLOYED"));
    console.log(chalk.blue("COMPxUSDC POOL DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("FILLING POOLS RESERVES"));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("MINTING 300_000 SYCRV & 700_000 SYDAI TO CRVxDAI POOL"))
    const crvBalance = BigNumber.from("300000000000000000000000"); 
    const daiBalance = BigNumber.from("700000000000000000000000"); 
    await syCRV.mint_syCRV(CRVxDAIPool.address, crvBalance); 
    await syDAI.mint_syDAI(CRVxDAIPool.address, daiBalance);

    console.log(chalk.blue("MINTING 60_000 SYUNI & 700_000 SYFRAX TO UNIxFRAX POOL")); 
    const uniBalance = BigNumber.from("60000000000000000000000"); 
    const fraxBalance = BigNumber.from("700000000000000000000000"); 
    await syUNI.mint_syUNI(UNIxFRAXPool.address, uniBalance); 
    await syFRAX.mint_syFRAX(UNIxFRAXPool.address, fraxBalance); 

    console.log(chalk.blue("MINTING 5_000 SYCOMP & 700_000 SYUSDC TO COMPxUSDC POOL")); 
    const compBalance = BigNumber.from("5000000000000000000000"); 
    const usdcBalance = BigNumber.from("700000000000000000000000");
    await syCOMP.mint_syCOMP(COMPxUSDCPool.address, compBalance); 
    await syUSDC.mint_syUSDC(COMPxUSDCPool.address, usdcBalance);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("TESTING DATA RETRIEVEMENT"));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("GETTING THE PAIRES BALANCES")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxDAI Pool balance in USD"), await PoolFactory.callStatic.getPairBalance(CRVxDAIPool.address));
    console.log(chalk.blue("UNIxFRAX Pool balance in USD"), await PoolFactory.callStatic.getPairBalance(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxUSDC Pool balance in USD"), await PoolFactory.callStatic.getPairBalance(COMPxUSDCPool.address));

    console.log(chalk.blue("GETTING THE PAIRES VOLATILE BALANCES")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxDAI Pool  Volatile balance in USD"), await PoolFactory.callStatic.getPairVolatileBalance(CRVxDAIPool.address));
    console.log(chalk.blue("UNIxFRAX Pool Volatile balance in USD"), await PoolFactory.callStatic.getPairVolatileBalance(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxUSDC Pool Volatile balance in USD"), await PoolFactory.callStatic.getPairVolatileBalance(COMPxUSDCPool.address));

    
    console.log(chalk.blue("GETTING THE PAIRES STABLE BALANCES")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxDAI Pool  Stable balance in USD"), await PoolFactory.callStatic.getPairStableBalance(CRVxDAIPool.address));
    console.log(chalk.blue("UNIxFRAX Pool Stable balance in USD"), await PoolFactory.callStatic.getPairStableBalance(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxUSDC Pool Stable balance in USD"), await PoolFactory.callStatic.getPairStableBalance(COMPxUSDCPool.address));

    console.log(chalk.blue("GETTING THE PAIRES GLOBAL RATIOS")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxDAI Pool  Global ratio"), await PoolFactory.callStatic.getPairTotalRatio(CRVxDAIPool.address));
    console.log(chalk.blue("UNIxFRAX Pool Global ratio"), await PoolFactory.callStatic.getPairTotalRatio(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxUSDC Pool Global ratio"), await PoolFactory.callStatic.getPairTotalRatio(COMPxUSDCPool.address));

    console.log(chalk.blue("GETTING THE PAIRES VOLATILE RATIOS")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxDAI Pool  Volatile ratio"), await PoolFactory.callStatic.getPairVolatileRatio(CRVxDAIPool.address));
    console.log(chalk.blue("UNIxFRAX Pool Volatile ratio"), await PoolFactory.callStatic.getPairVolatileRatio(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxUSDC Pool Volatile ratio"), await PoolFactory.callStatic.getPairVolatileRatio(COMPxUSDCPool.address));

    console.log(chalk.blue("GETTING THE PAIRES STABLE RATIOS")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxDAI Pool  Stable ratio"), await PoolFactory.callStatic.getPairStableRatio(CRVxDAIPool.address));
    console.log(chalk.blue("UNIxFRAX Pool Stable ratio"), await PoolFactory.callStatic.getPairStableRatio(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxUSDC Pool Stable ratio"), await PoolFactory.callStatic.getPairStableRatio(COMPxUSDCPool.address));

    console.log(chalk.blue("TRANSACTION TESTING FOR THE CRVxDAI POOL")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE VERIFIES THE CRVxDAI POO FOR SYLI AND SYLIX and stSYLIX")); 
    console.log(chalk.blue("============================================="));

    await SYLI.connect(governance).setPoolAllowance(CRVxDAIPool.address);
    await SYLIX.connect(governance).setVerification(CRVxDAIPool.address);
    await stSYLIX.connect(governance).setVerification(CRVxDAIPool.address);

    console.log(chalk.blue("MINTING 1_000_000 SYCRV, 1_000_000 SYDAY  AND 100_000 SYLIX TO EACH PLAYER"))
    const crvPlayerBalance = BigNumber.from("1000000000000000000000000");
    const daiPlayerBalance = BigNumber.from("1000000000000000000000000"); 
    const sylixBalance = BigNumber.from("100000000000000000000000");

    await syCRV.mint_syCRV(player1.address, crvPlayerBalance);
    await syCRV.mint_syCRV(player2.address, crvPlayerBalance);
    await syCRV.mint_syCRV(player3.address, crvPlayerBalance);
    await syCRV.mint_syCRV(player4.address, crvPlayerBalance);
    await syCRV.mint_syCRV(player5.address, crvPlayerBalance);

    await syCRV.connect(player1).approve(CRVxDAIPool.address, crvPlayerBalance);
    await syCRV.connect(player2).approve(CRVxDAIPool.address, crvPlayerBalance);
    await syCRV.connect(player3).approve(CRVxDAIPool.address, crvPlayerBalance);
    await syCRV.connect(player4).approve(CRVxDAIPool.address, crvPlayerBalance);
    await syCRV.connect(player5).approve(CRVxDAIPool.address, crvPlayerBalance);

    await syDAI.mint_syDAI(player1.address, daiPlayerBalance);
    await syDAI.mint_syDAI(player2.address, daiPlayerBalance);
    await syDAI.mint_syDAI(player3.address, daiPlayerBalance);
    await syDAI.mint_syDAI(player4.address, daiPlayerBalance);
    await syDAI.mint_syDAI(player5.address, daiPlayerBalance);

    await syDAI.connect(player1).approve(CRVxDAIPool.address, daiPlayerBalance);
    await syDAI.connect(player2).approve(CRVxDAIPool.address, daiPlayerBalance);
    await syDAI.connect(player3).approve(CRVxDAIPool.address, daiPlayerBalance);
    await syDAI.connect(player4).approve(CRVxDAIPool.address, daiPlayerBalance);
    await syDAI.connect(player5).approve(CRVxDAIPool.address, daiPlayerBalance);

    await SYLIX.mintSylix(player1.address, sylixBalance); 
    await SYLIX.mintSylix(player2.address, sylixBalance); 
    await SYLIX.mintSylix(player3.address, sylixBalance); 
    await SYLIX.mintSylix(player4.address, sylixBalance); 
    await SYLIX.mintSylix(player5.address, sylixBalance); 

    await SYLIX.connect(player1).approve(CRVxDAIPool.address, sylixBalance);
    await SYLIX.connect(player2).approve(CRVxDAIPool.address, sylixBalance);
    await SYLIX.connect(player3).approve(CRVxDAIPool.address, sylixBalance);
    await SYLIX.connect(player4).approve(CRVxDAIPool.address, sylixBalance);
    await SYLIX.connect(player5).approve(CRVxDAIPool.address, sylixBalance);

    // SET ALPHA
    console.log(chalk.blue("THE GOVERNANCE SETS AN ALPHA OF 20% FOR THE CRVxDAI POOL")); 
    console.log(chalk.blue("============================================="));
    await CRVxDAIPool.connect(governance).setAlpha(20);

    // SET MINTING FEES
    await CRVxDAIPool.connect(governance).setMintingFees(30);

    console.log(await CRVxDAIPool.callStatic.getSyliInCollateral());

    console.log(chalk.blue("EACH PLAYER MINTS 100_000_000 SYLI"));

    const syliBalance = BigNumber.from("1000000000000000000000000");

    await CRVxDAIPool.connect(player1).mintSYLI(syliBalance);
    await CRVxDAIPool.connect(player2).mintSYLI(syliBalance);
    await CRVxDAIPool.connect(player3).mintSYLI(syliBalance);
    await CRVxDAIPool.connect(player4).mintSYLI(syliBalance);
    await CRVxDAIPool.connect(player5).mintSYLI(syliBalance);

    console.log(chalk.blue("UPDATED SYLI BALANCES")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("PLAYER 1 SYLI BALANCE: "), await SYLI.balanceOf(player1.address));
    console.log(chalk.blue("PLAYER 2 SYLI BALANCE: "), await SYLI.balanceOf(player2.address));
    console.log(chalk.blue("PLAYER 3 SYLI BALANCE: "), await SYLI.balanceOf(player3.address));
    console.log(chalk.blue("PLAYER 4 SYLI BALANCE: "), await SYLI.balanceOf(player4.address));
    console.log(chalk.blue("PLAYER 5 SYLI BALANCE: "), await SYLI.balanceOf(player5.address));

    console.log(chalk.blue("UPDATED stSYLI BALANCES")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("PLAYER 1 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player1.address));
    console.log(chalk.blue("PLAYER 2 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player2.address));
    console.log(chalk.blue("PLAYER 3 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player3.address));
    console.log(chalk.blue("PLAYER 4 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player4.address));
    console.log(chalk.blue("PLAYER 5 stSYLIX BALANCE: "), await stSYLIX.balanceOf(player5.address));

    console.log(chalk.blue("PLAYER 1 POOL SHARES; "), await CRVxDAIPool.connect(player1).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 2 POOL SHARES; "), await CRVxDAIPool.connect(player2).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 3 POOL SHARES; "), await CRVxDAIPool.connect(player3).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 4 POOL SHARES; "), await CRVxDAIPool.connect(player4).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 5 POOL SHARES; "), await CRVxDAIPool.connect(player5).callStatic.getPoolShares());

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("PLAYER 1 USES A BOOST FOR THE CRVxDAI POOL")); 
    console.log(chalk.blue("============================================="));

    await stSYLIX.connect(player1).approve(CRVxDAIPool.address, await stSYLIX.balanceOf(player1.address));
    const amount = await stSYLIX.balanceOf(player1.address);
   
    console.log(chalk.blue("UPDATED POOL SHARES"));
    console.log(chalk.blue("PLAYER 1 POOL SHARES; "), await CRVxDAIPool.connect(player1).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 2 POOL SHARES; "), await CRVxDAIPool.connect(player2).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 3 POOL SHARES; "), await CRVxDAIPool.connect(player3).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 4 POOL SHARES; "), await CRVxDAIPool.connect(player4).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 5 POOL SHARES; "), await CRVxDAIPool.connect(player5).callStatic.getPoolShares());

    console.log(chalk.blue("PLAYER 1 GIVES BACK HALF OF HIS BOOSTS TO THE CRVxDAI POOL")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("UPDATED POOL SHARES"));
    console.log(chalk.blue("PLAYER 1 POOL SHARES; "), await CRVxDAIPool.connect(player1).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 2 POOL SHARES; "), await CRVxDAIPool.connect(player2).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 3 POOL SHARES; "), await CRVxDAIPool.connect(player3).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 4 POOL SHARES; "), await CRVxDAIPool.connect(player4).callStatic.getPoolShares());
    console.log(chalk.blue("PLAYER 5 POOL SHARES; "), await CRVxDAIPool.connect(player5).callStatic.getPoolShares());

    console.log(chalk.blue("MOCK VARIATION TESTING")); 
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("SIMULATION OF A 6% PRICE DROP FOR CRV TOKEN"))
    console.log(chalk.blue("CRVxDAI POOL RESERVE IN USD: "), await CRVxDAIPool.callStatic.getReserveValue());
    console.log(await CRVxDAIPool.callStatic.mockRatioController(BigNumber.from("60000000000000000"))); //10% variation
  })
})