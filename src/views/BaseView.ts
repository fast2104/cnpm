import type { CostumeRentalApplication } from "../Application.js";

export abstract class BaseView {
  protected readonly element: HTMLElement;

  constructor(protected readonly application: CostumeRentalApplication) {
    this.element = document.createElement("section");
  }

  abstract render(): HTMLElement;

  protected renderWindow(title: string, content: string): void {
    this.element.className = "application-window";
    this.element.innerHTML = `
      <header class="window-header">
        <span>${title}</span>
      </header>
      ${content}
    `;
  }

  protected requiredElement<T extends Element>(selector: string): T {
    const element = this.element.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Required element was not rendered: ${selector}`);
    }
    return element;
  }
}
