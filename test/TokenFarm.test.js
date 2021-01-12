const { assert } = require("chai");

const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai").use(require("chai-as-promised")).should();

function valueToWei(value) {
  // web3 is defined when running truffle test
  return web3.utils.toWei(value, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;
  // Mocha beforeAll (which is installed by truffle)
  // IDK why it's not defined
  before(async () => {
    // Load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all Dapp tokens to farm
    await dappToken.transfer(tokenFarm.address, valueToWei("1000000"));

    // Transfer tokens to investor
    await daiToken.transfer(investor, valueToWei("100"), { from: owner });
  });

  describe("Mock DAI deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "DApp Token Farm");
    });

    it("evaluates if the contract has 100 tokens", async () => {
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), valueToWei("1000000"));
    });
  });

  describe("Farming tokens", async () => {
    it("rewards investors for staking mDai tokens", async () => {
      // Check investor balance before staking
      let balance;
      // 100
      const testValue = valueToWei("100");

      balance = await daiToken.balanceOf(investor);
      assert.equal(
        balance.toString(),
        testValue,
        "Investor Mock DAI wallet balance correct before staking!"
      );

      // First we need to approve the tokens to be sent
      await daiToken.approve(tokenFarm.address, testValue, {
        from: investor,
      });
      // Stake Mock DAI tokens
      await tokenFarm.stakeTokens(testValue, { from: investor });

      // Check staking result
      balance = await daiToken.balanceOf(investor);
      // asserting if the investor spent its 100 tokens
      assert.equal(
        balance.toString(),
        valueToWei("0"),
        "investor MocK DAI wallet balance correct after staking!"
      );

      balance = await daiToken.balanceOf(tokenFarm.address);
      // asserting if the 100 tokens went to the token farm address
      assert.equal(
        balance.toString(),
        testValue,
        "Token Farm MocK DAI wallet balance correct after staking!"
      );

      balance = await tokenFarm.stakingBalance(investor);
      assert.equal(
        balance.toString(),
        testValue,
        "investor staking balance correct after staking!"
      );

      let isStaking = await tokenFarm.isStaking(investor);
      assert.isTrue(
        isStaking,
        "investor staking status is correct after staking!"
      );

      // Issue tokens
      await tokenFarm.issueTokens({ from: owner });

      // Check balances after issuance
      balance = await dappToken.balanceOf(investor);
      assert.equal(
        balance.toString(),
        testValue,
        "investor DApp Token wallet balance correct after issuance"
      );

      // Ensure that only the investor can issue tokens its tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor });

      // Check balance after unstaking
      balance = await daiToken.balanceOf(investor);
      assert.equal(
        balance.toString(),
        testValue,
        "investor Mock DAI wallet balance correct after staking"
      );

      // Check balance of tokenfarm after unstaking
      balance = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        balance.toString(),
        valueToWei("0"),
        "Token Farm Mock DAI balance correct after unstaking"
      );

      // Check if investor no longer has tokens on tokenfarm
      balance = await tokenFarm.stakingBalance(investor);
      assert.equal(
        balance.toString(),
        valueToWei("0"),
        "Investor staking balance correct after unstaking"
      );

      // Check if isStaking flag is false for investor after unstaking
      isStaking = await tokenFarm.isStaking(investor);
      assert.isFalse(
        isStaking,
        "investor staking status correct after unstaking"
      );
    });
  });
});
