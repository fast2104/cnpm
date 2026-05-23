import { BillDAO } from "./dao/BillDAO.js";
import { CostumeStatDAO } from "./dao/CostumeStatDAO.js";
import { UserDAO } from "./dao/UserDAO.js";
import { SeedData, type CostumeRentalData } from "./data/SeedData.js";
import { CostumeStat, User } from "./models/Entities.js";
import { BillDetailFrm } from "./views/BillDetailFrm.js";
import type { BaseView } from "./views/BaseView.js";
import { HomeViewFrm } from "./views/HomeViewFrm.js";
import { ListBillFrm } from "./views/ListBillFrm.js";
import { LoginFrm } from "./views/LoginFrm.js";
import { StatisticOfCostumeFrm } from "./views/StatisticOfCostumeFrm.js";

export class CostumeRentalApplication {
  readonly userDAO: UserDAO;
  readonly costumeStatDAO: CostumeStatDAO;
  readonly billDAO: BillDAO;
  private currentUser: User | null = null;
  private currentView: BaseView | null = null;

  constructor(
    private readonly rootElement: HTMLElement,
    data: CostumeRentalData = SeedData.create()
  ) {
    this.userDAO = new UserDAO(data.users);
    this.costumeStatDAO = new CostumeStatDAO(data.rentings);
    this.billDAO = new BillDAO(data.bills);
  }

  start(): void {
    this.render(new LoginFrm(this));
  }

  login(enteredUser: User): boolean {
    if (!this.userDAO.checkLogin(enteredUser)) {
      return false;
    }
    this.currentUser = this.userDAO.getAuthenticatedManager(enteredUser);
    return true;
  }

  showHomeView(): void {
    this.render(new HomeViewFrm(this));
  }

  showStatisticOfCostume(): void {
    this.render(new StatisticOfCostumeFrm(this));
  }

  showListBill(costume: CostumeStat, statisticView: StatisticOfCostumeFrm): void {
    this.render(new ListBillFrm(this, costume, statisticView));
  }

  showBillDetail(billId: number): void {
    const bill = this.billDAO.getBill(billId);
    if (bill) {
      this.render(new BillDetailFrm(this, bill));
    }
  }

  render(view: BaseView): void {
    this.currentView = view;
    this.rootElement.replaceChildren(view.render());
  }
}
