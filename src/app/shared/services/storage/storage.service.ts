import { inject, Injectable } from '@angular/core';
import { EncryptionService } from '@gotbot-chef/shared/services/encryption.service';

/**
 * Generic service to store values into browser storage.
 */
@Injectable({
  providedIn: 'root'
})
export abstract class StorageService {
  protected readonly encryptionService = inject(EncryptionService);
  protected abstract storage: Storage;

  /**
   * Clears the storage.
   */
  public clear(): void {
    this.storage.clear();
  }

  /**
   * Fetches the stored item from storage.
   * @param key
   */
  public getItem<T = string>(key: string): T | undefined {
    let savedString = this.storage.getItem(key);

    if (!savedString) {
      return undefined;
    }

    savedString = this.encryptionService.decrypt(savedString);
    if (savedString.startsWith('{') || savedString.startsWith('[')) {
      return JSON.parse(savedString) as T;
    }

    return savedString as T;
  }

  /**
   * Removes an item from storage.
   * @param key
   */
  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * Sets a value into local storage.
   * @param key The key used to store the value with.
   * @param value The item that needs to be stored.
   */
  public setItem(key: string, value: string | object): void {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }

    this.storage.setItem(key, this.encryptionService.encrypt(value as string));
  }
}
