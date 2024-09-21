import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UrlencriptionService {

  private secretKey = '7P7MH430Mt';

  constructor() { }

  // Encrypt the URL
  encrypt(url: string): string {
    return AES.encrypt(url, this.secretKey).toString();
  }

  // Decrypt the URL
  decrypt(encryptedUrl: string): string {
    const bytes = AES.decrypt(encryptedUrl, this.secretKey);
    const decryptedUrl = bytes.toString(enc.Utf8); 
    return decryptedUrl; 
  }
}
