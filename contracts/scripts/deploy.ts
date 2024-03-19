import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";

async function main() {
    const [acc0, acc1] = await ethers.getSigners()

    const Coordinator = await ethers.getContractFactory("MockCoordinator")
    const Consumer = await ethers.getContractFactory("MockConsumer")

    const coordinator = await Coordinator.deploy(acc1)
    await coordinator.waitForDeployment()
    const consumer = await Consumer.deploy(await coordinator.getAddress())
    await consumer.waitForDeployment()


    console.log("coordinator address:", await coordinator.getAddress())
    console.log("consumer address:", await consumer.getAddress())

    console.log("Deployed!")
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});