import { CostumeStat } from "../models/Entities.js";
import { DateFormatter, TextFormatter } from "../utils/Formatter.js";
import { BaseView } from "./BaseView.js";

type SortField = "rents" | "amount" | null;

export interface SubmittedPeriod {
  startDate: Date;
  endDate: Date;
}

export class StatisticOfCostumeFrm extends BaseView {
  private startDateText = "";
  private endDateText = "";
  private startDate: Date | null = null;
  private endDate: Date | null = null;
  private statistics: CostumeStat[] = [];
  private sortField: SortField = null;
  private hasSubmitted = false;
  private errorMessage = "";

  render(): HTMLElement {
    const rows = this.renderRows();
    this.renderWindow(
      "Statistic of Costume",
      `
        <main class="content">
          <form class="filter-form" id="statistic-form">
            <label class="filter-field">
              <span>Start date</span>
              <input class="text-field" name="startDate" type="text" placeholder="dd/mm/yyyy" value="${TextFormatter.escape(this.startDateText)}">
            </label>
            <label class="filter-field">
              <span>End date</span>
              <input class="text-field" name="endDate" type="text" placeholder="dd/mm/yyyy" value="${TextFormatter.escape(this.endDateText)}">
            </label>
            <button class="primary-button" type="submit">Submit</button>
          </form>
          <p class="filter-error" role="alert">${TextFormatter.escape(this.errorMessage)}</p>
          <div class="table-frame">
            <table class="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Model</th>
                  <th>Genre</th>
                  <th>Color</th>
                  <th>Price</th>
                  <th>
                    <button class="sort-button ${this.sortField === "rents" ? "active" : ""}" type="button" data-sort="rents">
                      Number of rents
                    </button>
                  </th>
                  <th>
                    <button class="sort-button ${this.sortField === "amount" ? "active" : ""}" type="button" data-sort="amount">
                      Total amount collected (VND)
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </main>
      `
    );
    this.bindEvents();
    return this.element;
  }

  getSubmittedPeriod(): SubmittedPeriod {
    if (!this.startDate || !this.endDate || !this.hasSubmitted) {
      throw new Error("Statistics period has not been submitted.");
    }
    return { startDate: this.startDate, endDate: this.endDate };
  }

  private renderRows(): string {
    if (this.statistics.length === 0) {
      const message = this.hasSubmitted ? "No costume statistics found in this period." : "";
      return `<tr class="empty-row"><td colspan="9">${message}</td></tr>`;
    }

    return this.statistics.map((costume, index) => `
      <tr data-selectable="true">
        <td>${index + 1}</td>
        <td>
          <button class="code-link" type="button" data-code="${TextFormatter.escape(costume.code)}">
            ${TextFormatter.escape(costume.code)}
          </button>
        </td>
        <td>${TextFormatter.escape(costume.name)}</td>
        <td>${TextFormatter.escape(costume.model)}</td>
        <td>${TextFormatter.escape(costume.genre)}</td>
        <td>${TextFormatter.escape(costume.color)}</td>
        <td>${TextFormatter.currency(costume.price)}</td>
        <td>${costume.numberOfRents}</td>
        <td>${TextFormatter.currency(costume.totalAmountCollected)}</td>
      </tr>
    `).join("");
  }

  private bindEvents(): void {
    this.requiredElement<HTMLFormElement>("#statistic-form").addEventListener(
      "submit",
      this.actionPerformed.bind(this)
    );
    this.element.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => {
      button.addEventListener("click", () => {
        const field = button.dataset.sort;
        if (field === "rents" || field === "amount") {
          this.sortStatistics(field);
        }
      });
    });
    this.element.querySelectorAll<HTMLButtonElement>("[data-code]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.code) {
          this.openListBill(button.dataset.code);
        }
      });
    });
  }

  private actionPerformed(event: SubmitEvent): void {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }

    const form = new FormData(event.currentTarget);
    this.startDateText = String(form.get("startDate")).trim();
    this.endDateText = String(form.get("endDate")).trim();
    this.startDate = DateFormatter.parseDisplayDate(this.startDateText);
    this.endDate = DateFormatter.parseDisplayDate(this.endDateText);

    if (!this.startDate || !this.endDate) {
      this.errorMessage = "Please enter start date and end date in dd/mm/yyyy format";
      this.refresh();
      return;
    }

    if (!this.application.costumeStatDAO.checkDate(this.startDate, this.endDate)) {
      this.errorMessage = "Invalid date entered, please re-enter";
      this.refresh();
      return;
    }

    this.errorMessage = "";
    this.sortField = null;
    this.hasSubmitted = true;
    this.statistics = this.application.costumeStatDAO.getCostumeStat(
      this.startDate,
      this.endDate
    );
    this.refresh();
  }

  private sortStatistics(field: Exclude<SortField, null>): void {
    if (!this.hasSubmitted) {
      return;
    }
    this.sortField = field;
    this.statistics = field === "rents"
      ? this.application.costumeStatDAO.sortNumberOfRents(this.statistics)
      : this.application.costumeStatDAO.sortTotalAmount(this.statistics);
    this.refresh();
  }

  private openListBill(code: string): void {
    const selectedCostume = this.statistics.find((costume) => costume.code === code);
    if (selectedCostume) {
      this.application.showListBill(selectedCostume, this);
    }
  }

  private refresh(): void {
    this.application.render(this);
  }
}
