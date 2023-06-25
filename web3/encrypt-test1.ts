import { config } from 'dotenv';
import { toBuffer, bufferToHex } from 'ethereumjs-util';
import Wallet from 'ethereumjs-wallet';
import * as crypto from 'crypto';

config();

const metamaskAddress: string = process.env.METAMASK_ADDRESS;
const metamaskPrivateKey: string = process.env.METAMASK_PRIVATE_KEY;

const jsonString: string = process.env.JSON_DATA;

const privateKeyHex = `0x${metamaskPrivateKey}`;
const privateKeyBuffer: Buffer = toBuffer(privateKeyHex);
const wallet: Wallet = Wallet.fromPrivateKey(privateKeyBuffer);

const publicKeyHex: string = bufferToHex(wallet.getPublicKey());
const publicKey = `0x${publicKeyHex}`;

const encrypt = (publicKey: string, plainText: string): string => {
  const buffer = Buffer.from(plainText, 'utf-8');
  const encryptedData = crypto.publicEncrypt(publicKey, buffer);
  return encryptedData.toString('base64');
};

const decrypt = (privateKey: string, encryptedText: string): string => {
  const buffer = Buffer.from(encryptedText, 'base64');
  const decryptedData = crypto.privateDecrypt(privateKey, buffer);
  return decryptedData.toString('utf-8');
};

const encryptedData = encrypt(publicKey, jsonString);
const decryptedData = decrypt(metamaskPrivateKey, encryptedData);

console.log('Original Data:', jsonString);
console.log('Encrypted Data:', encryptedData);
console.log('Decrypted Data:', decryptedData);
