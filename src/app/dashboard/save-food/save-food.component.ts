import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gotbot-chef-save-food',
  standalone: true,
  imports: [],
  templateUrl: './save-food.component.html',
  styles: ''
})
export class SaveFoodComponent {
  public readonly foodForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    area: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    file: new FormControl(null, Validators.required),
    ingredients: new FormArray([])
  });
}
