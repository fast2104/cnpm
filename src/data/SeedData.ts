import {
  Bill,
  Collateral,
  Condition,
  Costume,
  Customer,
  Entity,
  RentedCostume,
  Renting,
  ReturnCostume,
  Returning,
  User
} from "../models/Entities.js";
import { DateFormatter } from "../utils/Formatter.js";

export interface CostumeRentalData {
  users: User[];
  costumes: Costume[];
  customers: Customer[];
  collaterals: Collateral[];
  conditions: Condition[];
  rentings: Renting[];
  returnings: Returning[];
  bills: Bill[];
}

type ConditionRow = [condition: string, compensationFee: number, note: string];
type RentingRow = [rentalDate: string, customerId: number, costumeId: number];

export class SeedData {
  static create(): CostumeRentalData {
    const users = SeedData.createUsers();
    const costumes = SeedData.createCostumes();
    const customers = SeedData.createCustomers();
    const collaterals = SeedData.createCollaterals();
    const conditions = SeedData.createConditions();
    const manager = SeedData.findById(users, 1);
    const rentings = SeedData.createRentings(manager, costumes, customers, collaterals);
    const returnings = SeedData.createReturnings(manager, rentings, customers, conditions);
    const bills = SeedData.createBills(manager, rentings, returnings);

    return {
      users,
      costumes,
      customers,
      collaterals,
      conditions,
      rentings,
      returnings,
      bills
    };
  }

  private static createUsers(): User[] {
    return [
      new User(1, "Storemanager", "manager", "manager", "Store Manager"),
      new User(2, "Admin", "admin", "admin", "Administrative Manager"),
      new User(3, "Salesagent", "saleagent", "sale", "Sales Agent"),
      new User(4, "Accountstaff", "accountstaff", "staff", "Account Staff"),
      new User(5, "Warehousemanager", "warehousemanager", "warehouse", "Warehouse Manager")
    ];
  }

  private static createCostumes(): Costume[] {
    return [
      new Costume(1, "AD001", "Ao Dai", "AD-2023", "Traditional", "White", 300000),
      new Costume(2, "VD002", "Evening Gown", "VD-2024", "Modern", "Red", 500000),
      new Costume(3, "AV003", "Suit", "AV-2022", "Office", "Black", 320000)
    ];
  }

  private static createCustomers(): Customer[] {
    return [
      new Customer(1, "Nguyen Dieu Anh", "Thuy Khue, Ha Noi", "0834022701", "dieuanhnguyen@gmail.com", "0012042701"),
      new Customer(2, "Trinh Hoang Anh", "Hoang Mai, Ha Noi", "0838020112", "hoanganhtrinh@gmail.com", "0012080112"),
      new Customer(3, "Nguyen Ha Anh", "O Cho Dua, Ha Noi", "0834022506", "haanhnguyen@gmail.com", "0012042506"),
      new Customer(4, "Tran Anh Dung", "To Huu, Ha Noi", "0337588200", "dungtrananh@gmail.com", "0012043009"),
      new Customer(5, "Nguyen Viet Tu", "Ba Dinh, Ha Noi", "0337588201", "tunguyenviet@gmail.com", "0012041204"),
      new Customer(6, "Do Hai Long", "Hoang Mai, Ha Noi", "0337588202", "longdohai@gmail.com", "0012041205"),
      new Customer(7, "Do Tien Anh", "Hai Ba Trung, Ha Noi", "0337588203", "tienanhdo@gmail.com", "0012041206"),
      new Customer(8, "Dang Tran Tien", "Cau Giay, Ha Noi", "0337588204", "tiendangtran@gmail.com", "0012041207"),
      new Customer(9, "Do Thuy Anh", "Tay Ho, Ha Noi", "0337588205", "thuyanhdo@gmail.com", "0012041208"),
      new Customer(10, "Tran Binh An", "Giai Phong, Ha Noi", "0337588206", "antranbinh@gmail.com", "0012041209"),
      new Customer(11, "Pham Thi Ngoc", "Kim Ma, Ha Noi", "0337588207", "ngocphamthi@gmail.com", "0012041210"),
      new Customer(12, "Nguyen Ngoc Linh", "Co Nhue, Ha Noi", "0337588208", "linhnguyenngoc@gmail.com", "0012041211")
    ];
  }

