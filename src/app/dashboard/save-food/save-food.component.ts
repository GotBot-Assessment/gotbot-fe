import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'gotbot-chef-save-food',
  standalone: true,
  imports: [],
  templateUrl: './save-food.component.html',
})
export class SaveFoodComponent {
  public readonly modalRef = inject(BsModalRef<SaveFoodComponent>);
  public readonly foodForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    area: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    file: new FormControl(null, Validators.required),
    ingredients: new FormArray([], Validators.required)
  });
}
