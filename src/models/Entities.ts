export class Entity {
  constructor(public readonly id: number) {}
}

export class User extends Entity {
  constructor(
    id: number,
    public account: string,
    public password: string,
    public role: string,
    public name: string
  ) {
    super(id);
  }
}

export class Costume extends Entity {
  constructor(
    id: number,
    public code: string,
    public name: string,
    public model: string,
    public genre: string,
    public color: string,
    public price: number
  ) {
    super(id);
  }
}

export class CostumeStat extends Costume {
  constructor(
    costume: Costume,
    public numberOfRents: number,
    public totalAmountCollected: number
  ) {
    super(
      costume.id,
      costume.code,
      costume.name,
      costume.model,
      costume.genre,
      costume.color,
      costume.price
    );
  }
}

export class Customer extends Entity {
  constructor(
    id: number,
    public name: string,
    public address: string,
    public telephone: string,
    public email: string,
    public identityCardNumber: string
  ) {
    super(id);
  }
}

export class Collateral extends Entity {
  constructor(
    id: number,
    public conditionOfCostume: string,
    public deposit: number,
    public note = ""
  ) {
    super(id);
  }
}

export class Condition extends Entity {
  constructor(
    id: number,
    public conditionOfCostume: string,
    public compensationFee: number,
    public note = ""
  ) {
    super(id);
  }
}

export class Renting extends Entity {
  public readonly rentedCostumes: RentedCostume[] = [];

  constructor(
    id: number,
    public rentalDay: Date,
    public note: string,
    public user: User,
    public customer: Customer,
    public collateral: Collateral
  ) {
    super(id);
  }

  addRentedCostume(rentedCostume: RentedCostume): void {
    this.rentedCostumes.push(rentedCostume);
  }

  totalAmount(): number {
    return this.rentedCostumes.reduce(
      (total, rentedCostume) => total + rentedCostume.totalAmount(),
      0
    );
  }
}

export class RentedCostume extends Entity {
  public returnCostume: ReturnCostume | null = null;

  constructor(
    id: number,
    public price: number,
    public amount: number,
    public costume: Costume,
    public renting: Renting
  ) {
    super(id);
  }

  totalAmount(): number {
    return this.price * this.amount;
  }

  attachReturnCostume(returnCostume: ReturnCostume): void {
    this.returnCostume = returnCostume;
  }
}

export class ReturnCostume extends Entity {
  constructor(
    id: number,
    public price: number,
    public amount: number,
    public deposit: number,
    public rentedCostume: RentedCostume
  ) {
    super(id);
  }
}

export class Returning extends Entity {
  constructor(
    id: number,
    public returnDay: Date,
    public note: string,
    public user: User,
    public customer: Customer,
    public condition: Condition,
    public returnCostume: ReturnCostume
  ) {
    super(id);
  }
}

export class Bill extends Entity {
  constructor(
    id: number,
    public user: User,
    public customer: Customer,
    public renting: Renting,
    public returning: Returning
  ) {
    super(id);
  }

  get nameOfBorrower(): string {
    return this.customer.name;
  }

  get borrowedDateTime(): Date {
    return this.renting.rentalDay;
  }

  get paymentDateTime(): Date {
    return this.returning.returnDay;
  }

  get totalAmount(): number {
    return this.renting.totalAmount();
  }

  containsCostume(code: string): boolean {
    return this.renting.rentedCostumes.some(
      (rentedCostume) => rentedCostume.costume.code === code
    );
  }
}
