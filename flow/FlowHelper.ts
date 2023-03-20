import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import { Account } from "../account/Accounts";
const fcl = require("@onflow/fcl");

const ec = new EC("p256");

const hashMsgHex = (msgHex: string) => {
    const sha = new SHA3(256);
    sha.update(Buffer.from(msgHex, "hex"));
    return sha.digest();
};

const sign = (privateKey: string, msgHex: string) => {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const sig = key.sign(hashMsgHex(msgHex));
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    return Buffer.concat([r, s]).toString("hex");
};

const authorizationFunction = (
    accountAddress: any,
    keyId: any,
    privateKey: any
) => {
    return async (account: any = {}) => {
        return {
            ...account,
            tempId: `${accountAddress}-${keyId}`,
            addr: fcl.sansPrefix(accountAddress),
            keyId: keyId,
            signingFunction: (signable: any) => {
                return {
                    addr: fcl.withPrefix(accountAddress),
                    keyId: keyId,
                    signature: sign(privateKey, signable.message),
                };
            },
        };
    };
};

export class FlowHelper {
    fcl: any;
    account: Account;

    // If only running scripts, you can send in an empty account
    constructor(account: Account, network = "testnet") {
        this.fcl = fcl;
        this.account = account;
        const config = this.fcl.config();
        if (network === "testnet") {
            config.put("accessNode.api", "https://rest-testnet.onflow.org");
        } else if (network === "mainnet") {
            config.put("accessNode.api", "https://rest-mainnet.onflow.org");
        } else {
            throw new Error(`Invalid network: ${network}`);
        }
        config.put("flow.network", network);
    }

    async runScript(scriptCode: string, scriptArgs: any[] = []): Promise<any> {
        return await this.fcl.query({
            cadence: scriptCode,
            args: (_arg: any, _t: any) => scriptArgs,
        });
    }

    async startTransaction(
        transactionCode: string,
        transactionArgs: any[] = []
    ): Promise<any> {
        // Will always use the first key for now
        const keyId = 0;
        const authorization = authorizationFunction(
            this.account.address,
            keyId,
            this.account.privateKey
        );
        const response = await this.fcl.mutate({
            cadence: transactionCode,
            args: (_arg: any, _t: any) => transactionArgs,
            authorizations: [authorization],
            proposer: authorization,
            payer: authorization,
            limit: 9999,
        });

        return await this.fcl.tx(response).onceSealed();
    }
}
