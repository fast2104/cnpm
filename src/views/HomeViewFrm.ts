import { BaseView } from "./BaseView.js";

export class HomeViewFrm extends BaseView {
  render(): HTMLElement {
    this.renderWindow(
      "Home",
      `
        <div class="home-body">
          <button class="primary-button home-button" id="statistics-button" type="button">
            Statistics of costumes
          </button>
        </div>
      `
    );
    this.requiredElement<HTMLButtonElement>("#statistics-button").addEventListener(
      "click",
      this.actionPerformed.bind(this)
    );
    return this.element;
  }

  private actionPerformed(): void {
    this.application.showStatisticOfCostume();
  }
}
