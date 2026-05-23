import { User } from "../models/Entities.js";

export class UserDAO {
  constructor(private readonly users: User[]) {}

  checkLogin(user: User): boolean {
    return this.users.some(
      (storedUser) => storedUser.account === user.account &&
        storedUser.password === user.password &&
        storedUser.role === "manager"
    );
  }

  getAuthenticatedManager(user: User): User | null {
    return this.users.find(
      (storedUser) => storedUser.account === user.account &&
        storedUser.password === user.password &&
        storedUser.role === "manager"
    ) ?? null;
  }
}
