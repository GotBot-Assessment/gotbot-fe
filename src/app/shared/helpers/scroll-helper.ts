/**
 * This TypeScript function scrolls an element into view smoothly.
 * @param {Element} el - Element - This is the element that needs to be scrolled into view. It is of
 * type Element, which represents an HTML element in the DOM.
 */
export function scrollTo(el: Element): void {
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * This function scrolls to the first invalid input, textarea, select, or other form control element on
 * the page.
 */
export function scrollToError(): void {
   const elem = document.querySelector(
    `input.invalid,
        textarea.invalid,
        select.invalid,
        input.ng-invalid,
        textarea.ng-invalid,
        select.ng-invalid,
        .form-control.ng-invalid
        ngx-intl-tel-input.ng-invalid,
        .ng-select.ng-invalid,
        .has-errors`
  );
  if (elem) {
    scrollTo(elem);
  }
}

/**
 * This TypeScript function scrolls to an element selected by a given CSS selector.
 * @param {string} selector - A string representing a CSS selector that identifies the element to which
 * the page should be scrolled.
 */
export function scrollToSelector(selector: string): void {
  const elem = document.querySelector(selector);
  if (elem) {
    scrollTo(elem);
  }
}
