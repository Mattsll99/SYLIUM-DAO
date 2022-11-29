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

  it(chalk.blue("OPENING FIVE POOL AND FILLING THEIR EMERGENCY POOLS WITH THE P.O.R."), async function() {
    console.log(chalk.blue("POOLS DEPLOYMENT")); 

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

    console.log(chalk.blue("DEPLOYING THE EMERGENCY POOLS"));
    const getEmergencyPools = await ethers.getContractFactory("emergencyPools")

    const CRVxDAIEmergencyPool = await getEmergencyPools.deploy(governance.address, Oracle.address);
    const UNIxFRAXEmergencyPool = await getEmergencyPools.deploy(governance.address, Oracle.address);
    const COMPxUSDCEmergencyPool = await getEmergencyPools.deploy(governance.address, Oracle.address);

    await CRVxDAIEmergencyPool.deployed(); 
    await UNIxFRAXEmergencyPool.deployed(); 
    await COMPxUSDCEmergencyPool.deployed();

    console.log(chalk.blue("CRVxDAI EMERGENCY POOL DEPLOYED"));
    console.log(chalk.blue("UNIxFRAX EMERGENCY POOL DEPLOYED"));
    console.log(chalk.blue("COMPxUSDC EMERGENCY POOL DEPLOYED"));

    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE LINKS UP EACH EMERGENCY POOL TO ITS AFFILIATED POOL"));

    //Modifier verification
    await expect(CRVxDAIEmergencyPool.connect(player1).linkSyliumPools(CRVxDAIPool.address, "DAI", syDAI.address)).to.be.reverted;
    await CRVxDAIEmergencyPool.connect(governance).linkSyliumPools(CRVxDAIPool.address, "DAI", syDAI.address);
    await UNIxFRAXEmergencyPool.connect(governance).linkSyliumPools(UNIxFRAXPool.address, "FRAX", syFRAX.address);
    await COMPxUSDCEmergencyPool.connect(governance).linkSyliumPools(COMPxUSDCPool.address, "USDC", syUSDC.address);

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("FILLING PLAYERS BALANCES")); 

    const crvBalance = BigNumber.from("365000000000000000000000"); 
    const daiBalance = BigNumber.from("700000000000000000000000"); 
    const uniBalance = BigNumber.from("50000000000000000000000"); 
    const fraxBalance = BigNumber.from("700000000000000000000000"); 
    const compBalance = BigNumber.from("5400000000000000000000"); 
    const usdcBalance = BigNumber.from("700000000000000000000000");

   await syCRV.mint_syCRV(player1.address, crvBalance);
   await syCRV.mint_syCRV(player2.address, crvBalance);
   await syCRV.mint_syCRV(player3.address, crvBalance);
   await syCRV.mint_syCRV(player4.address, crvBalance);
   await syCRV.mint_syCRV(player5.address, crvBalance);

   await syDAI.mint_syDAI(player1.address, daiBalance);
   await syDAI.mint_syDAI(player2.address, daiBalance);
   await syDAI.mint_syDAI(player3.address, daiBalance);
   await syDAI.mint_syDAI(player4.address, daiBalance);
   await syDAI.mint_syDAI(player5.address, daiBalance);

   await syUNI.mint_syUNI(player1.address, uniBalance);
   await syUNI.mint_syUNI(player2.address, uniBalance);
   await syUNI.mint_syUNI(player3.address, uniBalance);
   await syUNI.mint_syUNI(player4.address, uniBalance);
   await syUNI.mint_syUNI(player5.address, uniBalance);

   await syFRAX.mint_syFRAX(player1.address, fraxBalance);
   await syFRAX.mint_syFRAX(player2.address, fraxBalance);
   await syFRAX.mint_syFRAX(player3.address, fraxBalance);
   await syFRAX.mint_syFRAX(player4.address, fraxBalance);
   await syFRAX.mint_syFRAX(player5.address, fraxBalance);

   await syCOMP.mint_syCOMP(player1.address, compBalance);
   await syCOMP.mint_syCOMP(player2.address, compBalance);
   await syCOMP.mint_syCOMP(player3.address, compBalance);
   await syCOMP.mint_syCOMP(player4.address, compBalance);
   await syCOMP.mint_syCOMP(player5.address, compBalance);

   await syUSDC.mint_syUSDC(player1.address, usdcBalance);
   await syUSDC.mint_syUSDC(player2.address, usdcBalance);
   await syUSDC.mint_syUSDC(player3.address, usdcBalance);
   await syUSDC.mint_syUSDC(player4.address, usdcBalance);
   await syUSDC.mint_syUSDC(player5.address, usdcBalance);
   
   console.log(chalk.blue("GETTING THE ALLOWANCES FOR THE P.O.R. POOL"));

   await syCRV.connect(player1).approve(POR.address, await syCRV.balanceOf(player1.address));
   await syCRV.connect(player2).approve(POR.address, await syCRV.balanceOf(player2.address));
   await syCRV.connect(player3).approve(POR.address, await syCRV.balanceOf(player3.address));
   await syCRV.connect(player4).approve(POR.address, await syCRV.balanceOf(player4.address));
   await syCRV.connect(player5).approve(POR.address, await syCRV.balanceOf(player5.address));

   await syDAI.connect(player1).approve(POR.address, await syDAI.balanceOf(player1.address));
   await syDAI.connect(player2).approve(POR.address, await syDAI.balanceOf(player2.address));
   await syDAI.connect(player3).approve(POR.address, await syDAI.balanceOf(player3.address));
   await syDAI.connect(player4).approve(POR.address, await syDAI.balanceOf(player4.address));
   await syDAI.connect(player5).approve(POR.address, await syDAI.balanceOf(player5.address));

   await syUNI.connect(player1).approve(POR.address, await syUNI.balanceOf(player1.address));
   await syUNI.connect(player2).approve(POR.address, await syUNI.balanceOf(player2.address));
   await syUNI.connect(player3).approve(POR.address, await syUNI.balanceOf(player3.address));
   await syUNI.connect(player4).approve(POR.address, await syUNI.balanceOf(player4.address));
   await syUNI.connect(player5).approve(POR.address, await syUNI.balanceOf(player5.address));

   await syFRAX.connect(player1).approve(POR.address, await syFRAX.balanceOf(player1.address));
   await syFRAX.connect(player2).approve(POR.address, await syFRAX.balanceOf(player2.address));
   await syFRAX.connect(player3).approve(POR.address, await syFRAX.balanceOf(player3.address));
   await syFRAX.connect(player4).approve(POR.address, await syFRAX.balanceOf(player4.address));
   await syFRAX.connect(player5).approve(POR.address, await syFRAX.balanceOf(player5.address));

   await syCOMP.connect(player1).approve(POR.address, await syCOMP.balanceOf(player1.address));
   await syCOMP.connect(player2).approve(POR.address, await syCOMP.balanceOf(player2.address));
   await syCOMP.connect(player3).approve(POR.address, await syCOMP.balanceOf(player3.address));
   await syCOMP.connect(player4).approve(POR.address, await syCOMP.balanceOf(player4.address));
   await syCOMP.connect(player5).approve(POR.address, await syCOMP.balanceOf(player5.address));

   await syUSDC.connect(player1).approve(POR.address, await syUSDC.balanceOf(player1.address));
   await syUSDC.connect(player2).approve(POR.address, await syUSDC.balanceOf(player2.address));
   await syUSDC.connect(player3).approve(POR.address, await syUSDC.balanceOf(player3.address));
   await syUSDC.connect(player4).approve(POR.address, await syUSDC.balanceOf(player4.address));
   await syUSDC.connect(player5).approve(POR.address, await syUSDC.balanceOf(player5.address));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE ADDS THE TOKENS TO THE P.O.R.")); 
    //Modifier verification
    await expect(POR.connect(player1).addToken("CRV", syCRV.address)).to.be.reverted;
    await POR.connect(governance).addToken("CRV", syCRV.address); 
    await POR.connect(governance).addToken("DAI", syDAI.address);
    await POR.connect(governance).addToken("UNI", syUNI.address);
    await POR.connect(governance).addToken("FRAX", syFRAX.address);
    await POR.connect(governance).addToken("COMP", syCOMP.address);
    await POR.connect(governance).addToken("USDC", syUSDC.address);

    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE SETS A 3% FEE FOR ALL THE STABLE TOKENS"))
    const fees = BigNumber.from("30000000000000000") //3% fees
    
    await expect(POR.connect(player1).setPORFees(fees, "DAI", CRVxDAIEmergencyPool.address)).to.be.reverted;
    await POR.connect(governance).setPORFees(fees, "DAI", CRVxDAIEmergencyPool.address);
    await POR.connect(governance).setPORFees(fees, "FRAX", UNIxFRAXEmergencyPool.address);
    await POR.connect(governance).setPORFees(fees, "USDC", COMPxUSDCEmergencyPool.address);

    const stableAmount = BigNumber.from("1000000000000000000000000") //2% minimum rate

    console.log(chalk.blue("THE GOVERNANCE SETS THE STSYLIX VERIFICATION FOR THE POR POOL"));
    await stSYLIX.connect(governance).setVerification(POR.address);

    console.log(chalk.blue("I) THE GOVERNANCE OPENS THE P.O.R. FOR THE CRVxDAI EMERGENCY POOL: $1_000_000 OF DAI POOL, 1_000_000 stSTYLIX TO SHIP"));
    
    const stSylixAmount = BigNumber.from("1000000000000000000000000");
    await POR.connect(governance).openPOR(stableAmount, "DAI", CRVxDAIEmergencyPool.address, stSylixAmount);
    
    console.log(chalk.blue("EACH PLAYER PROVIDES 200_000 SYDAY TO THE P.O.R.")); 
    await POR.connect(player1).PORvide("DAI", CRVxDAIEmergencyPool.address, BigNumber.from("200000000000000000000000"));
    await POR.connect(player2).PORvide("DAI", CRVxDAIEmergencyPool.address, BigNumber.from("200000000000000000000000"));
    await POR.connect(player3).PORvide("DAI", CRVxDAIEmergencyPool.address, BigNumber.from("200000000000000000000000"));
    await POR.connect(player4).PORvide("DAI", CRVxDAIEmergencyPool.address, BigNumber.from("200000000000000000000000"));
    await POR.connect(player5).PORvide("DAI", CRVxDAIEmergencyPool.address, BigNumber.from("200000000000000000000000"));

    console.log(chalk.blue("CRVxDAI EMERGENCY POOL DAI BALANCE: "), await syDAI.balanceOf(CRVxDAIEmergencyPool.address));
    
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("GOVERNANCE DAI BALANCE: "), await syDAI.balanceOf(governance.address)); 
    console.log(chalk.blue("REWARDS CONTROLLER DAI BALANCE: "), await syDAI.balanceOf(RewardsController.address));

    console.log("PLAYER 1 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player1.address));
    console.log("PLAYER 2 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player2.address));
    console.log("PLAYER 3 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player3.address));
    console.log("PLAYER 4 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player4.address));
    console.log("PLAYER 5 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player5.address));
    
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));


    console.log(chalk.blue("II) THE GOVERNANCE OPENS THE P.O.R. FOR THE UNIxFRAX EMERGENCY POOL: $1_000_000 OF FRAX POOL, 1_000_000 stSTYLIX TO SHIP"))

    await POR.connect(governance).openPOR(stableAmount, "FRAX", UNIxFRAXEmergencyPool.address, stSylixAmount);
    
    console.log(chalk.blue("EACH PLAYER PROVIDES 200_000 SYDAY TO THE P.O.R.")); 
    await POR.connect(player1).PORvide("FRAX", UNIxFRAXEmergencyPool.address, BigNumber.from("200000000000000000000000"));
    await POR.connect(player2).PORvide("FRAX", UNIxFRAXEmergencyPool.address, BigNumber.from("200000000000000000000000"));
    await POR.connect(player3).PORvide("FRAX", UNIxFRAXEmergencyPool.address, BigNumber.from("200000000000000000000000"));
    await POR.connect(player4).PORvide("FRAX", UNIxFRAXEmergencyPool.address, BigNumber.from("200000000000000000000000"));
    await POR.connect(player5).PORvide("FRAX", UNIxFRAXEmergencyPool.address, BigNumber.from("200000000000000000000000"));

    console.log(chalk.blue("UNIxFRAX EMERGENCY POOL FRAX BALANCE: "), await syFRAX.balanceOf(UNIxFRAXEmergencyPool.address));
    
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("GOVERNANCE FRAX BALANCE: "), await syFRAX.balanceOf(governance.address)); 
    console.log(chalk.blue("REWARDS CONTROLLER FRAX BALANCE: "), await syFRAX.balanceOf(RewardsController.address));

    console.log("PLAYER 1 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player1.address));
    console.log("PLAYER 2 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player2.address));
    console.log("PLAYER 3 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player3.address));
    console.log("PLAYER 4 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player4.address));
    console.log("PLAYER 5 stSYLIX BALANCE: ", await stSYLIX.balanceOf(player5.address));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("MINTING AND TRANSACTION"))

    

  })
})









//Gather the data related to all tokens
//Open the pools
//Open the rewardsPools
//Genesis funds raising with the P.O.R.
//Regular Minting test (with fees gathering)
  //Getting fees in stablecoin
//Regular Redemption test (with fees gathering)
  //Getting fees in stablecoins
//Send fees to all the rewardsPools
//Test all rewards-related functions
//Test fees claiming