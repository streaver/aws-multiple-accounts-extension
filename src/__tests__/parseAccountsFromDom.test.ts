import { parseAccountsFromDom } from "../utils/parseAccountsFromDom";

function createAccountCell(name: string, id?: string) {
  const cell = document.createElement("div");
  cell.setAttribute("data-testid", "account-list-cell");

  const wrapper = document.createElement("div");
  const container = document.createElement("div");

  const strong = document.createElement("strong");
  const nameDiv = document.createElement("div");
  nameDiv.textContent = name;
  strong.appendChild(nameDiv);
  container.appendChild(strong);

  if (id) {
    const p = document.createElement("p");
    const idDiv = document.createElement("div");
    idDiv.textContent = `${id} | AWS Account`;
    p.appendChild(idDiv);
    container.appendChild(p);
  }

  wrapper.appendChild(container);
  cell.appendChild(wrapper);
  return cell;
}

function createInvalidStructureCell(name: string, id: string) {
  const cell = document.createElement("div");
  cell.setAttribute("data-testid", "account-list-cell");
  cell.innerHTML = `<div>${name} - ${id}</div>`;
  return cell;
}

describe("parseAccountsFromDom", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should parse accounts with ids and names from the DOM", () => {
    const accounts = [
      { name: "qa-payments-service", id: "123456789012" },
      { name: "production-api", id: "234567890123" },
      { name: "qa-auth-service", id: "345678901234" },
      { name: "production-frontend", id: "456789012345" },
    ];

    accounts.forEach((account) => {
      document.body.appendChild(createAccountCell(account.name, account.id));
    });

    expect(parseAccountsFromDom()).toEqual(accounts.map((acc) => ({ ...acc, id: parseInt(acc.id) })));
  });

  it("should ignore cells without valid account info", () => {
    // Add invalid cell (missing ID)
    document.body.appendChild(createAccountCell("qa-invalid-account"));

    // Add valid cell
    document.body.appendChild(createAccountCell("production-valid-service", "987654321098"));

    expect(parseAccountsFromDom()).toEqual([{ id: 987654321098, name: "production-valid-service" }]);
  });

  it("should return empty array when no accounts found", () => {
    expect(parseAccountsFromDom()).toEqual([]);
  });

  it("should ignore accounts with invalid ID format", () => {
    // Add cell with non-numeric ID
    document.body.appendChild(createAccountCell("qa-service", "invalid-id"));

    // Add cell with empty ID
    document.body.appendChild(createAccountCell("production-service", ""));

    // Add cell with valid ID
    document.body.appendChild(createAccountCell("valid-service", "123456789012"));

    expect(parseAccountsFromDom()).toEqual([{ id: 123456789012, name: "valid-service" }]);
  });

  it("should ignore accounts with invalid HTML structure", () => {
    // Add cell with invalid structure
    document.body.appendChild(createInvalidStructureCell("qa-service", "123456789012"));

    // Add cell with valid structure
    document.body.appendChild(createAccountCell("production-service", "987654321098"));

    expect(parseAccountsFromDom()).toEqual([{ id: 987654321098, name: "production-service" }]);
  });

  it("should handle malformed account descriptions", () => {
    const cell = document.createElement("div");
    cell.setAttribute("data-testid", "account-list-cell");

    const wrapper = document.createElement("div");
    const container = document.createElement("div");

    const strong = document.createElement("strong");
    const nameDiv = document.createElement("div");
    nameDiv.textContent = "qa-service";
    strong.appendChild(nameDiv);
    container.appendChild(strong);

    const p = document.createElement("p");
    const idDiv = document.createElement("div");
    // Missing the separator |
    idDiv.textContent = "123456789012";
    p.appendChild(idDiv);
    container.appendChild(p);

    wrapper.appendChild(container);
    cell.appendChild(wrapper);

    document.body.appendChild(cell);

    expect(parseAccountsFromDom()).toEqual([{ id: 123456789012, name: "qa-service" }]);
  });
});
