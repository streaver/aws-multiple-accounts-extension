/**
 * @jest-environment jsdom
 */

import { updateAccountProperties } from "../utils/accountsStorage";
import injectInputToAccounts from "../utils/injectInputToAccounts";

const accounts = [
  { name: "Account 1", id: 123, color: "#ff0000" },
  { name: "Account 2", id: 456, color: "#00ff00" },
  { name: "Account 3", id: 789 },
];

jest.mock("../utils/accountsStorage", () => {
  return {
    __esModule: true,
    getAccount: (runtime: any, id: number) => Promise.resolve(accounts.find((account) => account.id === id)),
    updateAccountProperties: jest.fn().mockImplementation(() => Promise.resolve(accounts[0])),
  };
});

describe("injectInputToAccounts", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("injects the input to the accounts", async () => {
    const element = document.createElement("div");

    element.id = "test-element";
    element.innerHTML = accounts
      .map((account) => {
        return `
          <div class="instance-section">
            <div class="name">${account.name}</div>
            <div class="accountId">#${account.id}</div>
          </div>
        `;
      })
      .join("");

    document.body.appendChild(element);

    await injectInputToAccounts();

    const result = Array.from(document.querySelectorAll("input"));

    expect(result).toHaveLength(accounts.length);

    result.forEach((input, index) => {
      expect(input!.value).toEqual(accounts[index].color || "#000000");
    });
  });

  test("does not inject the input to the accounts when it does not find accountId", async () => {
    const element = document.createElement("div");

    element.id = "test-element";
    element.innerHTML = accounts
      .map((account) => {
        return `
          <div class="instance-section">
            <div class="name">${account.name}</div>
            <div class="newAccountId">#${account.id}</div>
          </div>
        `;
      })
      .join("");

    document.body.appendChild(element);

    await injectInputToAccounts();

    const result = Array.from(document.querySelectorAll("input"));

    expect(result).toHaveLength(0);
  });

  test("does not inject the input to the accounts when it does not find account", async () => {
    const element = document.createElement("div");

    element.id = "test-element";
    element.innerHTML = `
    <div class="instance-section">
      <div class="name">Does not exist</div>
      <div class="accountId">#99999</div>
    </div>
  `;

    document.body.appendChild(element);

    await injectInputToAccounts();

    const result = Array.from(document.querySelectorAll("input"));

    expect(result).toHaveLength(0);
  });

  test("the input stop the click propagation", async () => {
    const element = document.createElement("div");

    element.id = "test-element";
    element.innerHTML = `
    <div class="instance-section">
      <div class="name">${accounts[0].name}</div>
      <div class="accountId">#${accounts[0].id}</div>
    </div>
  `;

    document.body.appendChild(element);

    await injectInputToAccounts();

    const input = document.querySelector("input") as HTMLInputElement;

    const clickSpy = jest.fn();

    document.body.addEventListener("click", clickSpy);

    input.click();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  test("the input event updates the account properties", async () => {
    const element = document.createElement("div");

    element.id = "test-element";
    element.innerHTML = `
    <div class="instance-section">
      <div class="name">${accounts[0].name}</div>
      <div class="accountId">#${accounts[0].id}</div>
    </div>
  `;

    document.body.appendChild(element);

    await injectInputToAccounts();

    const input = document.querySelector("input") as HTMLInputElement;

    input.value = "#121212";

    input.dispatchEvent(new Event("input"));

    expect(updateAccountProperties).toHaveBeenCalledWith(expect.anything(), {
      id: accounts[0].id,
      color: "#121212",
    });
  });
});
