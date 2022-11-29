const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const chalk = require("chalk");

describe(chalk.magenta("TOKEN MANAGEMENT TESTING"), function () {
  let governance;
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
    governance = await ethers.getSigner();

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
  });

  it(chalk.magenta("TESTING PAIRES MANAGEMENT"), async function() {
    const getSYLIUMPools = await ethers.getContractFactory("SYLIUMPools");

    console.log(chalk.blue("THE GOVERNANCE ADDS ALL THE VOLATILE TOKENS TO THE FACTORY"));
    await PoolFactory.connect(governance).addVolatileToken("CRV", syCRV.address);
    await PoolFactory.connect(governance).addVolatileToken("UNI", syUNI.address);
    await PoolFactory.connect(governance).addVolatileToken("COMP", syCOMP.address);
    await PoolFactory.connect(governance).addVolatileToken("ETH", syETH.address);
    await PoolFactory.connect(governance).addVolatileToken("CAKE", syCAKE.address);
    await PoolFactory.connect(governance).addVolatileToken("LINK", syLINK.address);
    await PoolFactory.connect(governance).addVolatileToken("MKR", syMKR.address);
    await PoolFactory.connect(governance).addVolatileToken("SUSHI", sySUSHI.address);
    await PoolFactory.connect(governance).addVolatileToken("AAVE", syAAVE.address);

    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE ADDS ALL THE STABLE TOKENS TO THE FACTORY"));
    await PoolFactory.connect(governance).addStableToken("FRAX", syFRAX.address);
    await PoolFactory.connect(governance).addStableToken("DAI", syDAI.address);
    await PoolFactory.connect(governance).addStableToken("USDC", syUSDC.address);
    await PoolFactory.connect(governance).addStableToken("USDT", syUSDT.address);

    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("DEPLOYING 10 POOLS"));

    const CRVxFRAXPool = await getSYLIUMPools.deploy(governance.address, "CRV", syCRV.address, "FRAX", syFRAX.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 
    const UNIxFRAXPool = await getSYLIUMPools.deploy(governance.address, "UNI", syUNI.address, "FRAX", syFRAX.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 
    const COMPxDAIPool = await getSYLIUMPools.deploy(governance.address, "COMP", syCOMP.address, "DAI", syDAI.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 
    const ETHxDAIPool = await getSYLIUMPools.deploy(governance.address, "ETH", syETH.address, "DAI", syDAI.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 
    const CAKExUSDCPool = await getSYLIUMPools.deploy(governance.address, "CAKE", syCAKE.address, "USDC", syUSDC.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 
    const LINKxUSDCPool = await getSYLIUMPools.deploy(governance.address, "LINK", syLINK.address, "USDC", syUSDC.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 
    const MKRxUSDTPool = await getSYLIUMPools.deploy(governance.address, "MKR", syMKR.address, "USDT", syUSDT.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 
    const SUSHIxUSDTPool = await getSYLIUMPools.deploy(governance.address, "SUSHI", sySUSHI.address, "USDT", syUSDT.address, Oracle.address, Aquafina.address, PoolFactory.address, SYLI.address, SYLIX.address, stSYLIX.address); 

    await CRVxFRAXPool.deployed(); 
    await UNIxFRAXPool.deployed(); 
    await COMPxDAIPool.deployed(); 
    await ETHxDAIPool.deployed(); 
    await CAKExUSDCPool.deployed(); 
    await LINKxUSDCPool.deployed();
    await MKRxUSDTPool.deployed(); 
    await SUSHIxUSDTPool.deployed();

    console.log(chalk.blue("THE 10 POOLS ARE DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("FILLING THE POOLS RESERVES (1_000_000) WITH RESPECT OF THE 70/30 RATIO"));
    const crvBalance = BigNumber.from("300000000000000000000000");
    const uniBalance = BigNumber.from("50000000000000000000000");
    const compBalance = BigNumber.from("4800000000000000000000");
    const ethBalance = BigNumber.from("230000000000000000000");
    const cakeBalance = BigNumber.from("65200000000000000000000");
    const linkBalance = BigNumber.from("39500000000000000000000");
    const mkrBalance = BigNumber.from("388000000000000000000");
    const sushiBalance = BigNumber.from("300000000000000000000000");

    const fraxBalance = BigNumber.from("700000000000000000000000");
    const daiBalance = BigNumber.from("700000000000000000000000");
    const usdcBalance = BigNumber.from("700000000000000000000000");
    const usdtBalance = BigNumber.from("700000000000000000000000");

    await syCRV.mint_syCRV(CRVxFRAXPool.address, crvBalance);
    await syFRAX.mint_syFRAX(CRVxFRAXPool.address, fraxBalance);

    await syUNI.mint_syUNI(UNIxFRAXPool.address, uniBalance); 
    await syFRAX.mint_syFRAX(UNIxFRAXPool.address, fraxBalance);

    await syCOMP.mint_syCOMP(COMPxDAIPool.address, compBalance);
    await syDAI.mint_syDAI(COMPxDAIPool.address, daiBalance);

    await syETH.mint_syETH(ETHxDAIPool.address, ethBalance);
    await syDAI.mint_syDAI(ETHxDAIPool.address, daiBalance);

    await syCAKE.mint_syCAKE(CAKExUSDCPool.address, cakeBalance); 
    await syUSDC.mint_syUSDC(CAKExUSDCPool.address, usdcBalance);

    await syLINK.mint_syLINK(LINKxUSDCPool.address, linkBalance); 
    await syUSDC.mint_syUSDC(LINKxUSDCPool.address, usdcBalance);

    await syMKR.mint_syMKR(MKRxUSDTPool.address, mkrBalance); 
    await syUSDT.mint_syUSDT(MKRxUSDTPool.address, usdtBalance);

    await sySUSHI.mint_sySUSHI(SUSHIxUSDTPool.address, sushiBalance); 
    await syUSDT.mint_syUSDT(SUSHIxUSDTPool.address, usdtBalance);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("GENESIS DATA RETRIEVEMENT"));

    console.log(chalk.blue("PROTOCOL TOTAL BALANCE: "), await PoolFactory.callStatic.getTotalBalance());
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxFRAX POOL GENESIS BALANCE: "), await PoolFactory.callStatic.getPairBalance(CRVxFRAXPool.address));
    console.log(chalk.blue("UNIxFRAX POOL GENESIS BALANCE: "), await PoolFactory.callStatic.getPairBalance(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxDAI POOL GENESIS BALANCE: "), await PoolFactory.callStatic.getPairBalance(COMPxDAIPool.address));
    console.log(chalk.blue("ETHxDAI POOL GENESIS BALANCE: "), await PoolFactory.callStatic.getPairBalance(ETHxDAIPool.address));
    console.log(chalk.blue("CAKExUSDC POOL GENESIS BALANCE: "), await PoolFactory.callStatic.getPairBalance(CAKExUSDCPool.address));
    console.log(chalk.blue("LINKxUSDC POOL GENESIS BALANCE: "), await PoolFactory.callStatic.getPairBalance(LINKxUSDCPool.address));
    console.log(chalk.blue("MKRxUSDT POOL GENESIS BALANCE: "), await PoolFactory.callStatic.getPairBalance(MKRxUSDTPool.address));
    console.log(chalk.blue("SUSHIxUSDT POOL GENESIS BALANCE: "), await PoolFactory.callStatic.getPairBalance(SUSHIxUSDTPool.address));

    console.log(chalk.blue("GETTING THE GENESIS TOTAL RATIO"))
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxFRAX POOL GENESIS TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(CRVxFRAXPool.address));
    console.log(chalk.blue("UNIxFRAX POOL GENESIS TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxDAI POOL GENESIS TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(COMPxDAIPool.address));
    console.log(chalk.blue("ETHxDAI POOL GENESIS TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(ETHxDAIPool.address));
    console.log(chalk.blue("CAKExUSDC POOL GENESIS TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(CAKExUSDCPool.address));
    console.log(chalk.blue("LINKxUSDC POOL GENESIS TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(LINKxUSDCPool.address));
    console.log(chalk.blue("MKRxUSDT POOL GENESIS TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(MKRxUSDTPool.address));
    console.log(chalk.blue("SUSHIxUSDT POOL GENESIS TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(SUSHIxUSDTPool.address));


    console.log(chalk.blue("GENESIS VOLATILE RATIOS OF THE PAIRES"))
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxFRAX POOL GENESIS VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(CRVxFRAXPool.address));
    console.log(chalk.blue("UNIxFRAX POOL GENESIS VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxDAI POOL GENESIS VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(COMPxDAIPool.address));
    console.log(chalk.blue("ETHxDAI POOL GENESIS VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(ETHxDAIPool.address));
    console.log(chalk.blue("CAKExUSDC POOL GENESIS VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(CAKExUSDCPool.address));
    console.log(chalk.blue("LINKxUSDC POOL GENESIS VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(LINKxUSDCPool.address));
    console.log(chalk.blue("MKRxUSDT POOL GENESIS VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(MKRxUSDTPool.address));
    console.log(chalk.blue("SUSHIxUSDT POOL GENESIS VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(SUSHIxUSDTPool.address));

    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("GENESIS STABLE RATIOS OF THE PAIRES"))
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRVxFRAX POOL GENESIS STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(CRVxFRAXPool.address));
    console.log(chalk.blue("UNIxFRAX POOL GENESIS STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(UNIxFRAXPool.address));
    console.log(chalk.blue("COMPxDAI POOL GENESIS STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(COMPxDAIPool.address));
    console.log(chalk.blue("ETHxDAI POOL GENESIS STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(ETHxDAIPool.address));
    console.log(chalk.blue("CAKExUSDC POOL GENESIS STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(CAKExUSDCPool.address));
    console.log(chalk.blue("LINKxUSDC POOL GENESIS STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(LINKxUSDCPool.address));
    console.log(chalk.blue("MKRxUSDT POOL GENESIS STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(MKRxUSDTPool.address));
    console.log(chalk.blue("SUSHIxUSDT POOL GENESIS STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(SUSHIxUSDTPool.address));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("PRICE CHANGE SIMULATION"))

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("CRV PRICE DROPS BY 10%"))

    await CRVxFRAXPool.mockRatioController("60000000000000000");
    console.log(chalk.blue("CRVxFRAX POOL UPDATED TOTAL RATIO: "), await PoolFactory.callStatic.getPairTotalRatio(CRVxFRAXPool.address));
    console.log(chalk.blue("CRVxFRAX POOL UPDATED VOLATILE RATIO: "), await PoolFactory.callStatic.getPairVolatileRatio(CRVxFRAXPool.address));
    console.log(chalk.blue("CRVxFRAX POOL UPDATED STABLE RATIO: "), await PoolFactory.callStatic.getPairStableRatio(CRVxFRAXPool.address));


  })
});