  private static createCollaterals(): Collateral[] {
    const deposits = [400000, 400000, 400000, 400000, 500000, 500000, 500000, 300000, 300000, 300000, 300000, 300000];
    return deposits.map((deposit, index) => new Collateral(index + 1, "Tot", deposit));
  }

  private static createConditions(): Condition[] {
    const rows: ConditionRow[] = [
      ["Tot", 0, ""],
      ["Binh thuong", 0, ""],
      ["Binh thuong", 0, ""],
      ["Bung chi", 0, ""],
      ["Dinh ban", 0, ""],
      ["Binh thuong", 0, ""],
      ["Binh thuong", 0, ""],
      ["Tot", 0, ""],
      ["Binh thuong", 0, ""],
      ["Rach nhe", 200000, "Den bu 200,000"],
      ["Binh thuong", 0, ""],
      ["Dinh ban", 0, ""]
    ];
    return rows.map(
      (row, index) => new Condition(index + 1, row[0], row[1], row[2])
    );
  }

  private static createRentings(
    manager: User,
    costumes: Costume[],
    customers: Customer[],
    collaterals: Collateral[]
  ): Renting[] {
    const rows: RentingRow[] = [
      ["01-01-2024 18:25", 9, 2],
      ["12-02-2024 13:20", 10, 2],
      ["06-04-2024 06:40", 11, 2],
      ["29-09-2024 12:15", 12, 2],
      ["01-10-2024 14:00", 2, 1],
      ["25-10-2024 16:15", 3, 1],
      ["27-10-2024 10:30", 1, 1],
      ["23-11-2024 08:30", 4, 3],
      ["26-11-2024 08:35", 5, 3],
      ["01-12-2024 10:20", 6, 3],
      ["09-12-2024 13:50", 7, 3],
      ["20-12-2024 14:00", 8, 3]
    ];

    return rows.map((row, index) => {
      const costume = SeedData.findById(costumes, row[2]);
      const renting = new Renting(
        index + 1,
        SeedData.requiredDateTime(row[0]),
        "",
        manager,
        SeedData.findById(customers, row[1]),
        SeedData.requiredItem(collaterals, index)
      );
      renting.addRentedCostume(
        new RentedCostume(index + 1, costume.price, 1, costume, renting)
      );
      return renting;
    });
  }

  private static createReturnings(
    manager: User,
    rentings: Renting[],
    customers: Customer[],
    conditions: Condition[]
  ): Returning[] {
    const dates = [
      "02-01-2024 20:25",
      "13-02-2024 13:00",
      "07-04-2024 08:20",
      "30-09-2024 12:30",
      "02-10-2024 10:30",
      "26-10-2025 12:00",
      "28-10-2024 09:45",
      "24-11-2024 10:00",
      "27-11-2024 10:35",
      "02-12-2024 10:50",
      "10-12-2024 12:50",
      "21-12-2024 17:00"
    ];

    return dates.map((date, index) => {
      const renting = SeedData.requiredItem(rentings, index);
      const rentedCostume = SeedData.requiredItem(renting.rentedCostumes, 0);
      const condition = SeedData.requiredItem(conditions, index);
      const returnCostume = new ReturnCostume(
        index + 1,
        rentedCostume.price,
        rentedCostume.amount,
        renting.collateral.deposit,
        rentedCostume
      );
      rentedCostume.attachReturnCostume(returnCostume);
      return new Returning(
        index + 1,
        SeedData.requiredDateTime(date),
        condition.note,
        manager,
        SeedData.findById(customers, renting.customer.id),
        condition,
        returnCostume
      );
    });
  }

  private static createBills(manager: User, rentings: Renting[], returnings: Returning[]): Bill[] {
    return rentings.map(
      (renting, index) => new Bill(
        index + 1,
        manager,
        renting.customer,
        renting,
        SeedData.requiredItem(returnings, index)
      )
    );
  }

  private static findById<T extends Entity>(entities: T[], id: number): T {
    const entity = entities.find((item) => item.id === id);
    if (!entity) {
      throw new Error(`Missing seeded entity with id ${id}`);
    }
    return entity;
  }

  private static requiredItem<T>(items: T[], index: number): T {
    const item = items[index];
    if (!item) {
      throw new Error(`Missing seeded item at index ${index}`);
    }
    return item;
  }

  private static requiredDateTime(value: string): Date {
    const date = DateFormatter.parseDatabaseDateTime(value);
    if (!date) {
      throw new Error(`Invalid seeded date: ${value}`);
    }
    return date;
  }
}
