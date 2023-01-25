const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", () => {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendVal = ethers.utils.parseEther("1")
    beforeEach(async function() {
        // since we are doing testing on local network(hardhat)
        //deploy our fundme
        //using hard hat deploy
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", function() {
        it("sets the aggregator address correctly", async () => {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", function() {
        it("fails if we dont send enough eth", async () => {
            await expect(fundMe.fund()).to.be.reverted
        })
        it("update the amount funded data structure", async () => {
            await fundMe.fund({ value: sendVal })
            const response = await fundMe.getAddressToAmount(deployer)
            assert.equal(response.toString(), sendVal.toString())
        })
        it("adds array funder to array of funder", async () => {
            await fundMe.fund({ value: sendVal })
            const funder = await fundMe.getFunder(0)
            assert.equal(deployer, funder)
        })
    })

    describe("with draw", () => {
        beforeEach(async function() {
            await fundMe.fund({ value: sendVal })
        })

        it("withdraws ETH from a single funder", async () => {
            const statingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReciept = await transactionResponse.wait()

            const { gasUsed, effectiveGasPrice } = transactionReciept
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingDeployerBalance.add(statingFundMeBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })

        it("it helps us to withdraw from diffrent s_funders", async () => {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = fundMe.connect(accounts[i])
                await fundMe.fund({ value: sendVal })
            }

            const statingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReciept = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReciept
            const gasCost = gasUsed.mul(effectiveGasPrice)

            //reset s_funders
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmount(accounts[i].address),
                    0
                )
            }
        })

        it("only allows owner to withdraw", async () => {
            const accounts = await ethers.getSigners()
            const fundMeConnectedContract = await fundMe.connect(accounts[1])
            await expect(
                fundMeConnectedContract.withdraw()
            ).to.be.revertedWithCustomError(
                fundMeConnectedContract,
                "FundMe__NotOwner"
            )
        })
    })
})
