import parseAccountsFromDom from "../utils/parseAccountsFromDom";

describe("parseAccountsFromDom", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("returns and array with the accounts from the DOM", () => {
    const accounts = [
      { name: "Account 1", id: 123 },
      { name: "Account 2", id: 456 },
      { name: "Account 3", id: 789 },
    ];

    const element = document.createElement("div");

    element.id = "test-element";
    element.innerHTML = accounts
      .map((account) => {
        return `
          <div class="instance-block">
            <div class="name">${account.name}</div>
            <div class="accountId">#${account.id}</div>
          </div>
        `;
      })
      .join("");

    document.body.appendChild(element);

    const result = parseAccountsFromDom();

    expect(result).toEqual(accounts);
  });

  test("returns an empty array if the name is not found", () => {
    const accounts = [{ name: "Account 1", id: 123 }];

    const element = document.createElement("div");

    element.id = "test-element";
    element.innerHTML = accounts
      .map((account) => {
        return `
          <div class="instance-block">
            <div class="accountId">#${account.id}</div>
          </div>
        `;
      })
      .join("");

    document.body.appendChild(element);

    const result = parseAccountsFromDom();

    expect(result).toEqual([]);
  });

  test("it returns an empty array if the id is not found", () => {
    const accounts = [{ name: "Account 1", id: 123 }];

    const element = document.createElement("div");

    element.id = "test-element";
    element.innerHTML = accounts
      .map((account) => {
        return `
          <div class="instance-block">
            <div class="name">${account.name}</div>
          </div>
        `;
      })
      .join("");

    document.body.appendChild(element);

    const result = parseAccountsFromDom();

    expect(result).toEqual([]);
  });
});
