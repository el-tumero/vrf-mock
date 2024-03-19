import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";

const consumerAddress = "0x48e7a252371e2052BD17F806B6991EEbbBBD2A69"

async function main() {
    const consumer = await ethers.getContractAt("MockConsumer", consumerAddress)

    const words = await consumer.displayRandomWords()
    console.log(words)
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});