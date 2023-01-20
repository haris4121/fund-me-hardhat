//used to tell which network to use to get price feed

const networkConfig = {
    5: {
        name: "groeli",
        ethUsd: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    137: {
        name: "polygon",
        ethUsd: "0x19b0F0833C78c0848109E3842D34d2fDF2cA69BA",
    },
}
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = "8"
const INITIAL_ANSWER = "200000000000" //2000,and 8 decimals

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
