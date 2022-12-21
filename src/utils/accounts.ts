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
    runtime.sendMessage({ type: "SET_ACCOUNT", payload: account }, () => {
      resolve();
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
