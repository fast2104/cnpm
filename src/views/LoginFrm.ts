import { User } from "../models/Entities.js";
import { BaseView } from "./BaseView.js";

export class LoginFrm extends BaseView {
  render(): HTMLElement {
    this.element.className = "login-window";
    this.element.innerHTML = `
      <h1 class="login-title">LOGIN</h1>
      <form id="login-form">
        <label class="field-row">
          <span>Account</span>
          <input class="text-field" name="account" type="text" autocomplete="username" required>
        </label>
        <label class="field-row">
          <span>Password</span>
          <input class="text-field" name="password" type="password" autocomplete="current-password" required>
        </label>
        <div class="login-actions">
          <button class="primary-button" type="submit">Login</button>
        </div>
        <p class="message" id="login-message" role="alert"></p>
      </form>
    `;

    this.requiredElement<HTMLFormElement>("#login-form").addEventListener(
      "submit",
      this.actionPerformed.bind(this)
    );
    return this.element;
  }

  private actionPerformed(event: SubmitEvent): void {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const enteredUser = new User(
      0,
      String(form.get("account")).trim(),
      String(form.get("password")),
      "manager",
      ""
    );

    if (this.application.login(enteredUser)) {
      this.application.showHomeView();
      return;
    }

    this.requiredElement<HTMLParagraphElement>("#login-message").textContent =
      "Invalid account, please log in again";
  }
}
