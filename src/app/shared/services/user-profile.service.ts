import { inject, Injectable } from '@angular/core';
import { UserModel } from '@gotbot-chef/shared/models/user.model';
import { EncryptionService } from '@gotbot-chef/shared/services/encryption.service';
import { StorageService } from '@gotbot-chef/shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly encryptionService = inject(EncryptionService);
  private readonly storageService = inject(StorageService);

  public setUser(user: UserModel): void {
    return this.storageService.setItem(
      'gotbot-chef-userx',
      this.encryptionService.encrypt(
        JSON.stringify(user)
      )
    );
  }

  public getUser(): UserModel | undefined {
    return this.storageService.getItem<UserModel>('gotbot-chef-userx');
  }
}
