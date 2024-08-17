import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingStateDirective } from '@gotbot-chef/shared/drirectives/loading-state.directive';
import { scrollToError } from '@gotbot-chef/shared/helpers/scroll-helper';
import { validateAllFormFields } from '@gotbot-chef/shared/helpers/validators';
import { MealModel } from '@gotbot-chef/shared/models/meal.model';
import { ToFormGroupPipe } from '@gotbot-chef/shared/pipes/to-form-group.pipe';
import { FormInputComponent } from '@gotbot-chef/shared/ui/form-input/form-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'gotbot-chef-save-meal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ToFormGroupPipe,
    LoadingStateDirective
  ],
  templateUrl: './save-meal.component.html'
})
export class SaveMealComponent {
  public readonly meal = signal<MealModel | undefined>(undefined);
  public onSaveMeal = console.log;
  public readonly modalRef = inject(BsModalRef<SaveMealComponent>);
  public readonly mealForm = new FormGroup({
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
  private readonly selectedFile = signal<File | undefined>(undefined);

  public constructor() {
    effect(() => this.preFillMealForm(this.meal()));
  }

  public get ingredients(): FormArray {
    return this.mealForm.controls.ingredients;
  }

  public removeIngredient(index: number): void {
    return this.ingredients.removeAt(index);
  }

  public addNewIngredient(): void {
    return this.ingredients.push(this.newIngredientForm());
  }

  public saveMeal(): void {
    if (this.mealForm.invalid) {
      validateAllFormFields(this.mealForm);

      return scrollToError();
    }

    return this.onSaveMeal({
      ...this.mealForm.getRawValue(),
      image: this.selectedFile()
    });
  }

  public onFileChanges(files: Array<File>): void {
    this.selectedFile.set(files[0]);
  }

  private newIngredientForm(data?: Partial<MealModel['ingredients'][0]>): FormGroup {
    return new FormGroup({
      id: new FormControl(data?.id),
      name: new FormControl(data?.name, Validators.required)
    });
  }

  private preFillMealForm(meal?: MealModel): void {
    if (meal) {
      delete meal.image;
      //@ts-expect-error This is alright.
      this.mealForm.patchValue(meal);
      if (this.ingredients.length) {
        this.ingredients.clear();

        meal.ingredients.forEach((ingredient) => {
          this.ingredients.push(this.newIngredientForm(ingredient));
        });
      }

      this.mealForm.controls.image.removeValidators(Validators.required);
      this.mealForm.controls.image.updateValueAndValidity();
    }
  }
}
