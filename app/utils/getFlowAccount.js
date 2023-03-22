import { createAccount } from "./accountClient"
import * as SecureStore from 'expo-secure-store';

const KEY = 'flowAccount';

export async function getFlowAccount() {
    try {
        const value = await SecureStore.getItemAsync(KEY);
        if (value !== null) {
            return JSON.parse(value);
        } else {
            const newFlowAcc = await createAccount();
            const convertedFlowAccount = {
                "address" : newFlowAcc.address,
                "privateKey" : uint8ArrayToBase64(newFlowAcc.privateKey),
                "publicKey": uint8ArrayToBase64(newFlowAcc.publicKey),
            };
            await SecureStore.setItemAsync(KEY, JSON.stringify(convertedFlowAccount));
            return convertedFlowAccount;
        }
    } catch (error) {
        console.error('Error loading @flowAccount:', error);
    }
}

function uint8ArrayToBase64(uint8Array) {
    const buffer = Buffer.from(uint8Array);
    const base64String = buffer.toString('base64');
    return base64String;
}

function base64ToUint8Array(base64String) {
    const buffer = Buffer.from(base64String, 'base64')
    const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    return uint8Array;
}