![GodMode Logo](https://godmode-public-assets.s3.amazonaws.com/godmode_logo.jpg)

This sample project demonstrates how GodMode allows you to gain control of contracts running on an instance of Ganache CLI.

With `CustomContracts.test.js`, Alex has a contract with a privileged action (a Boolean flag that can be flipped only by him). Using GodMode, Beth can access this privileged action and flip the flag, too.

### Usage

---

1. Download and install dependencies for the [GodMode Ganache CLI](https://github.com/xGodMode/godmode-ganache-cli)

2. Open a shell/cmd in your **godmode-ganache-cli** directory and run `$ npm run start`

3. In another shell/cmd, clone this repository and run `$ npm install` in **godmode-sample-projects** 

4. In the same directory, install the GodMode contracts by running `$ npx godmode install`

5. In `CustomContracts.test.js`, replace `'<rpc_endpoint>'` with the endpoint that **godmode-ganache-cli** is running on

   ```js
   const GODMODE = new GM('development', '<rpc_endpoint>');
   ```
   By default, GodMode Ganache CLI runs at `http://127.0.0.1:8545`, so use this endpoint unless you're running a custom configuration.

6. Finally, see how GodMode works by running `$ truffle test CustomContracts.test.js`
