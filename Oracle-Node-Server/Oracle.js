import { ethers } from "ethers";
import fs from "fs";

const oracleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const oracleABI = [
    "event DataRequested(uint256 requestId, string url)",
    "function fulfillData(uint256 requestId, string data) public",
];

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
const oracleContract = new ethers.Contract(oracleAddress, oracleABI, wallet);

async function listenRequests() {
    oracleContract.on("DataRequested", async (requestId, url) => {
        console.log(`Request ID: ${requestId}, URL: ${url}`);

        try {
            const response = await fetchProperty(url);
            const data = JSON.stringify(response);
            console.log(`Fetched Data: ${data}`);

            const tx = await oracleContract.fulfillData(requestId, data);
            await tx.wait();
            console.log(`Request ID ${requestId} fulfilled with data: ${data}`);
        } catch (error) {
            console.error(`Error fetching data from URL ${url}:`, error);
        }
    });

    console.log('Listening for data requests...');
}

function fetchProperty(propertyId) {

    const filePath = "./Property-Database/sample_properties.json";
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const property = jsonData.properties.find(
        (item) => item.property_id === propertyId
    );

    if (property) {
        console.log("Property Found:", property);
        return property;
    } else {
        console.log("Property not found");
        return null;
    }
}

listenRequests();
