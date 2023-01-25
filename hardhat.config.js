require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-chai-matchers")

const GROELI_RPC_URL = process.env.GROELI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINT_MARKET_CAP_API = process.env.COINT_MARKET_CAP_API
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.17",
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.6.6" }]
    },
    defaultNetwork: "hardhat",
    networks: {
        groeli: {
            url: GROELI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    gasReporter: {
        enabled: true, //keep it false for fast operation but gas report will not be printed
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD"
        // coinmarketCap: COINT_MARKET_CAP_API
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0
        }
    }
}
