# Working example Ceramic + React + Typescript

This is an example showing how to have basic interaction with Ceramic Network Testnet (https://ceramic-clay.3boxlabs.com).

This React app allows you to:

- create and authenticate a DID
- write to a document in family "HOPR Logs"
- update the document with a custom String content

Every time you'll authenticate again, the same Document will be loaded and logged in the console.
Every time you update or fetch document, the action will be loaded in the console.

## Installation

`yarn`

## Run the app

You'll need to have MetaMask or any equivalent software wallet extension installed in browser before running the app.
It must be connected to Ethereum mainnet network. For security reasons, do not use a wallet with funds in it or which you plan to add funds to.

`yarn start`

## License

This work is licensed under the [BSD-2-Clause Plus Patent](https://spdx.org/licenses/BSD-2-Clause-Patent.html) license.
Third-parties have their own license which are mainly permissive licenses such as Apache or MIT - refer to the corresponding projects for details.
