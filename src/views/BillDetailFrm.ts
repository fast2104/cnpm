import type { CostumeRentalApplication } from "../Application.js";
import { Bill, RentedCostume } from "../models/Entities.js";
import { DateFormatter, TextFormatter } from "../utils/Formatter.js";
import { BaseView } from "./BaseView.js";

export class BillDetailFrm extends BaseView {
  constructor(application: CostumeRentalApplication, private readonly bill: Bill) {
    super(application);
  }

  render(): HTMLElement {
    const bill = this.bill;
    const rentedCostume = this.getRentedCostume();
    this.renderWindow(
      "Bill",
      `
        <main class="content">
          <div class="table-frame">
            <table class="data-table detail-table">
              <thead>
                <tr>
                  <th>Name of borrower</th>
                  <th>Tel</th>
                  <th>Address</th>
                  <th>Borrowed date and time</th>
                  <th>Payment date and time</th>
                  <th>Amount</th>
                  <th>Total amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${TextFormatter.escape(bill.customer.name)}</td>
                  <td>${TextFormatter.escape(bill.customer.telephone)}</td>
                  <td>${TextFormatter.escape(bill.customer.address)}</td>
                  <td>${DateFormatter.displayDateTime(bill.borrowedDateTime)}</td>
                  <td>${DateFormatter.displayDateTime(bill.paymentDateTime)}</td>
                  <td>${rentedCostume.amount}</td>
                  <td>${TextFormatter.currency(bill.totalAmount)}</td>
                  <td>${TextFormatter.escape(bill.returning.note)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      `
    );
    return this.element;
  }

  private getRentedCostume(): RentedCostume {
    const rentedCostume = this.bill.renting.rentedCostumes[0];
    if (!rentedCostume) {
      throw new Error("Bill has no rented costume.");
    }
    return rentedCostume;
  }
}
