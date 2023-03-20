import { FlowHelper } from "../FlowHelper";

test.only(`can call script`, async () => {
    const flowHelper = new FlowHelper();
    const scriptResult = await flowHelper.runScript(
        "pub fun main(): Int { return 42 }"
    );
    expect(scriptResult).toEqual("42");
});

// This test requires credentials to run, set the environment variables and run manually by adding .only (don't commit it)
test(`can call tx`, async () => {
    const flowHelper = new FlowHelper({
        address: process.env.FLOW_ADDRESS,
        privateKey: process.env.FLOW_PRIVATE_KEY,
        publicKey: process.env.FLOW_PUBLIC_KEY,
    });
    const result = await flowHelper.startTransaction(
        "transaction() { prepare(signer: AuthAccount) { } execute { } }"
    );
    console.log(result);
}, 60000);
