import { inject, Injectable } from '@angular/core';
import { EncryptionService } from '@gotbot-chef/shared/services/encryption.service';
import { StorageService } from '@gotbot-chef/shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly encryptionService = inject(EncryptionService);
  private readonly storageService = inject(StorageService);

  public setToken(token: string): void {
    return this.storageService.setItem(
      'gotbot-chef-tkn',
      this.encryptionService.encrypt(token)
    );
  }

  public getToken(): string | undefined {
    return this.storageService.getItem('gotbot-chef-tkn');
  }
}
