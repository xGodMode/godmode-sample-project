/**
 * CustomContracts.test.js
 *
 * GodMode demo of custom, user-defined contracts deployed on mainnet.
 */

const GM = require("@xgm/godmode");
const HasOwnerShip = artifacts.require("HasOwnerShip");
const HasOwnerShipInstrumented = artifacts.require("HasOwnerShipInstrumented");
const HasOwnerShipSETOWNER = artifacts.require("HasOwnerShipSETOWNER");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";  

let GODMODE = new GM("development", "<rpc_endpoint>");

contract("Custom Contracts", function(accounts) {

  const Alex = accounts[1];
  const Beth = accounts[2];
  const Carl = accounts[3];

  describe("\nHasOwnerShip", function(){
    let hasOwnerShipContract;
    beforeEach(async function() {
      hasOwnerShipContract = await HasOwnerShip.new({ from: Alex });
    });

    it("starts with Alex as the owner", async function() {
      assert.equal(await hasOwnerShipContract.owner(), Alex);
    });

    it("allows Alex to access the priviledgedAction (e.g. flip a boolean)", async function(){
      assert.equal(await hasOwnerShipContract.flag(), false);
      await hasOwnerShipContract.priviledgedAction(true ,{from: Alex});
      assert.equal(await hasOwnerShipContract.flag(), true);
    });

    it("does not allow Beth to access the priviledgedAction", async function(){
      assert.equal(await hasOwnerShipContract.flag(), false);
      await assertTxFail(() => 
        hasOwnerShipContract.priviledgedAction(true ,{from: Beth}), 
        "revert"
      );
      assert.equal(await hasOwnerShipContract.flag(), false);
    });
  });

  describe("\nHasOwnerShip in GODMODE", function(){
    let hasOwnerShipContract;

    beforeEach(async function() {
      hasOwnerShipContract = await HasOwnerShip.new({ from: Alex });
      await GODMODE.open();
    });
    afterEach(async function() {
      await GODMODE.close();
    });

    it("GODMODE: allows Beth access to the privilegedAction!", async function(){

      // Boolean starts as false
      let startingFlag = await hasOwnerShipContract.flag();
      assert.equal(startingFlag, false);

      // Beth flips the boolean
      await GODMODE.executeAs(
        hasOwnerShipContract, 
        HasOwnerShipInstrumented, 
        "priviledgedAction",
        true, 
        {from: Beth}
      );

      // Boolean ends as true
      let endingFlag = await hasOwnerShipContract.flag();
      assert.equal(endingFlag, true);
    });

    it("GODMODE: allows Beth to become the owner!", async function(){

      // Owner starts as Alex
      let startingOwner = await hasOwnerShipContract.owner();
      assert.equal(startingOwner, Alex);

      // Beth sets themself as the owner
      await GODMODE.executeAs(
        hasOwnerShipContract, 
        HasOwnerShipSETOWNER, 
        "setOwner", 
        {from: Beth}
      );

      // Beth is indeed the owner
      let endingOwner = await hasOwnerShipContract.owner();
      assert.equal(endingOwner, Beth);
    });
  });

});

/**
 * Checks that a transaction failed when it was intended to, throws otherwise.
 * @param promise {object} Function returning a promise
 * @param msg {string} Expected failure message
 */
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

