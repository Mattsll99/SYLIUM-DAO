const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const chalk = require("chalk");

describe("Aquafina test", function () {
  let governance;
  let oracle;
  let aquafina;

  before(async () => {
    governance = await ethers.getSigner();
    
    const getOracle = await ethers.getContractFactory("Oracle");

    oracle = await getOracle.deploy(governance.address);
    await oracle.deployed();
    console.log(chalk.blue("ORACLE DEPLOYED"));
  });

  it("Variation calculation testing", async function() {
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

    console.log(chalk.blue("AQUAFINA DEPLOYMENT"));
    const getAquafina = await ethers.getContractFactory("Aquafina");
    aquafina = await getAquafina.deploy(governance.address, oracle.address);
    await aquafina.deployed()
    console.log(chalk.blue("AQUAFINA DEPLOYED"));

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("THE GOVERNANCE SETS THE TOKEN STARTERS"));

    await aquafina.connect(governance).setTokenStarter("AAVE");
    await aquafina.connect(governance).setTokenStarter("CAKE");
    await aquafina.connect(governance).setTokenStarter("COMP");
    await aquafina.connect(governance).setTokenStarter("CRV");
    await aquafina.connect(governance).setTokenStarter("DAI");
    await aquafina.connect(governance).setTokenStarter("ETH");
    await aquafina.connect(governance).setTokenStarter("USDT");
    await aquafina.connect(governance).setTokenStarter("FRAX");
    await aquafina.connect(governance).setTokenStarter("LINK");
    await aquafina.connect(governance).setTokenStarter("SUSHI");
    await aquafina.connect(governance).setTokenStarter("MKR");
    await aquafina.connect(governance).setTokenStarter("USDC");
    await aquafina.connect(governance).setTokenStarter("UNI");

    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));
    console.log(chalk.blue("============================================="));

    console.log(chalk.blue("GETTING THE ETH PRICE VARIATION"))
    console.log(chalk.blue("ETH PRICE VARIATION"), await aquafina.callStatic.mockVariation("USDC"));

  })
});
