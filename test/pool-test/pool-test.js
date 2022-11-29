const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const chalk = require("chalk");

describe(chalk.blue("POOL TEST"), function () {
  let governance;
  let player1;
  let player2;
  let player3; 
  let Oracle; 
  let aquafina; 
  let poolFactory;
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
    [governance, player1, player2, player3] = await ethers.getSigners();

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
    await Oracle.connect(governance).addPriceFeed("UNI", "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5");
    await Oracle.connect(governance).addPriceFeed("USDT", "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D");

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    const getAquafina = await ethers.getContractFactory("Aquafina");
    aquafina = await getAquafina.deploy(governance.address, Oracle.address);
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

    const getPoolFactory = await ethers.getContractFactory("poolFactory");
    poolFactory = await getPoolFactory.deploy(governance.address, Oracle.address);
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
  it(chalk.blue("TESTING DATA RETRIEVEMENT FOR THE POOLS"), async function() {
    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("DEPLOYING THE CRVxUSDC POOL"));
    
    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    const getCRVxUSDCPool = await ethers.getContractFactory("SYLIUMPools");
    const CRVxUSDCPool = await getCRVxUSDCPool.deploy(governance.address, "CRV", syCRV.address, "USDC", syUSDC.address, Oracle.address, aquafina.address, poolFactory.address, SYLI.address, SYLIX.address); 
    await CRVxUSDCPool.deployed(); 

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("CRVxUSDC POOL DEPLOYED"));

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("MINTING 700_000 syUSDC AND 500_000 syCRV TO THE POOL"))
    const syUSDCBalance = BigNumber.from("700000000000000000000000");
    const syCRVBalance = BigNumber.from("300000000000000000000000");
    await syUSDC.mint_syUSDC(CRVxUSDCPool.address, syUSDCBalance); 
    await syCRV.mint_syCRV(CRVxUSDCPool.address, syCRVBalance);

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("CRVxUDSC POOL RESERVES: "), await CRVxUSDCPool.getReserve());
    console.log(chalk.blue("CRVxUSDC POOL RESERVE VALUE: "), await CRVxUSDCPool.callStatic.getReserveValue());
    console.log(chalk.blue("CRVxUSDC POOL INTER-RATIOS: "), await CRVxUSDCPool.callStatic.getInterRatio());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("SAFETY RATIO: "), await CRVxUSDCPool.callStatic.getSafetyRatio());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("REGULATOR: "), await CRVxUSDCPool.callStatic.getRegulator());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("EQUALIZER: "), await CRVxUSDCPool.callStatic.getEqualizer());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"));

    console.log(chalk.blue("ALGORITHMIC DESIGN: "), await CRVxUSDCPool.callStatic.getAlgorithmicDesign());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("SYLI IN COLLATERAL: "), await CRVxUSDCPool.callStatic.getSyliInCollateral());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("MINTING 10_000 SYUSDC,  10_000 SYCRV AND 1_000 SYLIX TO EACH PLAYER"))
    const syCRVToPlayer = BigNumber.from("10000000000000000000000"); 
    const syUSDCToPlayer = BigNumber.from("10000000000000000000000"); 
    const SYLIXToPlayer = BigNumber.from("1000000000000000000000");

    await syCRV.mint_syCRV(player1.address, syCRVToPlayer);
    await syCRV.mint_syCRV(player2.address, syCRVToPlayer);
    await syCRV.mint_syCRV(player3.address, syCRVToPlayer);

    await syUSDC.mint_syUSDC(player1.address, syUSDCToPlayer); 
    await syUSDC.mint_syUSDC(player2.address, syUSDCToPlayer); 
    await syUSDC.mint_syUSDC(player3.address, syUSDCToPlayer); 

    await SYLIX.mintSylix(player1.address, SYLIXToPlayer);
    await SYLIX.mintSylix(player2.address, SYLIXToPlayer);
    await SYLIX.mintSylix(player3.address, SYLIXToPlayer);

    await syCRV.connect(player1).approve(CRVxUSDCPool.address, await syCRV.balanceOf(player1.address));
    await syCRV.connect(player2).approve(CRVxUSDCPool.address, await syCRV.balanceOf(player2.address));
    await syCRV.connect(player3).approve(CRVxUSDCPool.address, await syCRV.balanceOf(player3.address));

    await syUSDC.connect(player1).approve(CRVxUSDCPool.address, await syUSDC.balanceOf(player1.address));
    await syUSDC.connect(player2).approve(CRVxUSDCPool.address, await syUSDC.balanceOf(player2.address));
    await syUSDC.connect(player3).approve(CRVxUSDCPool.address, await syUSDC.balanceOf(player3.address));

    await SYLIX.connect(player1).approve(CRVxUSDCPool.address, await SYLIX.balanceOf(player1.address));
    await SYLIX.connect(player2).approve(CRVxUSDCPool.address, await SYLIX.balanceOf(player2.address));
    await SYLIX.connect(player3).approve(CRVxUSDCPool.address, await SYLIX.balanceOf(player3.address));

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("THE GOVERNANCE SETS A 2% MINTING FEE"));
    await CRVxUSDCPool.connect(governance).setMintingFees(BigNumber.from("20000000000000000"));

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("THE GOVERNANCE SETS THE SYLI AND SYLIX VERIFICATIONS FOR THE POOL"));
    await SYLIX.connect(governance).setVerification(CRVxUSDCPool.address);
    await SYLI.connect(governance).setPoolAllowance(CRVxUSDCPool.address);

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("EACH PLAYER MINTS 1_000 SYLI"));
    const SYLIBalance = BigNumber.from("1000000000000000000000");

    await CRVxUSDCPool.connect(player1).mintSYLI(SYLIBalance);
    await CRVxUSDCPool.connect(player2).mintSYLI(SYLIBalance);
    await CRVxUSDCPool.connect(player3).mintSYLI(SYLIBalance);

    console.log(chalk.blue("UPDATED SYLI'S SUPPLY: "), await CRVxUSDCPool.getSyliSupply());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("UPDATED SAFETY RATIO: "), await CRVxUSDCPool.callStatic.getSafetyRatio());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))

    console.log(chalk.blue("UPDATED EQUALIZER: "), await CRVxUSDCPool.callStatic.getEqualizer());
    console.log(chalk.blue("UPDATED ALGORITHMIC DESIGN: "), await CRVxUSDCPool.callStatic.getAlgorithmicDesign());
    console.log(chalk.blue("UPDATED SYLI IN COLLATERALS: "), await CRVxUSDCPool.callStatic.getSyliInCollateral());

    console.log(chalk.blue("//////////////////////////////////////////////"))
    console.log(chalk.blue("//////////////////////////////////////////////"))



  })
})