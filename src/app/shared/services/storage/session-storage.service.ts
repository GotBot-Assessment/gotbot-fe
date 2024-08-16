import { Injectable } from '@angular/core';
import { StorageService } from '@gotbot-chef/shared/services/storage/storage.service';

/**
 * Saves values to session storage.
 *
 * Saved values are encrypted.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService extends StorageService {
  protected storage = sessionStorage;
}
