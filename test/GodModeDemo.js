const GM = require("godmode-for-test");
const HasOwnerShip = artifacts.require("HasOwnerShip");
const HasOwnerShipInstrumented = artifacts.require("HasOwnerShipInstrumented");
const HasOwnerShipSETOWNER = artifacts.require("HasOwnerShipSETOWNER");

// SETUP GMIT
let GODMODE = new GM("development", "ws://localhost:8545");


contract("HasOwnerShip GodMode Demo", function(accounts) {
  const Alice = accounts[1];
  const Bob = accounts[2];
  let hasOwnerShipContract;

  beforeEach(async function() {
    hasOwnerShipContract = await HasOwnerShip.new({ from: Alice });
  });

  
  describe("MAINNET FORK ONLY", function(){

    before(async function() {
        await GODMODE.open();      
    });

    after(async function(){
        await GODMODE.close();
    });

    // MAINNET fork only!
    it("GODMODE: mint Dai ", async function(){
      await GODMODE.mintDai(Bob, 10000);
    });    

    it("GODMODE: UnswapV2 Factory enable Fee", async function(){
      await GODMODE.uniswapV2Factory_setFeeTo(Bob);
    });    


    it("GODMODE: UnswapV2 Pair setKLast", async function(){
      //Paxos USDC pair (https://etherscan.io/address/0x3139Ffc91B99aa94DA8A2dc13f1fC36F9BDc98eE#readContract) 
      await GODMODE.uniswapV2Pair_setKLast("0x3139Ffc91B99aa94DA8A2dc13f1fC36F9BDc98eE",100);
    });    


    it("GODMODE: Compound Give an address CToken", async function(){
        // cBAT
        await GODMODE.CToken_giveAddrTokens("0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e", Bob, 100);
    })
  });



  describe("Sample Contract System", function(){
    it("The owner of HasOwnerShip is the Alice", async function() {
      // Alice is the owner!
      assert.equal(await hasOwnerShipContract.owner(), Alice);
    });

    it("Only Alice can set the flag! (It's priviledged!)", async function(){
      // The Flag is False
      assert.equal(await hasOwnerShipContract.flag(), false);

      // Bob tries to set the flag, FAIL!
      await assertTxFail(() => hasOwnerShipContract.priviledgedAction(true ,{from: Bob}), "revert");
      assert.equal(await hasOwnerShipContract.flag(), false);

      // Alice sets the flag, SUCCEED!
      await hasOwnerShipContract.priviledgedAction(true ,{from: Alice});
      assert.equal(await hasOwnerShipContract.flag(), true);
    });

    it("GODMODE: Bob can set flag under our will!", async function() {
      // START GOD MODE
      await GODMODE.open();

      // Bob now sets the flag with GODMODE!
      await GODMODE.executeAs(hasOwnerShipContract, HasOwnerShipInstrumented, "priviledgedAction", true, {from: Bob});
      assert.equal(await hasOwnerShipContract.flag(), true);

      await GODMODE.close();

    });

    it("GODMODE: Bob can become the owner!", async function(){
      await GODMODE.open();
      // Alice is the current owner of the contract.
      assert.equal(await hasOwnerShipContract.owner(), Alice);

      // GODMODE: Let Bob becomes the owner!
      await GODMODE.executeAs(hasOwnerShipContract, HasOwnerShipSETOWNER, "setOwner", {from: Bob});

      // Ensure that Bob is indeed the owner
      assert.equal(await hasOwnerShipContract.owner(), Bob);

      // END GOD MODE
      await GODMODE.close();      
    });

  });

});


async function assertTxFail(promise, msg) {
  try {
    // console.log(promise.toString()); // uncomment for debugging
    await promise();
  } catch (err) {
    const txFailed = (err.message.startsWith("VM Exception while processing transaction: revert") ||
      err.message.startsWith("Returned error: VM Exception while processing transaction: revert")) ||
      err.message.startsWith("VM Exception while processing transaction: invalid opcode");

    if (!txFailed) {
      assert.fail("Unexpected error when checking for transaction failure", err.message);
    }
    
    if (process.env.COVERAGE === 'true') {
      return; // skip on checking the error message
    }

    assert(msg, `Expected exception message is not defined. The actual exception was: "${err.message}". Stack: ${err.stack}`);
    assert(err.message.endsWith(msg), `Expected exception message "${msg}" was different from the actual exception message: "${err.message}". Stack: ${err.stack}`);
    return;
  }
  
  assert.fail("The transaction was expected to fail, but it did not");
}
