const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
module.exports = async hre => {
    const { getNamedAccounts, deployments } = hre // takes these two from hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAdress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAdress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAdress = networkConfig[chainId]["ethUsdAddress"]
    }

    const args = [ethUsdPriceFeedAdress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    log("------------------------")
    //verify
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
}
module.exports.tags = ["all", "fundme"]
