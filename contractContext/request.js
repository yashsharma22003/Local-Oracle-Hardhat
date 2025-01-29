import { contract, oracleContract } from "./contractInstance.js";

async function retrievePropData(_propId = "PROP39967") {

    const tx = await contract.requestExternalData(_propId);
    tx.wait();

    oracleContract.on("DataRequested", async (reqId, propId) => {
        if (reqId !== "") {  
            console.log(`Request Id For Property ${propId} is: ${reqId}`);
            await getResponseFromId(reqId);
        }
    });

    async function getResponseFromId(reqId) {
        try {
            const intReq = BigInt(reqId);
            
            let res;
            let retries = 5;
            
            while (retries > 0) {
                res = await contract.fetchFulfilledData(intReq);
                if (res && res !== "0") {  
                    console.log(`Response For Request Id ${intReq}: Is ${res}`);
                    process.exit(0); 
                   
                }
                console.log(`Waiting for response... `);
                console.log(`Retries left: ${retries}`);
                await new Promise(resolve => setTimeout(resolve, 700)); 
                retries--;
            }
     
            console.log(`No response received for request ID ${intReq} after retries.`);
            return res;

        } catch (e) {
            console.error("Error fetching fulfilled data:", e);
            process.exit(1);
        }
    }
}

retrievePropData();
