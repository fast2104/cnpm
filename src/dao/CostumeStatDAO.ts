import { Costume, CostumeStat, Renting } from "../models/Entities.js";
import { DateFormatter } from "../utils/Formatter.js";

interface AggregatedStatistic {
  costume: Costume;
  numberOfRents: number;
  totalAmountCollected: number;
}

export class CostumeStatDAO {
  constructor(private readonly rentings: Renting[]) {}

  checkDate(startDate: Date | null, endDate: Date | null): boolean {
    return startDate instanceof Date &&
      endDate instanceof Date &&
      startDate <= endDate;
  }

  getCostumeStat(startDate: Date, endDate: Date): CostumeStat[] {
    if (!this.checkDate(startDate, endDate)) {
      throw new Error("Invalid date entered, please re-enter");
    }

    const statistics = new Map<string, AggregatedStatistic>();
    this.rentings
      .filter((renting) => DateFormatter.isWithin(renting.rentalDay, startDate, endDate))
      .forEach((renting) => {
        renting.rentedCostumes.forEach((rentedCostume) => {
          const existing = statistics.get(rentedCostume.costume.code) ?? {
            costume: rentedCostume.costume,
            numberOfRents: 0,
            totalAmountCollected: 0
          };
          existing.numberOfRents += rentedCostume.amount;
          existing.totalAmountCollected += rentedCostume.totalAmount();
          statistics.set(existing.costume.code, existing);
        });
      });

    return Array.from(statistics.values())
      .map(
        (item) => new CostumeStat(
          item.costume,
          item.numberOfRents,
          item.totalAmountCollected
        )
      )
      .sort((left, right) => left.id - right.id);
  }

  sortNumberOfRents(statistics: CostumeStat[]): CostumeStat[] {
    return [...statistics].sort(
      (left, right) => right.numberOfRents - left.numberOfRents
    );
  }

  sortTotalAmount(statistics: CostumeStat[]): CostumeStat[] {
    return [...statistics].sort(
      (left, right) => right.totalAmountCollected - left.totalAmountCollected
    );
  }
}
