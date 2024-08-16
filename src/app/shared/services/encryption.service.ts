import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  /**
   * Encrypts the given string with the key set in the environment file.
   * @param value The string that needs to be encrypted.
   * @return {string} The encrypted string.
   */
  public encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, environment.encryptionKey).toString();
  }

  /**
   * Decrypts the encrypted text to the original string.
   * @param textToDecrypt
   *
   * @returns The decrypted string.
   */
  public decrypt(textToDecrypt: string): string {
    return CryptoJS.AES.decrypt(textToDecrypt, environment.encryptionKey).toString(CryptoJS.enc.Utf8);
  }
}
