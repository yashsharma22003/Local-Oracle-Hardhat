import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Set up provider
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

  // Initialize wallet
  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  try {
    // Load compiled contract artifacts
    const oracleArtifactPath = path.join(
      __dirname,
      "../artifacts/contracts/IOracle.sol/IOracle.json"
    );
    const consumerArtifactPath = path.join(
      __dirname,
      "../artifacts/contracts/Consumer.sol/Consumer.json"
    );

    const oracleArtifact = JSON.parse(fs.readFileSync(oracleArtifactPath, "utf8"));
    const consumerArtifact = JSON.parse(fs.readFileSync(consumerArtifactPath, "utf8"));

    // Create contract factories
    const OracleContractFactory = new ethers.ContractFactory(
      oracleArtifact.abi,
      oracleArtifact.bytecode,
      wallet
    );
    const ConsumerContractFactory = new ethers.ContractFactory(
      consumerArtifact.abi,
      consumerArtifact.bytecode,
      wallet
    );

    // Deploy the Oracle contract
    console.log("Deploying The Oracle Contract...");
    const deployOracle = await OracleContractFactory.deploy();
    await deployOracle.deploymentTransaction().wait();
    
    // Correct way to get deployed contract address
    const oracleAddress = await deployOracle.getAddress();  
    console.log("Deployed Oracle Address:", oracleAddress);

    // Deploy the Consumer contract with the Oracle contract address
    console.log(`Deploying Consumer Contract With Oracle Address: ${oracleAddress}...`);
    const deployConsumer = await ConsumerContractFactory.deploy(oracleAddress);
    await deployConsumer.deploymentTransaction().wait();
    
    // Correct way to get deployed contract address
    const consumerAddress = await deployConsumer.getAddress();
    console.log("Deployed Consumer Address:", consumerAddress);
  } catch (error) {
    console.error("Error in Deploying Contracts:", error);
  }
}

// Run the script
main();
