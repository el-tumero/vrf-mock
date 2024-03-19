import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";

async function main() {
    const [acc0, acc1] = await ethers.getSigners()

    const Coordinator = await ethers.getContractFactory("MockCoordinator")

    const coordinator = await Coordinator.deploy(acc1)
    await coordinator.waitForDeployment()

    console.log("coordinator address:", await coordinator.getAddress())

    console.log("Coordinator deployed!")
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});