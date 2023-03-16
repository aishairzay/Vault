import { createAccount } from "../accounts";

it(`creates an account`, async () => {
    let account = await createAccount();
    expect(account.address).toBeDefined();
    expect(account.address.startsWith("0x")).toBeTruthy();
}, 60000);
