import {
    loadFixture, mine,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  import { AbiCoder, EventLog, Signature, hexlify, keccak256 } from "ethers"
  import { randomBytes } from "crypto";
  
  describe("Request tests", function () {
  
    async function deployFixture() {
        const [acc0, acc1] = await ethers.getSigners()
  
        const Coordinator = await ethers.getContractFactory("MockCoordinator")
        const coordinator = await Coordinator.deploy(acc1.address)
  
        const Consumer = await ethers.getContractFactory("MockConsumer")
        const consumer = await Consumer.deploy(await coordinator.getAddress())
  
      return { coordinator, consumer, acc0, acc1};
    }




    describe("Tests", () => {
        it("Request to coordinator", async() => {
            const {consumer, coordinator, acc1} = await loadFixture(deployFixture)
            await consumer.requestRandomWord()
            
            const [requestId, request] = await coordinator.findRequestToExecute()
            
            // convert hex string to Uint8Array
            const conv = Uint8Array.from(Buffer.from(request.input.slice(2), 'hex'));            
            // sign message
            const n = await acc1.signMessage(conv)
            // get v, r, s
            const {v, r, s} = Signature.from(n)

            await coordinator.connect(acc1).execute(requestId, v, r, s)
            expect(await consumer.displayRandomWords()).to.have.length(1)

            // console.log(await consumer.displayRandomWords())
        })

        it("2 requests to coordinator", async() => {
            const {consumer, coordinator, acc1} = await loadFixture(deployFixture)
            await consumer.requestRandomWord()
            await consumer.requestRandomWord()
            
            const [requestId, request] = await coordinator.findRequestToExecute()            
            const conv = Uint8Array.from(Buffer.from(request.input.slice(2), 'hex'));            
            const {v, r, s} = Signature.from(await acc1.signMessage(conv))
            await coordinator.connect(acc1).execute(requestId, v, r, s)

            // do it again
            const [requestId2, request2] = await coordinator.findRequestToExecute()
            const conv2 = Uint8Array.from(Buffer.from(request2.input.slice(2), 'hex'));            
            const {v: v2, r: r2, s: s2} = Signature.from(await acc1.signMessage(conv2))
            await coordinator.connect(acc1).execute(requestId2, v2, r2, s2)

            expect(await consumer.displayRandomWords()).to.have.length(2)

        })


    })

})