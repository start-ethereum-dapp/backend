import hre, { ethers } from "hardhat";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import path from "path";
import fs from "fs";
import colors from "colors/safe";

import { saveFrontendFiles, saveTypesToFrontend } from "./saveFrontendFiles";

const network = hre.network.name;

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

  console.log(`\nDeploying contract(s) with the account: ${deployerAddress}`);

  console.log(`\nAccount balance: ${(await deployer.getBalance()).toString()}`);

  const contracts = getContractsNames();

  let contractInstance;
  for (const contract of contracts) {
    const Contract = await ethers.getContractFactory(contract);
    contractInstance = await Contract.deploy(1000);
    contractInstance.deployed();
    console.log(
      `\n${contract} deployed to: ${colors.green(
        contractInstance.address
      )} on ${network}`
    );
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
  switch (network) {
    case "localhost":
      const ETHAmount = 10n ** 18n;
      await setBalance(userAddress, ETHAmount);

      console.log(`\n${ETHAmount} Gwei assigned to ${userAddress}`);
      break;
    case "goerli":
      if (contractInstance?.address) {
        console.log(
          `\nSee the contract on ${colors.green(
            `https://goerli.etherscan.io/address/${contractInstance.address}`
          )}`
        );
      }
      break;

    default:
      break;
  }
}

main()
  .then(() => {
    console.log("\nDeployed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
