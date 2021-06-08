![GodMode Logo](https://godmode-public-assets.s3.amazonaws.com/godmode_logo.jpg)

This sample project demonstrates how GodMode allows you to gain control of contracts running on an instance of Ganache CLI.

With `CustomContracts.test.js`, Alex has a contract with a privileged action (a Boolean flag that can be flipped only by him). Using GodMode, Beth can access this privileged action and flip the flag, too.

With `ExternalContracts.test.js`, we can perform actions on Maker, Uniswap and Compound that we don't have priveleges for on Mainnet.

### Pre-Requisites

---

1. Install the Truffle framework via `$ npm install -g truffle`.

2. Install and run an instance of the [GodMode Ganache CLI](https://github.com/xGodMode/godmode-ganache-cli).

3. An [Infura](https:/infura.io) **Mainnet** endpoint (for demonstrating the external contracts running on a copy of mainnet).

### Custom Contracts

---

1. Open a shell/cmd in your **godmode-ganache-cli** directory and run `$ npm run start`.

2. In another shell/cmd, clone this repository into **godmode-sample-projects** , cd into this new directory and run `$ npm install`

3. By default, **GodMode Ganache CLI** creates an endpoint at `http://127.0.0.1:8545`. In `CustomContracts.test.js` you can customise this by editing the line below.

   ```js
   const GODMODE = new GM('development', 'http://127.0.0.1:8545');
   ```

   By default, GodMode Ganache CLI runs at `http://127.0.0.1:8545`, so use this endpoint unless you're running a custom configuration.

4. Finally, at the root of your **godmode-sample-project** directory, run `$ truffle test test/CustomContracts.test.js`

GodMode runs the tests showing before and after taking control of the a contract. Your test output should look like the following:

    HasOwnerShip
          ✓ starts with Alex as the owner
          ✓ allows Alex to access the priviledgedAction (e.g. flip a boolean) (95ms)
          ✓ does not allow Beth to access the priviledgedAction (454ms)

    HasOwnerShip in GODMODE
          ✓ GODMODE: allows Beth access to the privilegedAction! (148ms)
          ✓ GODMODE: allows Beth to become the owner! (127ms)

### External Contracts

---

1. At a command line in your **godmode-ganache-cli** folder, run `$ export INFURA_PROJECT_ID=<your-infura-project-id>`

2. Run `$ npm run start-fork`.

3. In another shell/cmd, clone this repository into **godmode-sample-projects** , cd into this new directory and run `$ npm install`

4. Install the GodMode versions of the external contracts via `$ npx godmode install`

5. By default, **GodMode Ganache CLI** creates an endpoint at `http://127.0.0.1:8545`. In `ExternalContracts.test.js` you can customise this by editing the line below.

   ```js
   const GODMODE = new GM('ethereum:mainnet', 'ws://127.0.0.1:8545');
   ```

   By default, GodMode Ganache CLI runs at `http://127.0.0.1:8545`, so use this endpoint unless you're running a custom configuration.

6. Finally, at the root of your **godmode-sample-project** directory, run `$ truffle test test/ExternalContracts.test.js`

Your output should look like the following:

    Mainnet DAI
    Done adding preset protocols.
    Alex's starting balance: 0
    Alex's ending balance: 200
          ✓ GODMODE: can mint DAI to any account as much as I want (774ms)

    Mainnet Uniswap V2
    Starting fee collector is no one: 0x0000000000000000000000000000000000000000
    Ending fee collector is Beth: 0x5F001a03679b1704DEee8d25976510fCA32550d4
          ✓ GODMODE: can set any account I want as the fee collector (626ms)

    Mainnet Compound
    Carl's starting balance: 0
    Carl's ending balance: 100
          ✓ GODMODE: can give CTokens to any account I want (676ms)
