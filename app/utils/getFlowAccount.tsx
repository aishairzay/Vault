import * as SecureStore from "expo-secure-store";
import { Account, createAccount } from "../../account/Accounts";

const KEY = "flowAccount";

export async function createOrGetFlowAccount(): Promise<Account> {
    try {
        const value = await SecureStore.getItemAsync(KEY);
        if (value !== null && value !== undefined) {
            console.log("Found existing account with address", JSON.parse(value).address);
            return JSON.parse(value);
        } else {
            console.log("Creating account.");
            const newFlowAcc = await createAccount();
            await SecureStore.setItemAsync(KEY, JSON.stringify(newFlowAcc));
            return newFlowAcc;
        }
    } catch (error) {
        console.error("Error loading @flowAccount:", error);
        throw error;
    }
}
