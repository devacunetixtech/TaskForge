import { expect } from "chai";
import hardhat from "hardhat";

const { ethers } = hardhat;

describe("BotBounty", function () {
  it("escrows and pays a creator-approved submission", async function () {
    const [creator, solver] = await ethers.getSigners();
    const bounty = await ethers.deployContract("BotBounty");
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    await bounty.createBounty("Ship it", "Build the thing", deadline, { value: ethers.parseEther("2") });
    await bounty.connect(solver).submitSolution(0, "Done", "https://example.com/work");
    await expect(bounty.approveSubmission(0, 0)).to.emit(bounty, "BountyAwarded").withArgs(0, 0, solver.address, ethers.parseEther("2"));
    expect((await bounty.bounties(0)).status).to.equal(1);
    expect(await ethers.provider.getBalance(creator.address)).to.be.greaterThan(0);
  });

  it("allows the creator to refund an expired open bounty", async function () {
    const [creator] = await ethers.getSigners();
    const bounty = await ethers.deployContract("BotBounty");
    const block = await ethers.provider.getBlock("latest");
    const deadline = Number(block?.timestamp ?? 0) + 60;
    await bounty.createBounty("Expired", "No longer needed", deadline, { value: ethers.parseEther("1") });
    await ethers.provider.send("evm_increaseTime", [61]);
    await ethers.provider.send("evm_mine", []);
    await expect(bounty.cancelExpiredBounty(0)).to.emit(bounty, "BountyCancelled").withArgs(0, ethers.parseEther("1"));
    expect((await bounty.bounties(0)).status).to.equal(2);
    expect(creator.address).to.not.equal(ethers.ZeroAddress);
  });
});
