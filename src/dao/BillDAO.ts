import { Bill } from "../models/Entities.js";
import { DateFormatter } from "../utils/Formatter.js";

export class BillDAO {
  constructor(private readonly bills: Bill[]) {}

  getListBill(code: string, startDate: Date, endDate: Date): Bill[] {
    return this.bills.filter(
      (bill) => bill.containsCostume(code) &&
        DateFormatter.isWithin(bill.borrowedDateTime, startDate, endDate)
    );
  }

  getBill(id: number): Bill | null {
    return this.bills.find((bill) => bill.id === id) ?? null;
  }
}
