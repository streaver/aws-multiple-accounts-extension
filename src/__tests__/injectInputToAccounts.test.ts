import { updateAccountProperties } from "../utils/accountsStorage";
import injectInputToAccounts from "../utils/injectInputToAccounts";

const TEST_ACCOUNTS = [
  { name: "Account 1", id: 123, color: "#ff0000" },
  { name: "Account 2", id: 456, color: "#00ff00" },
  { name: "Account 3", id: 789, color: "#000000" },
];

(global as any).chrome = {
  runtime: {
    sendMessage: (message: any, callback: (response: any) => void) => {
      switch (message.type) {
        case "GET_ACCOUNT":
          const account = TEST_ACCOUNTS.find((acc) => acc.id === message.payload);
          callback({ payload: account ? { ...account } : null });
          break;
        case "UPDATE_ACCOUNT_PROPERTIES":
          callback({ payload: { ...TEST_ACCOUNTS[0], ...message.payload } });
          break;
      }
    },
  },
};

jest.mock("../utils/accountsStorage", () => {
  const originalModule = jest.requireActual("../utils/accountsStorage");
  return {
    __esModule: true,
    ...originalModule,
    updateAccountProperties: jest.fn().mockImplementation((runtime, account) => {
      return Promise.resolve({ ...TEST_ACCOUNTS[0], ...account });
    }),
  };
});

describe("injectInputToAccounts", () => {
  const createAwsAccountCell = (id: number, name: string): HTMLElement => {
    const cell = document.createElement("div");
    cell.setAttribute("data-testid", "account-list-cell");

    const innerDiv = document.createElement("div");
    const pTag = document.createElement("p");
    const contentDiv = document.createElement("div");
    contentDiv.textContent = `${id} | ${name}`;

    pTag.appendChild(contentDiv);
    innerDiv.appendChild(pTag);
    cell.appendChild(innerDiv);

    return cell;
  };

  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("style injection", () => {
    test("should inject color input styles into document head", async () => {
      document.body.appendChild(createAwsAccountCell(TEST_ACCOUNTS[0].id, TEST_ACCOUNTS[0].name));

      await injectInputToAccounts();

      const styleElement = document.head.querySelector("style");
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toContain('input[type="color"]::-webkit-color-swatch');
      expect(styleElement?.textContent).toContain('input[type="color"]::-webkit-color-swatch-wrapper');
    });
  });

  describe("successful injection", () => {
    test("should inject color inputs for all valid accounts", async () => {
      TEST_ACCOUNTS.forEach((account) => {
        document.body.appendChild(createAwsAccountCell(account.id, account.name));
      });

      const injectedInputs = await injectInputToAccounts();

      expect(injectedInputs).toHaveLength(TEST_ACCOUNTS.length);

      injectedInputs.forEach((input, index) => {
        expect(input.value).toEqual(TEST_ACCOUNTS[index].color);
        expect(input.type).toBe("color");
        expect(input.style.marginLeft).toBe("auto");
        expect(input.style.alignSelf).toBe("center");
      });
    });

    test("should prevent click event propagation on color inputs", async () => {
      document.body.appendChild(createAwsAccountCell(TEST_ACCOUNTS[0].id, TEST_ACCOUNTS[0].name));
      const clickSpy = jest.fn();
      document.body.addEventListener("click", clickSpy);

      const [colorInput] = await injectInputToAccounts();
      colorInput.click();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    test("should update account properties when color input changes", async () => {
      const NEW_COLOR = "#121212";
      document.body.appendChild(createAwsAccountCell(TEST_ACCOUNTS[0].id, TEST_ACCOUNTS[0].name));

      const [colorInput] = await injectInputToAccounts();
      colorInput.value = NEW_COLOR;
      colorInput.dispatchEvent(new Event("input"));

      expect(updateAccountProperties).toHaveBeenCalledWith(expect.anything(), {
        id: TEST_ACCOUNTS[0].id,
        color: NEW_COLOR,
      });
    });

    test("should apply all required styles to color inputs", async () => {
      document.body.appendChild(createAwsAccountCell(TEST_ACCOUNTS[0].id, TEST_ACCOUNTS[0].name));

      const [colorInput] = await injectInputToAccounts();

      expect(colorInput.style.width).toBe("30px");
      expect(colorInput.style.height).toBe("30px");
      expect(colorInput.style.padding).toBe("0px");
      expect(colorInput.style.border).toBe("");
      expect(colorInput.style.borderRadius).toBe("50%");
      expect(colorInput.style.cursor).toBe("pointer");
    });
  });

  describe("error cases", () => {
    test("should not inject inputs when account-list-cell is missing", async () => {
      const container = document.createElement("div");
      TEST_ACCOUNTS.forEach((account) => {
        const button = document.createElement("button");
        button.textContent = `${account.id} | ${account.name}`;
        container.appendChild(button);
      });
      document.body.appendChild(container);

      const inputs = await injectInputToAccounts();
      expect(inputs).toHaveLength(0);
    });

    test("should not inject inputs when account ID is missing", async () => {
      const container = document.createElement("div");
      TEST_ACCOUNTS.forEach(() => {
        const cell = document.createElement("div");
        cell.setAttribute("data-testid", "account-list-cell");
        container.appendChild(cell);
      });
      document.body.appendChild(container);

      const inputs = await injectInputToAccounts();
      expect(inputs).toHaveLength(0);
    });

    test("should not inject inputs for non-existent accounts", async () => {
      document.body.appendChild(createAwsAccountCell(99999, "Non-existent Account"));

      const inputs = await injectInputToAccounts();
      expect(inputs).toHaveLength(0);
    });

    test("should not inject inputs for malformed account description", async () => {
      const cell = document.createElement("div");
      cell.setAttribute("data-testid", "account-list-cell");

      const innerDiv = document.createElement("div");
      const pTag = document.createElement("p");
      const contentDiv = document.createElement("div");
      contentDiv.textContent = "malformed-no-separator";

      pTag.appendChild(contentDiv);
      innerDiv.appendChild(pTag);
      cell.appendChild(innerDiv);
      document.body.appendChild(cell);

      const inputs = await injectInputToAccounts();
      expect(inputs).toHaveLength(0);
    });

    test("should not inject inputs for empty account description", async () => {
      const cell = document.createElement("div");
      cell.setAttribute("data-testid", "account-list-cell");

      const innerDiv = document.createElement("div");
      const pTag = document.createElement("p");
      const contentDiv = document.createElement("div");
      contentDiv.textContent = "";

      pTag.appendChild(contentDiv);
      innerDiv.appendChild(pTag);
      cell.appendChild(innerDiv);
      document.body.appendChild(cell);

      const inputs = await injectInputToAccounts();
      expect(inputs).toHaveLength(0);
    });

    test("should handle non-numeric account IDs", async () => {
      const cell = createAwsAccountCell(NaN, "Invalid ID Account");
      document.body.appendChild(cell);

      const inputs = await injectInputToAccounts();
      expect(inputs).toHaveLength(0);
    });
  });

  describe("default values", () => {
    test("should use default color when account has no color specified", async () => {
      const accountWithoutColor = { ...TEST_ACCOUNTS[0], color: undefined };
      (global as any).chrome.runtime.sendMessage = (message: any, callback: (response: any) => void) => {
        if (message.type === "GET_ACCOUNT") {
          callback({ payload: accountWithoutColor });
        }
      };

      document.body.appendChild(createAwsAccountCell(accountWithoutColor.id, accountWithoutColor.name));

      const [colorInput] = await injectInputToAccounts();
      expect(colorInput.value).toBe("#000000");
    });
  });
});
