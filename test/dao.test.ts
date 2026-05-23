import assert from "node:assert/strict";
import test from "node:test";
import { BillDAO } from "../src/dao/BillDAO.js";
import { CostumeStatDAO } from "../src/dao/CostumeStatDAO.js";
import { UserDAO } from "../src/dao/UserDAO.js";
import { SeedData } from "../src/data/SeedData.js";
import { CostumeStat, User } from "../src/models/Entities.js";
import { DateFormatter } from "../src/utils/Formatter.js";

class DAOTestSuite {
  private readonly userDAO: UserDAO;
  private readonly costumeStatDAO: CostumeStatDAO;
  private readonly billDAO: BillDAO;
  private readonly yearStart: Date;
  private readonly yearEnd: Date;

  constructor() {
    const data = SeedData.create();
    this.userDAO = new UserDAO(data.users);
    this.costumeStatDAO = new CostumeStatDAO(data.rentings);
    this.billDAO = new BillDAO(data.bills);
    this.yearStart = this.requiredDate("01/01/2024");
    this.yearEnd = this.requiredDate("31/12/2024");
  }

  verifiesManagerLogin(): void {
    const valid = new User(0, "Storemanager", "manager", "manager", "");
    const invalid = new User(0, "Storemanager", "wrong", "manager", "");
    assert.equal(this.userDAO.checkLogin(valid), true);
    assert.equal(this.userDAO.checkLogin(invalid), false);
  }

  returnsReportStatistics(): void {
    const statistics = this.costumeStatDAO.getCostumeStat(this.yearStart, this.yearEnd);
    const byCode = new Map(statistics.map((statistic) => [statistic.code, statistic]));
    assert.equal(statistics.length, 3);
    assert.deepEqual(statistics.map((statistic) => statistic.code), ["AD001", "VD002", "AV003"]);
    assert.equal(this.requiredStatistic(byCode, "AD001").numberOfRents, 3);
    assert.equal(this.requiredStatistic(byCode, "AD001").totalAmountCollected, 900000);
    assert.equal(this.requiredStatistic(byCode, "VD002").numberOfRents, 4);
    assert.equal(this.requiredStatistic(byCode, "VD002").totalAmountCollected, 2000000);
    assert.equal(this.requiredStatistic(byCode, "AV003").numberOfRents, 5);
    assert.equal(this.requiredStatistic(byCode, "AV003").totalAmountCollected, 1600000);
  }

  sortsTheStatisticColumnsDescending(): void {
    const statistics = this.costumeStatDAO.getCostumeStat(this.yearStart, this.yearEnd);
    assert.deepEqual(
      this.costumeStatDAO.sortNumberOfRents(statistics).map((item) => item.code),
      ["AV003", "VD002", "AD001"]
    );
    assert.deepEqual(
      this.costumeStatDAO.sortTotalAmount(statistics).map((item) => item.code),
      ["VD002", "AV003", "AD001"]
    );
  }

  appliesInclusiveDateFiltering(): void {
    const oneDay = this.requiredDate("01/10/2024");
    const statistics = this.costumeStatDAO.getCostumeStat(oneDay, oneDay);
    assert.deepEqual(statistics.map((item) => item.code), ["AD001"]);
    assert.equal(this.requiredStatistic(new Map(statistics.map((item) => [item.code, item])), "AD001").numberOfRents, 1);
  }

  returnsBillsAndTheirCustomerDetails(): void {
    const bills = this.billDAO.getListBill("AD001", this.yearStart, this.yearEnd);
    assert.deepEqual(
      bills.map((bill) => bill.nameOfBorrower),
      ["Trinh Hoang Anh", "Nguyen Ha Anh", "Nguyen Dieu Anh"]
    );
    const detail = this.billDAO.getBill(7);
    assert.ok(detail);
    assert.equal(detail.customer.telephone, "0834022701");
    assert.equal(detail.customer.address, "Thuy Khue, Ha Noi");
    assert.equal(detail.totalAmount, 300000);
  }

  private requiredDate(value: string): Date {
    const date = DateFormatter.parseDisplayDate(value);
    if (!date) {
      throw new Error(`Invalid test date: ${value}`);
    }
    return date;
  }

  private requiredStatistic(statistics: Map<string, CostumeStat>, code: string): CostumeStat {
    const statistic = statistics.get(code);
    if (!statistic) {
      throw new Error(`Statistic was not found: ${code}`);
    }
    return statistic;
  }
}

test("UserDAO accepts only the report manager login", () => {
  new DAOTestSuite().verifiesManagerLogin();
});

test("CostumeStatDAO calculates report values from rental records", () => {
  new DAOTestSuite().returnsReportStatistics();
});

test("CostumeStatDAO sorts both requested columns descending", () => {
  new DAOTestSuite().sortsTheStatisticColumnsDescending();
});

test("CostumeStatDAO includes rentals on boundary dates", () => {
  new DAOTestSuite().appliesInclusiveDateFiltering();
});

test("BillDAO lists rented costume bills and exposes bill detail", () => {
  new DAOTestSuite().returnsBillsAndTheirCustomerDetails();
});
