import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'


const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL as string,
        enabled: false,
        blockNumber: 5402075
      },
      accounts: [
        {privateKey: process.env.PRIV_KEY as string, balance: "1000000000000000000"},
        {privateKey: process.env.PRIV_KEY2 as string, balance: "1000000000000000000"}
      ]
    },
    sepolia: {
      url: process.env.RPC_URL as string,
      accounts: [process.env.PRIV_KEY as string, process.env.PRIV_KEY2 as string]
    }
  }

}

export default config;
