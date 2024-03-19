import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";

const consumerAddr = ""

async function main() {
    const consumer = await ethers.getContractAt("MockConsumer", consumerAddr)

    const reqTx = await consumer.requestRandomWord()
    await reqTx.wait()

    console.log("Request sent!")
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});