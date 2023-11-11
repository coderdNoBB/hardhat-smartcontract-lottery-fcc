const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}


async function updateAbi() {
    const raffleContract = await deployments.get('Raffle')
    const raffle = await ethers.getContractAt(
        raffleContract.abi,
        raffleContract.address
    )
    fs.writeFileSync(frontEndAbiFile, raffle.interface.formatJson())
}

async function updateContractAddresses() {
    const raffleContract = await deployments.get('Raffle')
    const raffle = await ethers.getContractAt(
        raffleContract.abi,
        raffleContract.address
    )
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        if (!contractAddresses[network.config.chainId.toString()].includes(raffle.address)) {
            contractAddresses[network.config.chainId.toString()]=raffle.address
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [raffle.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
