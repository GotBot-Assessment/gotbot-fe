import { Injectable, TemplateRef } from '@angular/core';
import { DialogModalComponent } from '@gotbot-chef/shared/ui/dialog-modal/dialog-modal.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

export interface DialogActionBtnOptions {
  text: string;
  action: (ref: BsModalRef) => boolean;
  class?: string | string[];
  template?: TemplateRef<unknown>
}

export interface DialogOptions {
  // Use:
  icon?: string;
  title?: string;
  message?: string | string[];
  messages?: string[];
  actions?: DialogActionBtnOptions[];
  // OR
  template?: TemplateRef<unknown>;
  content?: TemplateRef<unknown>;
  options?: ModalOptions;
}

@Injectable({
  providedIn: 'root'
})

export class DialogService extends BsModalService {

  public open(options: DialogOptions, showFooter?: boolean): BsModalRef {

    const component = options.template ? options.template : DialogModalComponent;
    const modalOptions: ModalOptions = {
      ...options.options
      // additional defaults
    };

    const modalRef: BsModalRef = this.show(component, modalOptions);
    modalRef.content.modalRef = modalRef;

    modalRef.content.icon = options.icon;
    modalRef.content.title = options.title;
    modalRef.content.message = options.message;
    modalRef.content.messages = options.messages;
    modalRef.content.content = options.content;
    modalRef.content.actions = options.actions;
    modalRef.content.showFooter = showFooter ?? true;

    return modalRef;
  }
}
