import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';

export const createHash = async (pw: string, hashAlgorithm: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pw
  );
  return digest.toString()
}

export const symmetricDecryptMessage = (message: string, key: string, algorithm: string): any => {
  // using the key and algorithm, decrypt the message
  // return the decrypted message
  return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
}

export const symmetricEncryptMessage = (message: string, key: string, algorithm: string): any => {
  // using the key and algorithm, encrypt the message
  // assuming only algorithm used here ATM is AES
  return CryptoJS.AES.encrypt(message, key).toString();
}

/*
to be used during creation of a new vault
or when testing

const key = 'samplesalt:apples'//deriveKey('samplesalt:apples')
createHash(key, 'SHA256').then((hashedKey) => {
  const encrypted = symmetricEncryptMessage('Nice Solve, Join the secret discord at https://discord.gg/SecretApplesSociety', key, 'AES')
  console.log('encrypted is', encrypted)
  
  const unencrypted = symmetricDecryptMessage(encrypted, key, 'AES')
})
*/