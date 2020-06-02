const GM = require("godmode-for-test");
const HasOwnerShip = artifacts.require("HasOwnerShip");
const HasOwnerShipInstrumented = artifacts.require("HasOwnerShipInstrumented");
const HasOwnerShipSETOWNER = artifacts.require("HasOwnerShipSETOWNER");
const UniswapV2ERC20Contract = artifacts.require("UniswapV2ERC20Contract");
const UniswapV2FactoryContract = artifacts.require("UniswapV2FactoryContract");
const UniswapV2PairContract = artifacts.require("UniswapV2PairContract");
const CErc20Contract = artifacts.require("CErc20Contract");
const Dai = artifacts.require("Dai");


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";  

// SETUP GMIT
let GODMODE = new GM("development", "ws://localhost:8545");


contract("HasOwnerShip GodMode Demo", function(accounts) {

   const Alice = accounts[1];
   const Bob = accounts[2];

  
  describe("MAINNET FORK ONLY", function(){

    before(async function() {
        await GODMODE.open();      
    });

    after(async function(){
        await GODMODE.close();
    });

    // MAINNET fork only!
    it("GODMODE: mint Dai like FED ", async function(){
        let daiContract = await Dai.at("0x6B175474E89094C44Da98b954EedeAC495271d0F");
        assert.equal(await daiContract.balanceOf(Bob), 0);
        
        // BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
        for(var i = 0 ; i < 10 ; i++){
          await GODMODE.mintDai(Bob, 10000);
        }

        assert.equal(await daiContract.balanceOf(Bob), 100000);
    });    

    it("GODMODE: UnswapV2 Factory enable Fee", async function(){
      let ufc = await UniswapV2FactoryContract.at("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");
      assert.equal(await ufc.feeTo(), ZERO_ADDRESS);
      // set Fee
      await GODMODE.uniswapV2Factory_setFeeTo(Bob);
      assert.equal(await ufc.feeTo(), Bob);
    });    


    it("GODMODE: UnswapV2 Pair setKLast", async function(){
      //Paxos USDC pair (https://etherscan.io/address/0x3139Ffc91B99aa94DA8A2dc13f1fC36F9BDc98eE#readContract) 
      let upc = await UniswapV2PairContract.at("0x3139Ffc91B99aa94DA8A2dc13f1fC36F9BDc98eE");

      await GODMODE.uniswapV2Pair_setKLast("0x3139Ffc91B99aa94DA8A2dc13f1fC36F9BDc98eE",100);

      assert.equal(await upc.kLast(), 100);

    });    


    it("GODMODE: Compound Give an address CToken", async function(){
        // cBAT
        let cBAT = await CErc20Contract.at("0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e");
        assert.equal(await cBAT.balanceOf(Bob), 0 );
        await GODMODE.CToken_giveAddrTokens("0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e", Bob, 100); 
        assert.equal(await cBAT.balanceOf(Bob), 100 );       
    })
  });



  describe("Sample Contract System", function(){

    let hasOwnerShipContract;

    beforeEach(async function() {
      hasOwnerShipContract = await HasOwnerShip.new({ from: Alice });
    });

















   ////////////////////////////////////////////////////////////////////
   // already declared above 
   //
   // const Alice = accounts[1];
   // const Bob = accounts[2];
   // hasOwnerShipContract = await HasOwnerShip.new({ from: Alice });
   //
   ///////////////////////////////////////


    it("The owner of HasOwnerShip is Alice", async function() {
      // Alice is the owner!
      assert.equal(await hasOwnerShipContract.owner(), Alice);
    });




    it("Alice can access the priviledgedAction", async function(){
      // The Flag is False
      assert.equal(await hasOwnerShipContract.flag(), false);

      // Alice sets the flag, SUCCEED!
      await hasOwnerShipContract.priviledgedAction(true ,{from: Alice});
      assert.equal(await hasOwnerShipContract.flag(), true);
    });


















    it("Bob cannot access priviledgedAction", async function(){
      // The Flag is False
      assert.equal(await hasOwnerShipContract.flag(), false);

      // Bob tries to set the flag, FAIL!
      await assertTxFail(() => 
        hasOwnerShipContract.priviledgedAction(true ,{from: Bob}), 
        "revert"
      );
      assert.equal(await hasOwnerShipContract.flag(), false);
    });
















    it("GODMODE: Bob can set flag under our will!", async function() {
      // START GOD MODE
      await GODMODE.open();

      // Bob now sets the flag with GODMODE!
      await GODMODE.executeAs(
        hasOwnerShipContract, 
        HasOwnerShipInstrumented, 
        "priviledgedAction", true, 
        {from: Bob}
      );

      // The flag is being set
      assert.equal(await hasOwnerShipContract.flag(), true);

      await GODMODE.close();

    });


















    it("GODMODE: Bob can become the owner!", async function(){
      await GODMODE.open();

      // Alice is the current owner of the contract.
      assert.equal(await hasOwnerShipContract.owner(), Alice);

      // GODMODE: Let Bob becomes the owner!
      await GODMODE.executeAs(
        hasOwnerShipContract, 
        HasOwnerShipSETOWNER, 
        "setOwner", 
        {from: Bob}
      );

      // Ensure that Bob is indeed the owner
      assert.equal(await hasOwnerShipContract.owner(), Bob);

      // END GOD MODE
      await GODMODE.close();   

      // Bob sets the flag, SUCCEED!
      await hasOwnerShipContract.priviledgedAction(true ,{from: Bob});
      assert.equal(await hasOwnerShipContract.flag(), true);      

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
