/**
 * ExternalContracts.test.js
 *
 * GodMode demo of external contracts currently deployed on mainnet.
 *
 */

const GM = require("@xgm/godmode");
const UniswapV2FactoryContract = artifacts.require("UniswapV2FactoryContract");
const CErc20Contract = artifacts.require("CErc20Contract");
const Dai = artifacts.require("Dai");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";  

const GODMODE = new GM("development", "<rpc_endpoint>");

function dimlog(msg) {
  console.log("\x1b[2m%s\x1b[0m", msg);
}

contract("External Contracts", function(accounts) {
  const Alex = accounts[1];
  const Beth = accounts[2];
  const Carl = accounts[3];

  describe("\nMainnet DAI", function(){
    before(async function() { await GODMODE.open(); });
    after(async function() { await GODMODE.close(); });

    it("GODEMODE: can mint DAI to any account as much as I want", async function(){
      let mainnetDaiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
      let daiContract = await Dai.at(mainnetDaiAddress);

      // Balance starts at 0
      let startingBalance = await daiContract.balanceOf(Alex);
      assert.equal(startingBalance, 0);
      dimlog(`Alex's starting balance: ${startingBalance.toString()}`);

      // Mint x times
      let x = Math.floor(Math.random() * 10) + 1;
      for(var i = 0 ; i < x; i++){
        await GODMODE.mintDai(Alex, 100);
      }

      // Balance ends at 100x!
      let endingBalance = await daiContract.balanceOf(Alex);
      assert.equal(endingBalance, 100 * x);
      dimlog(`Alex's ending balance: ${endingBalance.toString()}`);
    });
  });

  describe("\nMainnet Uniswap V2", function(){
    before(async function() { await GODMODE.open(); });
    after(async function() { await GODMODE.close(); });

    it("GODMODE: can set any account I want as the fee collector", async function(){
      let mainnetFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
      let factoryContract = await UniswapV2FactoryContract.at(mainnetFactoryAddress);

      // Initially, feeTo is not set, and no fee is collected
      let startingFeeCollector = await factoryContract.feeTo();
      assert.equal(startingFeeCollector, ZERO_ADDRESS);
      dimlog(`Starting fee collector is no one: ${startingFeeCollector}`);

      // Set feeTo
      await GODMODE.uniswapV2Factory_setFeeTo(Beth);

      // feeTo is set!
      let endingFeeCollector = await factoryContract.feeTo();
      assert.equal(endingFeeCollector, Beth);
      dimlog(`Ending fee collector is Beth: ${endingFeeCollector}`);
    });    
  });

  describe("\nMainnet Compound", function(){
    before(async function() { await GODMODE.open(); });
    after(async function() { await GODMODE.close(); });

    it("GODMODE: can give CTokens to any account I want", async function(){
      let mainnetCBAT = "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e";
      let cBAT = await CErc20Contract.at(mainnetCBAT);

      // Balance starts at 0
      let startingBalance = await cBAT.balanceOf(Carl);
      assert.equal(startingBalance, 0);
      dimlog(`Carl's starting balance: ${startingBalance.toString()}`);

      // Give address tokens
      await GODMODE.CToken_giveAddrTokens(mainnetCBAT, Carl, 100); 

      // Balance ends at 100!
      let endingBalance = await cBAT.balanceOf(Carl);
      assert.equal(endingBalance, 100);       
      dimlog(`Carl's ending balance: ${endingBalance.toString()}`);
    })
  });
});

