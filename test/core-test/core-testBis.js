const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const chalk = require("chalk");

describe(chalk.magenta("CORE TEST"), function () {
  let governance;
  let user1;
  let user2;
  let user3; 
  let oracle; 
  let aquafina; 
  let poolFactory;
  let syliumPool; 
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
    [governance, user1, user2, user3] = await ethers.getSigners(); 

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
    oracle = await getOracle.deploy(governance.address); 
    await oracle.deployed();
    console.log(chalk.blue("ORACLE DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE ADDS ALL THE PRICE FEEDS"))
    await oracle.connect(governance).addPriceFeed("ETH", "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");
    await oracle.connect(governance).addPriceFeed("AAVE", "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9");
    await oracle.connect(governance).addPriceFeed("CAKE", "0xEb0adf5C06861d6c07174288ce4D0a8128164003");
    await oracle.connect(governance).addPriceFeed("COMP", "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5");
    await oracle.connect(governance).addPriceFeed("CRV", "0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f");
    await oracle.connect(governance).addPriceFeed("DAI", "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9");
    await oracle.connect(governance).addPriceFeed("FRAX", "0xB9E1E3A9feFf48998E45Fa90847ed4D467E8BcfD");
    await oracle.connect(governance).addPriceFeed("LINK", "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c");
    await oracle.connect(governance).addPriceFeed("MKR", "0xec1D1B3b0443256cc3860e24a46F108e699484Aa");
    await oracle.connect(governance).addPriceFeed("SUSHI", "0xCc70F09A6CC17553b2E31954cD36E4A2d89501f7");
    await oracle.connect(governance).addPriceFeed("USDC", "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6");
    await oracle.connect(governance).addPriceFeed("UNI", "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5");
    await oracle.connect(governance).addPriceFeed("USDT", "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D");

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getAquafina = await ethers.getContractFactory("Aquafina");
    aquafina = await getAquafina.deploy(governance.address, oracle.address);
    await aquafina.deployed();
    console.log(chalk.blue("AQUAFINA DEPLOYED"));

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

    /*const getSyliumPools = await ethers.getContractFactory("SYLIUMPools");
    syliumPool = await getSyliumPools.deploy();*/

    const getPoolFactory = await ethers.getContractFactory("poolFactory");
    poolFactory = await getPoolFactory.deploy(governance.address, oracle.address, aquafina.address, SYLI.address, SYLIX.address, stSYLIX.address);
    console.log(chalk.blue("POOL FACTORY DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE SETS THE TOKEN STARTERS FOR ALL VOLATILE TOKENS")); 
    await aquafina.connect(governance).setTokenStarter("AAVE");
    await aquafina.connect(governance).setTokenStarter("CAKE");
    await aquafina.connect(governance).setTokenStarter("COMP");
    await aquafina.connect(governance).setTokenStarter("CRV");
    await aquafina.connect(governance).setTokenStarter("ETH");
    await aquafina.connect(governance).setTokenStarter("LINK");
    await aquafina.connect(governance).setTokenStarter("MKR");
    await aquafina.connect(governance).setTokenStarter("SUSHI");
    await aquafina.connect(governance).setTokenStarter("UNI");

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
  })

  it("TESTING THE POOL FACTORY", async function() {
    console.log(chalk.blue("DEPLOYING THE SYLIUMPOOL FOR THE CRV/DAI PAIR"));
    const getCRVDAIPool = await ethers.getContractFactory("SYLIUMPools");
    const CRVDAIPool = await getCRVDAIPool.deploy(governance.address, "CRV", syCRV.address, "DAI", syDAI.address, oracle.address, aquafina.address, SYLI.address, SYLIX.address, stSYLIX.address);
    await CRVDAIPool.deployed();
    console.log(chalk.blue("CRVxDAI POOL DEPLOYED"))

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("MINTING 1_000_000 SYCRV & 1_000_000 SYDAI TO THE CRVxDAI POOL"));
    const crvBalance = BigNumber.from("1000000000000000000000000");
    const daiBalance = BigNumber.from("1000000000000000000000000");
    await syCRV.mint_syCRV(CRVDAIPool.address, crvBalance);
    await syDAI.mint_syDAI(CRVDAIPool.address, daiBalance);

    console.log(chalk.blue("POOL VOLATILE & STABLE RESERVES: "), await CRVDAIPool.getReserve());
    console.log(chalk.blue("POOL RESERVES VALUE; "), await CRVDAIPool.callStatic.getReserveValue());
    console.log(chalk.blue("POOL INTER-RATIOS: "), await CRVDAIPool.callStatic.getInterRatio());
    console.log(chalk.blue("VOLATILE VARIATION & REGULATOR"), await CRVDAIPool.callStatic.getRegulator());
    console.log(chalk.blue("THE GOVERNANCE SET AN ALPHA OF 20%"));
    await CRVDAIPool.connect(governance).setAlpha(20);
    console.log(chalk.blue("POOL EQUALIZER: "), await CRVDAIPool.callStatic.getEqualizer());
    console.log(chalk.blue("POOL ALGORITHMIC DESIGN: "), await CRVDAIPool.callStatic.getAlgorithmicDesign());
    console.log(chalk.blue("AMOUNT OF VOLATILE, STABLE, AND SYLIX"), await CRVDAIPool.callStatic.getSyliInCollateral());
  })

  it("TESTING POOL FACTORY COMBINATIONS", async function() {
    const getETHUSDCPool = await ethers.getContractFactory("SYLIUMPools");
    const getCOMPFRAXPool = await ethers.getContractFactory("SYLIUMPools");
    const getUNIUSDTPool = await ethers.getContractFactory("SYLIUMPools");
    const getSUSHIDAIPool = await ethers.getContractFactory("SYLIUMPools");

    const ETHUSDCPool = await getETHUSDCPool.deploy(governance.address, "ETH", syETH.address, "USDC", syUSDC.address, oracle.address, aquafina.address, SYLI.address, SYLIX.address, stSYLIX.address);
    const COMPFRAXPool = await getCOMPFRAXPool.deploy(governance.address, "COMP", syCOMP.address, "FRAX", syFRAX.address, oracle.address, aquafina.address, SYLI.address, SYLIX.address, stSYLIX.address);
    const UNIUSDTPool = await getUNIUSDTPool.deploy(governance.address, "UNI", syUNI.address, "USDT", syUSDT.address, oracle.address, aquafina.address, SYLI.address, SYLIX.address, stSYLIX.address);
    const SUSHIDAIPool = await getSUSHIDAIPool.deploy(governance.address, "SUSHI", sySUSHI.address, "DAI", syDAI.address, oracle.address, aquafina.address, SYLI.address, SYLIX.address, stSYLIX.address);

    await ETHUSDCPool.deployed();
    console.log(chalk.blue("ETHxUSDC POOL DEPLOYED"));
    console.log(chalk.blue("============================================="));
    await COMPFRAXPool.deployed();
    console.log(chalk.blue("COMPxFRAX POOL DEPLOYED"));
    console.log(chalk.blue("============================================="));
    await UNIUSDTPool.deployed();
    console.log(chalk.blue("UNIxUSDT POOL DEPLOYED"));
    console.log(chalk.blue("============================================="));
    await SUSHIDAIPool.deployed();
    console.log(chalk.blue("SUSHIxDAI POOL DEPLOYED"));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("MINTING VOLATILE & STABLE TO EACH POOL"));
    const ethBalance = BigNumber.from()



  })
});
