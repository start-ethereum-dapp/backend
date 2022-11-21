// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat"; // Global ethers object (declared here to be explicit)

describe("Tipping contract", function () {
  async function deployContractFixture() {
    // an object that represents an Ethereum account.
    const [owner, addr1, addr2] = await ethers.getSigners();
    // a factory for instances of our token contract.
    const Contract = await ethers.getContractFactory("StarkToken");
    // Calling deploy() on a ContractFactory will start the deployment,
    // and return a Promise that resolves to a Contract.
    const deployedContract = await Contract.connect(owner).deploy(10000);
    // This is the object that has a method for each of your smart contract functions.
    await deployedContract.deployed();

    return { deployedContract, owner, addr1, addr2 };
  }

  it("Should deploy the contract", async function () {
    const { deployedContract, owner } = await loadFixture(
      deployContractFixture
    );

    expect(deployedContract.address).to.be.properAddress;
    expect(await deployedContract.name()).to.equal("StarkToken");
    expect(await deployedContract.symbol()).to.equal("STARK");
    expect(await deployedContract.owner()).to.equal(owner.address);
    expect(await deployedContract.balanceOf(owner.address)).to.equal(10000);
  });

  it("Should mint 10 tokens.", async function () {
    const { deployedContract, addr1 } = await loadFixture(
      deployContractFixture
    );

    const AMOUNT = 10;

    const balanceBefore = (
      await deployedContract.balanceOf(addr1.address)
    ).toNumber();

    await deployedContract.mint(addr1.address, AMOUNT);

    const balanceAfter = (
      await deployedContract.balanceOf(addr1.address)
    ).toNumber();

    expect(balanceBefore + AMOUNT).to.equal(balanceAfter);
  });

  // it("Should transfer tokens between account", async function () {
  //   const { deployedContract, owner } = await loadFixture(
  //     deployContractFixture
  //   );
  // });
});
