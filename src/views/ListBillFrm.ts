import type { CostumeRentalApplication } from "../Application.js";
import { Bill, CostumeStat } from "../models/Entities.js";
import { DateFormatter, TextFormatter } from "../utils/Formatter.js";
import { BaseView } from "./BaseView.js";
import { StatisticOfCostumeFrm } from "./StatisticOfCostumeFrm.js";

export class ListBillFrm extends BaseView {
  private readonly bills: Bill[];

  constructor(
    application: CostumeRentalApplication,
    private readonly selectedCostume: CostumeStat,
    statisticView: StatisticOfCostumeFrm
  ) {
    super(application);
    const period = statisticView.getSubmittedPeriod();
    this.bills = application.billDAO.getListBill(
      selectedCostume.code,
      period.startDate,
      period.endDate
    );
  }

  render(): HTMLElement {
    const rows = this.bills.map((bill, index) => `
      <tr data-selectable="true">
        <td>${index + 1}</td>
        <td>
          <button class="code-link" type="button" data-bill-id="${bill.id}">
            ${TextFormatter.escape(bill.nameOfBorrower)}
          </button>
        </td>
        <td>${DateFormatter.displayDateTime(bill.borrowedDateTime)}</td>
        <td>${DateFormatter.displayDateTime(bill.paymentDateTime)}</td>
        <td>${TextFormatter.currency(bill.totalAmount)}</td>
      </tr>
    `).join("");

    this.renderWindow(
      "List Bills",
      `
        <main class="content">
          <div class="table-frame">
            <table class="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name of the borrower</th>
                  <th>Borrowed date and time</th>
                  <th>Payment date and time</th>
                  <th>Total amount (VND)</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </main>
      `
    );
    this.element.querySelectorAll<HTMLButtonElement>("[data-bill-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const billId = Number(button.dataset.billId);
        if (Number.isInteger(billId)) {
          this.application.showBillDetail(billId);
        }
      });
    });
    return this.element;
  }
}
