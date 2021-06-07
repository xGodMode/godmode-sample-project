
![GodMode Logo](https://godmode-public-assets.s3.amazonaws.com/godmode_logo.jpg)

This sample project demonstrates how GodMode allows you to gain control of contracts running on an instance of Ganache CLI.

With `CustomContracts.test.js`, Alex has a contract with a privileged action (a Boolean flag that can be flipped only by him). Using GodMode, Beth can access this privileged action and flip the flag, too.

### Pre-Requisites
---
1. Install the [Truffle framework](https://github.com/trufflesuite/truffle) via `$ npm install -g truffle`.

2. Clone the [GodMode Ganache CLI](https://github.com/xGodMode/godmode-ganache-cli) repository.


### Custom Contracts
---

1. Open a shell/cmd in your **godmode-ganache-cli** directory and run `$ npm run start`.

2. In another shell/cmd, clone this repository into **godmode-sample-projects** , cd into this new directory and run `$ npm install` 

3. By default, **GodMode Ganache CLI** creates an endpoint at `http://127.0.0.1:8545`. In `CustomContracts.test.js` you can customise this by editing the line below. 

   ```js
   const GODMODE = new GM('development', 'http://127.0.0.1:8545');
   ```
   By default, GodMode Ganache CLI runs at `http://127.0.0.1:8545`, so use this endpoint unless you're running a custom configuration.

4. Finally, `cd` into the `test` folder and run `$ truffle test CustomContracts.test.js`

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
This section coming soon...
