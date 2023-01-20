const { network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre // takes these two from hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const ethUsdPriceFeedAdress = networkConfig[chainId]["ethUsd"]

    //what if contract doesnt exist on netork such as hardhat when we try to get pricefeed\
    //local testing,mocks

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [],
        log: true,
    })
}
