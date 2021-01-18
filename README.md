![GodMode Logo](https://godmode-assets-temporary.s3.eu-west-3.amazonaws.com/godmode_logo.jpg)

This sample project demonstrates how GodMode allows you to gain control of contracts running on an instance of Ganache CLI.

With `CustomContracts.test.js`, Alex has a contract with a privileged action (a Boolean flag that can be flipped only by him). Using GodMode, Beth can access this privileged action and flip the flag, too.

### Usage

---

1. Download and install dependencies for the [GodMode Ganache CLI](https://github.com/xGodMode/godmode-ganache-cli).

2. Clone this repository and run `$ npm install`

3. Open a shell/cmd in your **GodMode Ganache CLI** directory and run `$ npm run start`

4. Replace `'<rpc endpoint>'` with your GodMode Ganache CLI **endpoint** in `CustomContracts.test.js`

   ```javascript
   const GODMODE = new GM('development', '<rpc_endpoint>');
   ```

   By default, GodMode Ganache CLI runs at `http://127.0.0.1:8545`, so use this endpoint unless you're running a custom configuration.

5. Open a shell/cmd in the directory that you cloned this repository into and run
   `$ truffle test CustomContracts.test.js`
