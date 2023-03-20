import { createAccount } from "./accountClient"
import { API_KEY, API_URL } from '@env';

const KEY = '@flowAccount';

export async function getFlowAccount() {
    try {
        return await createAccount();
    } catch (error) {
        console.error('Error loading @flowAccount:', error);
    }
    /*
     try {
         const value = await AsyncStorage.getItem(KEY);
         if (value !== null) {
             return JSON.parse(value);
         } else {
             const newFlowAcc = await createAccount();
             await AsyncStorage.setItem(KEY, JSON.stringify(newFlowAcc));
         }
     } catch (error) {
         console.error('Error loading @flowAccount:', error);
     }
     */

}