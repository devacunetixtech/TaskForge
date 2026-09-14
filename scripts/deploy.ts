import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const factory = await ethers.getContractFactory("BotBounty");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  console.log(`BotBounty deployed to ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
