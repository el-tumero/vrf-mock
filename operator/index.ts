import { MockCoordinator } from "../contracts/typechain-types/contracts/MockCoordinator"
import { MockCoordinator__factory} from "../contracts/typechain-types/factories/contracts/MockCoordinator__factory"
import 'dotenv/config'
import {JsonRpcProvider, Signature, Wallet} from "ethers"

let coordinator:MockCoordinator
let wallet:Wallet


async function connect() {
    const provider = new JsonRpcProvider(process.env.RPC_URL as string)
    wallet = new Wallet(process.env.PRIV_KEY as string, provider)
    coordinator = await MockCoordinator__factory.connect(process.env.COORDINATOR_ADDR as string, wallet)    
}

const DELAY = 30 * 1000

async function generateVRF(hexSeed:string){
    const conv = Uint8Array.from(Buffer.from(hexSeed.slice(2), 'hex'));            
    return Signature.from(await wallet.signMessage(conv))
}

async function execute(requestId:bigint, input:string){
    const {v, r, s } = await generateVRF(input)
    const tx = await coordinator.execute(requestId, v, r, s)
    await tx.wait()
}

const RequestState = {
    NONE: 0n,
    EXISTS: 1n,
    EXECUTED: 2n
}




const executedRequests:bigint[] = []

async function main() {
    await connect()
    console.log("Connected!")


    coordinator.addListener(coordinator.filters.RequestReceived, async(requestId:bigint, input:string, evt:Event) => {
        if(executedRequests.includes(requestId)) return
        const state = await coordinator.checkStatus(requestId)
        if(state == RequestState.EXISTS) {
            console.log("New request[l]!", requestId)
            executedRequests.push(requestId)
            await execute(requestId, input)
            console.log("Done!", requestId)
        }
    })


    setInterval(async() => {
        const response = await coordinator.findRequestToExecute()
        const requestId = response[0]
        const request = response[1]
        if(request.state == RequestState.NONE) return
        if(executedRequests.includes(requestId)) return
        if(request.state == RequestState.EXISTS) {
            console.log("New request[c]!", requestId)
            executedRequests.push(requestId)
            await execute(requestId, request.input)
            console.log("Done!", requestId)
        }
    }, DELAY)

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});