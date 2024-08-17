import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingStateDirective } from '@gotbot-chef/shared/drirectives/loading-state.directive';
import { scrollToError } from '@gotbot-chef/shared/helpers/scroll-helper';
import { validateAllFormFields } from '@gotbot-chef/shared/helpers/validators';
import { ToFormGroupPipe } from '@gotbot-chef/shared/pipes/to-form-group.pipe';
import { FormInputComponent } from '@gotbot-chef/shared/ui/form-input/form-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'gotbot-chef-save-food',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ToFormGroupPipe,
    LoadingStateDirective
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
    ingredients: new FormArray([
      this.newIngredientForm()
    ], Validators.required)
  });
  public readonly categories = [
    'Seafood',
    'Side',
    'Vegetarian',
    'Pork',
    'Pasta',
    'Dessert',
    'Beef'
  ].map(name => ({ name }));

  public get ingredients(): FormArray {
    return this.foodForm.controls.ingredients;
  }

  public removeIngredient(index: number): void {
    return this.ingredients.removeAt(index);
  }

  public addNewIngredient(): void {
    return this.ingredients.push(this.newIngredientForm());
  }

  public saveFood(): void {
    if (this.foodForm.invalid) {
      validateAllFormFields(this.foodForm);

      return scrollToError();
    }
  }

  private newIngredientForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required)
    });
  }
}
