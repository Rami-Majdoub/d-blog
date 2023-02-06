import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DBlog", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory("DBlog");
    const contract = await ContractFactory.deploy();

    return { contract, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should create post", async function () {
      const { contract, unlockTime } = await loadFixture(deployFixture);

      await expect(
        contract.createPost("bafkreifh3ycc22lqqhuvj26fukg6r3dbyyqbddownxaskai7xuayo3melu")
      ).to.emit(contract, "PostCreated");
    });
    
  });

});
