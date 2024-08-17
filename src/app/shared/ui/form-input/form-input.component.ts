import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  OnInit,
  output,
  signal
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { LoadingStateDirective } from '@gotbot-chef/shared/drirectives/loading-state.directive';
import { ShouldShowErrorPipe } from '@gotbot-chef/shared/pipes/should-show-error.pipe';
import { ValidationErrorsService } from '@gotbot-chef/shared/services/validation-errors.service';
import { InputType } from '@gotbot-chef/shared/ui/form-input/input-type.enum';
import moment from 'moment';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'gotbot-chef-form-input',
  standalone: true,
  styles: ':host {display: block;} .error {border-color: red;}',
  imports: [
    ReactiveFormsModule,
    LoadingStateDirective,
    ShouldShowErrorPipe,
    NgMultiSelectDropDownModule,
    BsDatepickerModule
  ],
  templateUrl: './form-input.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class FormInputComponent extends HasObservablesDirective implements OnInit {
  /**
   * The event that gets fired when one selects a file(s) on the file selector.
   */
  public readonly filesChange = output<File[]>();

  /**
   * The optional form control to use if this form input isn't used in a form group
   */
  public readonly formControl = input<FormControl>();

  /**
   * Confugure the input to be vertical or horizontal.
   * Default is vertical.
   */
  public readonly orientation = input<'vertical' | 'horizontal'>('vertical');

  /**
   * The text to be used for the label.
   * When it is not set the label is removed from the view.
   * (Optional)
   */
  public readonly label = input<string>();

  /**
   * Bootstrap distribution of the label column size.
   */
  public readonly labelSize = input(2, { transform: numberAttribute });

  /**
   * The text used for appending text to a label.
   * It uses the `small` tag.
   * (Optional)
   */
  public readonly subLabel = input<string>();

  /**
   * If the control is to have an icon it is set here.
   * Ideally put bootstrap icons.
   */
  public readonly icon = input<string>();

  /**
   * The name used in the reactive form group so it can be passed down to the input.
   */
  public readonly controlName = input<string>('overrideControlName');

  /**
   * When using `select` type with an array of objects for options you need to set this, so it is displayed in the dropdown.
   * This value has to be a key on your singular object.
   *
   * Default is `name`
   */
  public readonly bindLabel = input<string>('name');

  /**
   * When using `select` type with an array of objects for options you need to set this so it can be set as the dropdown value.
   * This has to be a key on your singular object.
   *
   * Default is `name`
   */
  public readonly bindValue = input<string>('name');

  /**
   * The placeholder to be used on the control.
   */
  public readonly placeholder = input<string | null>();

  /**
   * When type is set to `select` this allows for multiple values.
   * One can now select more that one value from the dropdown when set to `true`
   *
   * Default is `false`
   */
  public readonly multiple = input(false, { transform: booleanAttribute });

  /**
   * When type is set to `number` or `range` this marks the minimum number that can be entered.
   *
   * Default is 0
   */
  public readonly minNumber = input(0, { transform: numberAttribute });

  /**
   * When type is set to `number` or `range` this marks the maximum number that can be entered.
   *
   * Default is 1000000
   */
  public readonly maxNumber = input(1000000, { transform: numberAttribute });

  /**
   * When type is `number` this sets the steps in which the number select increase or decrease.
   *
   * Default is 1
   */
  public readonly step = input(1, { transform: numberAttribute });

  /**
   * This determines how many rows a text area will be.
   * Works when type is set to `textarea`
   *
   * Default number of rows is 3.
   */
  public readonly rows = input(3, { transform: numberAttribute });

  /**
   * The label used by the loadingState directive.
   *
   * Default it `processing`
   */
  public readonly loadingStateAlias = input('processing');

  /**
   * The class name for the form control.
   * They have to b CSS classes.
   *
   * Default is `form-control`
   */
  public readonly formControlClass = input('form-control');

  /**
   * When you use a form with form validations eg. a formGroup that validates password and confirmPassword.
   * This is an array of errors for this given control that you will want shown when the parent form is invalid.
   * Ideally the errors from the parent form should be related to this control.
   *
   * Default is an empty array.
   */
  public readonly parentFormErrorKeys = input<string[]>([]);

  /**
   * When type is set to `select` you need to set this such that the dropdown has values on it.
   * The options can be an array of strings or an array of objects.
   *
   * When object are used remind yourself to set the `bindLabel` and the `bindValue`
   */
  public readonly selectOptions = input<Record<string, unknown>[]>([]);

  /**
   * Sets the input type for this control.
   *
   * Default is a `text`
   */
  public readonly type = input(InputType.TEXT, { transform: (value: string): InputType => value as InputType });

  /**
   * If you wish to change the form group owning this control provide the parent form group you prefer for this control.
   *
   * (Optional)
   */
  public readonly parentForm = input<UntypedFormGroup | FormGroup>();

  /**
   * Set override error messages for this control.
   * Its an object with error key as key and error value as the text to display.
   */
  public readonly validationErrors = input<Record<string, string>>({});

  /**
   * The list of acceptable types when using a file upload control.
   */
  public readonly acceptTypes = input('image/jpeg,image/gif,image/png,application/pdf,image/x-eps');

  /**
   * The additional/override for using ng-multiple-dropdown control.
   */
  public readonly dropdownSettings = input<IDropdownSettings>({});

  /**
   * Sets the minimum date that can be picked from a date picker component.
   * Works when type is `date`
   *
   * Default is 100 years before now.
   */
  public readonly minDate = input(moment().subtract(100, 'years').toDate());

  /**
   * Sets the maximum date that one can select on a date picker.
   * Works when type is `date`
   *
   * Default is 100 years from now.
   */
  public readonly maxDate = input(moment().add(100, 'years').toDate());

  /**
   * When type is set to `date` you can override the default datepicker options with this property.
   */
  public readonly calenderConfig = input(getCalenderConfig());

  /**
   * When using the type file this holds the current selected files.
   */
  public readonly selectedFiles = signal<File[]>([]);

  public readonly serverErrors = signal<string[]>([]);

  /**
   * Calculates the lable classes based on the input direction.
   */
  public readonly labelClasses = computed(() => {
    if (this.orientation() === 'vertical') {
      return 'form-label';
    }

    return `col-sm-${ this.labelSize() } col-form-label`;
  });
  public readonly manuallyErrorKeys = [
    'required',
    'pattern',
    'max',
    'min',
    'minlength',
    'maxlength'
  ];
  protected readonly parentContainer = inject(ControlContainer);
  protected readonly validationErrorsService = inject(ValidationErrorsService);

  /**
   * The function returns the parent form group or container as an untyped form group.
   * @returns The method is returning either the value of `this.parentForm` or
   * `this.parentContainer.control` casted as an `UntypedFormGroup`.
   */
  public get parentFormGroup(): UntypedFormGroup {
    return this.parentForm() || this.parentContainer.control as UntypedFormGroup;
  }

  /**
   * Checks if this control has a `required` validation rule
   */
  public get isRequired(): boolean {
    if (!this.control) {
      return false;
    }

    return this.control.hasValidator(Validators.required);
  }

  public get control(): FormControl {
    return this.formControl()
      || (this.parentForm() || this.parentFormGroup).controls[this.controlName()] as FormControl | UntypedFormControl;
  }

  public get controlErrorKeys(): string[] {
    // @ts-expect-error This is okay.
    if (!this.control && !this.control.errors) {
      return [];
    }

    if (!this.control.touched) {
      return [];
    }

    return Object.keys(this.control.errors || {});
  }

  public get fileNames(): string {
    return Array.from(this.selectedFiles()).map(file => file.name).join(', ');
  }

  public get multiSelectDropdownSettings(): IDropdownSettings {
    return {
      singleSelection: !this.multiple(),
      idField: this.bindValue(),
      textField: this.bindLabel(),
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      ...this.dropdownSettings()
    };
  }

  public isErrorString(error: unknown): boolean {
    return typeof error === 'string';
  }

  public onFilesChanged(event: Event): void {
    if (this.type() === InputType.FILE) {
      //@ts-expect-error This is alright.
      this.selectedFiles.set(event.target?.files);
      //@ts-expect-error This is alright.
      this.filesChange.emit(event?.target?.files);
    }
  }

  public ngOnInit(): void {
    this.validationErrorsService.onErrors()
      .pipe(
        map(res => res[this.controlName()]),
        takeUntil(this.destroy$)
      ).subscribe(res => this.serverErrors.set(res));

    //Remove error message when control changes its values.
    this.control?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.validationErrorsService.removeError(this.controlName()));
  }
}

export const getCalenderConfig = (): Partial<BsDatepickerConfig> => ({
  isAnimated: true,
  adaptivePosition: true,
  containerClass: 'theme-green',
  dateInputFormat: 'DD-MM-YYYY'
});
