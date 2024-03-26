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
        <button data-testid="account-list-cell">
          <div>
            <div>
              <strong>${account.name}</strong>
            </div>
            <div>
              <div>${account.id} | ${account.name} </div>
            </div>
          </div>
        </button>
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
        <button data-testid="account-list-cell">
          <div>
            <div>
              <div>${account.id} | ${account.name} </div>
            </div>
          </div>
        </button>
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
        <button data-testid="account-list-cell">
          <div>
            <div>
              <strong>${account.name}</strong>
            </div>
          </div>
        </button>
      `;
      })
      .join("");

    document.body.appendChild(element);

    const result = parseAccountsFromDom();

    expect(result).toEqual([]);
  });
});

test("it returns an empty array if the data-testid is not found", () => {
  const accounts = [{ name: "Account 1", id: 123 }];

  const element = document.createElement("div");

  element.id = "test-element";
  element.innerHTML = accounts
    .map((account) => {
      return `
      <button data-testid="">
        <div>
          <div>
            <strong>${account.name}</strong>
          </div>
          <div>
            <div>${account.id} | ${account.name} </div>
          </div>
        </div>
      </button>
    `;
    })
    .join("");

  document.body.appendChild(element);

  const result = parseAccountsFromDom();

  expect(result).toEqual([]);
});
