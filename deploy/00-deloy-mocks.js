// if contract is not any network then mocking is done , eg if we use local network where chainlink pricefeed is not hosted
//then we use mocking 

const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId          //network.name is hardhat
    if (chainId === 31337) {                //we can use develpomentChains.include(network.name)
        log("local network detechted! deploying mocks ...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })

        log("mocks deployed")
        log("-----------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
