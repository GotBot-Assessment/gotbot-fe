import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputComponent } from '@gotbot-chef/shared/ui/form-input/form-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'gotbot-chef-save-food',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent
  ],
  templateUrl: './save-food.component.html'
})
export class SaveFoodComponent {
  public readonly modalRef = inject(BsModalRef<SaveFoodComponent>);
  public readonly foodForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    area: new FormControl(null),
    price: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    image: new FormControl(null, Validators.required),
    ingredients: new FormArray([], Validators.required)
  });
  public readonly categories = [
    'Starter',
    'Main',
    'Dessert'
  ].map(name => ({ name }));
}
