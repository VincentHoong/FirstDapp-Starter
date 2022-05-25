const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const MarketSentiment = await hre.ethers.getContractFactory("MarketSentiment");
  const marketSentiment = await MarketSentiment.deploy();

  await marketSentiment.deployed();

  console.log("MarketSentiment deployed to:", marketSentiment.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
