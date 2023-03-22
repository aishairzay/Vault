import axios from "axios";
import * as secp from "@noble/secp256k1";

const LILICO_API = "https://openapi.lilico.org/v1/address";
// Public token in the URL
const FLOW_TRANSACTION_API =
    "https://rest-mainnet.onflow.org/v1/transaction_results/";

export interface Account {
    address: string;
    publicKey: string;
    privateKey: string;
}

export const createAccount = async (
    network: string = "testnet"
): Promise<Account> => {
    let lilicoEndpoint;
    let flowTxEndpoint;
    if (network === "testnet") {
        lilicoEndpoint = `${LILICO_API}/testnet`;
        flowTxEndpoint = FLOW_TRANSACTION_API.replace("mainnet", "testnet");
    } else if (network === "mainnet") {
        lilicoEndpoint = LILICO_API;
        flowTxEndpoint = FLOW_TRANSACTION_API;
    } else {
        throw new Error(`Invalid network ${network}}`);
    }
    const privateKey = buf2hex(secp.utils.randomPrivateKey());
    const publicKey = buf2hex(secp.getPublicKey(privateKey));

    try {
        const lilicoResponse = await axios.post(
            lilicoEndpoint,
            {
                publicKey: publicKey,
                signatureAlgorithm: "ECDSA_secp256k1",
                hashAlgorithm: "SHA3_256",
                weight: 1000,
            },
            {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    Authorization: process.env.LILICO_TOKEN,
                },
            }
        );
        const txId = lilicoResponse.data.data.txId;
        if (!txId) {
            throw new Error("Was not able to get a reply from Lilico");
        }
        await new Promise((r) => setTimeout(r, 2000));
        let accountAddress;
        let count = 0;
        do {
            const flowTxResponse = await axios.get(flowTxEndpoint + txId, {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
            });
            if (flowTxResponse.data.status !== "Sealed") {
                // Tx not done, sleep
                await new Promise((r) => setTimeout(r, 2000));
                continue;
            }
            let base64AccountAddress = flowTxResponse.data.events.filter(
                (e: any) => e.type.includes("AccountCreated")
            )[0].payload;
            let accountObject: any = JSON.parse(
                Buffer.from(base64AccountAddress, "base64").toString("utf8")
            );
            accountAddress = accountObject.value.fields[0].value.value;
        } while (count++ < 10 && !accountAddress);

        if (!accountAddress) {
            throw new Error("Was not able to get a reply from Flow");
        }

        return {
            address: accountAddress,
            publicKey: publicKey,
            privateKey: privateKey,
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

function buf2hex(buffer: Uint8Array) {
    // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
        .replace(/^04/, "");
}
