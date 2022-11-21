import { ethers } from "hardhat";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import path from "path";
import fs from "fs";

import { saveFrontendFiles, saveTypesToFrontend } from "./saveFrontendFiles";

export function getContractsNames() {
  const contracts = fs.readdirSync(path.join(__dirname, "..", "contracts"));
  const names = contracts.map((contract) => contract.split(".")[0]);
  return names;
}

const userAddress = process.env.PUBLIC_KEY || "";

async function main() {
  const typechainFilesDir = path.join(__dirname, "..", "typechain");
  if (typechainFilesDir)
    fs.rmSync(typechainFilesDir, { recursive: true, force: true });

  const [deployer] = await ethers.getSigners();
  const deployerAddress = deployer.address;

  console.log(`\nDeploying contract(s) with the account: ${deployerAddress}\n`);

  console.log(
    `\nAccount balance: ${(await deployer.getBalance()).toString()}\n`
  );

  const contracts = getContractsNames();

  for (const contract of contracts) {
    const Contract = await ethers.getContractFactory(contract);
    const contractInstance = await Contract.deploy(10000);
    await contractInstance.deployed();
    console.log(`${contract} deployed to: ${contractInstance.address}`);
    /*
    Move contract abi and deployed contract address to the frontend directory 
    */
    saveFrontendFiles(contract, contractInstance);
  }

  /*
  Move the hardhat generated types to the frontend directory
  */
  saveTypesToFrontend();

  /*
  This add 1 ETH to your .env set up public wallet address 
  */
  const ETHAmount = 10n ** 18n;
  await setBalance(userAddress, ETHAmount);

  console.log(`\n${ETHAmount} Gwei assigned to ${userAddress}\n`);
}

main()
  .then(() => {
    console.log("Deployed successfully\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
