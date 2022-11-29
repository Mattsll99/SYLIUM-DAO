const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const chalk = require("chalk");

describe("Oracle test", function () {
  let governance;
  let oracle;

  before(async () => {
    governance = await ethers.getSigner();

    const getOracle = await ethers.getContractFactory("Oracle");

    oracle = await getOracle.deploy(governance.address);
    await oracle.deployed();
    console.log(chalk.blue("Oracle is deployed"));
  });

  it("Oracle testing", async function () {
    console.log(chalk.blue("THE GOVERNANCE ADDS THE ETH, CRV, AAVE & UNI PRICE DATA FEEDS"));
    await oracle.connect(governance).addPriceFeed("ETH", "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");
    await oracle.connect(governance).addPriceFeed("CRV", "0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f");
    await oracle.connect(governance).addPriceFeed("AAVE", "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9"); 
    await oracle.connect(governance).addPriceFeed("UNI", "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5");

    console.log(chalk.blue("GETTING THE PRICES WITH THE RIGHT DECIMALS"));

    console.log(chalk.blue("ETH PRICE; "), await oracle.getRightPrice("ETH"));
    console.log(chalk.blue("CRV PRICE; "), await oracle.getRightPrice("CRV"));
    console.log(chalk.blue("AAVE PRICE; "), await oracle.getRightPrice("AAVE"));
    console.log(chalk.blue("UNI PRICE; "), await oracle.getRightPrice("UNI"));
  });
});
