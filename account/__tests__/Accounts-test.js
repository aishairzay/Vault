import { createAccount } from "../accounts";

// This test acutally creates an account so only run manually by adding .only (don't commit it)
test(`creates an account`, async () => {
    let account = await createAccount();
    expect(account.address).toBeDefined();
    expect(account.address.startsWith("0x")).toBeTruthy();
    console.log(account);
}, 60000);

test.only(`fake test`, async () => {
    // This makes it so the test above doesn't run.
});
