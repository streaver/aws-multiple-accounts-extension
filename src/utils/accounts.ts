export type Account = {
  id: number;
  name: string;
  color?: string;
};

export type AccountsCache = Record<string, string>;

export async function getAccount(runtime: typeof chrome.runtime, id: number): Promise<Account> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "GET_ACCOUNT", payload: id }, (response) => {
      resolve(response.payload);
    });
  });
}

export async function setAccount(runtime: typeof chrome.runtime, account: Account): Promise<void> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "SET_ACCOUNT", payload: account }, (response) => {
      resolve(response.payload);
    });
  });
}

export default function updatedAccountProperties(
  runtime: typeof chrome.runtime,
  account: Pick<Account, "id"> & Partial<Account>,
): Promise<void> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "UPDATE_PROPERTIES", payload: account }, (response) => {
      resolve(response.payload);
    });
  });
}

export function parseAccountsFromDom(): Account[] {
  const accounts = Array.from(document.querySelectorAll(".instance-block"))
    .map((account) => {
      const accountName = account.querySelector(".name")?.innerHTML;
      const accountId = account.querySelector(".accountId")?.innerHTML.replace(/\#/g, "");

      if (accountName && accountId) {
        return { name: accountName, id: parseInt(accountId) };
      }

      return null;
    })
    .filter(Boolean);

  return accounts as Account[];
}

export function injectInputToAccounts(): void {
  Array.from(document.querySelectorAll(".instance-section")).forEach(async (accountBlock) => {
    const accountId = accountBlock.querySelector(".accountId")?.innerHTML.replace(/\#/g, "");
    if (!accountId) {
      return;
    }

    const account = await getAccount(chrome.runtime, parseInt(accountId));

    const accountColorInput = document.createElement("input");
    accountColorInput.type = "color";
    accountColorInput.value = account.color || "#000000";
    accountColorInput.style.marginLeft = "10px";

    accountColorInput.addEventListener("input", (event) => {
      if (!accountId) {
        return;
      }

      updatedAccountProperties(chrome.runtime, {
        id: parseInt(accountId),
        //@ts-ignore
        color: event.target?.value,
      });
    });

    accountBlock?.append(accountColorInput);
  });
}
