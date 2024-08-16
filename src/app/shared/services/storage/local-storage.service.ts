import { Injectable } from '@angular/core';
import { StorageService } from '@gotbot-chef/shared/services/storage/storage.service';

/**
 * Saves items to localstorage.
 * Saved values are encrypted.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends StorageService {
  protected storage = localStorage;
}
