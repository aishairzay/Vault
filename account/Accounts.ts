import axios from "axios";
import { ec as EC } from "elliptic";

const LILICO_API = "https://openapi.lilico.org/v1/address";
// Public token in the URL
const FLOWSCAN_API =
    "https://query.flowgraph.co/?token=5a477c43abe4ded25f1e8cc778a34911134e0590";

export interface Account {
    address: string;
    publicKey: string;
    privateKey: string;
}

export const createAccount = async (
    network: string = "testnet"
): Promise<Account> => {
    let lilicoEndpoint;
    let flowScanEndpoint;
    if (network === "testnet") {
        lilicoEndpoint = `${LILICO_API}/testnet`;
        flowScanEndpoint = FLOWSCAN_API.replace("query.", "query.testnet.");
    } else if (network === "mainnet") {
        lilicoEndpoint = LILICO_API;
        flowScanEndpoint = FLOWSCAN_API;
    } else {
        throw new Error(`Invalid network ${network}}`);
    }
    const ec = new EC("p256");
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic("hex").replace(/^04/, "");
    const privateKey = keyPair.getPrivate("hex");

    try {
        const lilicoResponse = await axios.post(
            lilicoEndpoint,
            {
                publicKey: publicKey,
                signatureAlgorithm: "ECDSA_P256",
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
            const flowScanResponse = await axios.post(
                flowScanEndpoint,
                {
                    operationName: "TransactionEventsSectionQuery",
                    variables: {
                        id: txId,
                        first: 20,
                    },
                    query: "query TransactionEventsSectionQuery($id: ID!, $eventTypeFilter: ID, $first: Int, $after: ID) {\n  checkTransaction(id: $id) {\n    transaction {\n      eventTypes {\n        id\n        __typename\n      }\n      eventCount\n      events(first: $first, typeId: $eventTypeFilter, after: $after) {\n        edges {\n          node {\n            index\n            type {\n              id\n              __typename\n            }\n            fields\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
                },
                {
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                }
            );
            if (
                flowScanResponse.data.errors &&
                flowScanResponse.data.errors.length > 0 &&
                flowScanResponse.data.errors[0].message.includes(
                    "cannot get transaction info"
                )
            ) {
                // Tx not done, sleep
                await new Promise((r) => setTimeout(r, 2000));
                continue;
            }
            accountAddress =
                flowScanResponse.data.data.checkTransaction.transaction.events.edges.filter(
                    (e: any) => e.node.type.id.includes("AccountCreated")
                )[0].node.fields[0].value;
        } while (count++ < 10 && !accountAddress);

        if (!accountAddress) {
            throw new Error("Was not able to get a reply from FlowScan");
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
