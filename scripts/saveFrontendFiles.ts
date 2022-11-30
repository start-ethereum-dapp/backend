import { artifacts } from "hardhat";
import path from "path";
import fs from "fs";
import fse from "fs-extra";

const frontendContractDir = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "contracts"
);

const typechainDir = path.join(__dirname, "..", "typechain-types", "contracts");

export function saveFrontendFiles(contract: string, contractInstance: any) {
  fs.rmSync(frontendContractDir, { recursive: true, force: true });

  if (!fs.existsSync(frontendContractDir)) {
    fs.mkdirSync(frontendContractDir);
  }

  const contractArtifact = artifacts.readArtifactSync(contract);

  fs.writeFileSync(
    path.join(frontendContractDir, `${contract}-address.json`),
    JSON.stringify({ contractAddress: contractInstance.address }, undefined, 2)
  );

  fs.writeFileSync(
    path.join(frontendContractDir, `${contract}.json`),
    JSON.stringify(contractArtifact, null, 2)
  );
}

export const saveTypesToFrontend = () => {
  if (!fs.existsSync(typechainDir)) {
    throw new Error(
      "typechain-types directory not found. You need to generate the types first. In the command line write: npm run deploy-local."
    );
  }

  const contractTypesDir = path.join(frontendContractDir, "types");
  fs.mkdirSync(contractTypesDir);

  try {
    fse.copySync(typechainDir, contractTypesDir, {
      overwrite: true,
    });
    console.log("\nContract types generated on: /frontend/contracts/types/");
  } catch (error) {
    console.log(
      "Cannot generated types for the contract. You can found them on /backend/typechain-types/"
    );
  }
};
