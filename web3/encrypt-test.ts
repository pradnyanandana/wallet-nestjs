import * as sigUtil from 'eth-sig-util';
import * as crypto from 'crypto';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import Wallet from 'ethereumjs-wallet';
import { toBuffer, bufferToHex } from 'ethereumjs-util';

config();

const metamaskAddress: string = process.env.METAMASK_ADDRESS;
const metamaskPrivateKey: string = process.env.METAMASK_PRIVATE_KEY;

const jsonString: string = process.env.JSON_DATA;

const privateKeyHex = `0x${metamaskPrivateKey}`;
const privateKeyBuffer: Buffer = toBuffer(privateKeyHex);
const wallet: Wallet = Wallet.fromPrivateKey(privateKeyBuffer);

// Get a public key
const publicKeyHex: string = bufferToHex(wallet.getPublicKey());
const publicKey = `0x${publicKeyHex}`;

console.log(publicKey);

// Create an elliptic curve key pair
// const publicKey = crypto.createPublicKey({
//   key: privateKey,
//   format: 'pem',
//   type: 'pkcs1',
// });

// const encryptData = (content: string, symmetricKey: string): string => {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);

//   let encryptedContent = cipher.update(content, 'utf8', 'hex');

//   encryptedContent += cipher.final('hex');

//   return iv.toString('hex') + encryptedContent;
// };

// const decryptData = (
//   encryptedContent: string,
//   symmetricKey: string,
// ): string => {
//   const iv = Buffer.from(encryptedContent.slice(0, 32), 'hex');
//   const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, iv);

//   let decryptedContent = decipher.update(
//     encryptedContent.slice(32),
//     'hex',
//     'utf8',
//   );

//   decryptedContent += decipher.final('utf8');

//   return decryptedContent;
// };

// const encryptSymmetricKey = (
//   symmetricKey: string,
//   recipientPublicKey: string,
// ): string => {
//   console.log(recipientPublicKey);
//   const encryptedSymmetricKey = sigUtil.encrypt(
//     recipientPublicKey,
//     { data: symmetricKey },
//     'x25519-xsalsa20-poly1305',
//   );

//   return JSON.stringify(encryptedSymmetricKey);
// };

// const decryptSymmetricKey = (
//   encryptedSymmetricKey: string,
//   ownerPrivateKey: string,
// ): string => {
//   const decryptedSymmetricKey = sigUtil.decrypt(
//     JSON.parse(encryptedSymmetricKey),
//     ownerPrivateKey,
//   );

//   return JSON.parse(decryptedSymmetricKey).data;
// };

// const symmetricKey = crypto.randomBytes(32).toString('hex');

// const encryptedContent = encryptData(jsonString, symmetricKey);

// const encryptedSymmetricKey = encryptSymmetricKey(
//   symmetricKey,
//   recipientPublicKey,
// );

// const decryptedSymmetricKey = decryptSymmetricKey(
//   encryptedSymmetricKey,
//   ownerPrivateKey,
// );

// const decryptedContent = decryptData(encryptedContent, decryptedSymmetricKey);

// const decryptedData = JSON.parse(decryptedContent);

// console.log('Encrypted Data:', encryptedContent);
// console.log('Decrypted Data:', decryptedData);
