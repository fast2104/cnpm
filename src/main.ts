import { CostumeRentalApplication } from "./Application.js";

const rootElement = document.querySelector<HTMLElement>("#app");
if (!rootElement) {
  throw new Error("Application root element was not found.");
}

const application = new CostumeRentalApplication(rootElement);
application.start();
