require("@nomicfoundation/hardhat-toolbox") // this is bundle of  packages, all used in previous project
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.17",
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
    },
    defaultNetwork: "hardhat",
}
