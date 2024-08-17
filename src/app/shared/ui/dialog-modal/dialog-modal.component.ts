import { Component, inject, TemplateRef } from '@angular/core';
import { DialogActionBtnOptions } from '@gotbot-chef/shared/services/ui/dialog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'gotbot-chef-dialog-modal',
  standalone: true,
  imports: [],
  templateUrl: './dialog-modal.component.html',
})
export class DialogModalComponent {
  public title?: string;
  public icon?: string;
  public message?: string | string[];
  public messages?: string[];
  public content?: TemplateRef<unknown>;
  public actions?: DialogActionBtnOptions[];
  public showFooter = true;
  public modalRef = inject(BsModalRef<DialogModalComponent>);

  public isLoading = false;

  public get messageAsArray(): string[] {
    return (this.message ? (Array.isArray(this.message) ? this.message : [this.message]) : []) as string[];
  }

  public runAction(action: (ref: BsModalRef) => boolean): void {
    this.isLoading = true;
    const close = action(this.modalRef);
    this.isLoading = false;
    if (close) {
      this.modalRef.hide();
    }
  }
}
