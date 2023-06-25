import { Injectable } from '@nestjs/common';
import { bufferToHex } from 'ethereumjs-util';
import { encrypt } from 'eth-sig-util';

@Injectable()
export class EthService {
  async encrypt(publicKey: string, message: string): Promise<string> {
    const encryptedMessage = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt(publicKey, { data: message }, 'x25519-xsalsa20-poly1305'),
        ),
        'utf8',
      ),
    );

    return encryptedMessage;
  }
}
