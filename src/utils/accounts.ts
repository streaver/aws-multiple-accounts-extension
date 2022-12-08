export type AccountsCache = Record<string, string>;

export async function getAccounts(runtime: typeof chrome.runtime): Promise<AccountsCache> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "GET_ACCOUNTS" }, (response) => {
      resolve(response.payload);
    });
  });
}

export async function setAccounts(runtime: typeof chrome.runtime, accounts: AccountsCache): Promise<void> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "SET_ACCOUNTS", payload: accounts }, () => {
      resolve();
    });
  });
}

export function parseAccountsFromDom() {
  const accounts = Array.from(document.querySelectorAll(".instance-block"))
    .map((account) => {
      const accountName = account.querySelector(".name")?.innerHTML;
      const accountId = account.querySelector(".accountId")?.innerHTML.replace(/\#/g, "");

      if (accountName && accountId) {
        return { name: accountName, id: accountId };
      }

      return null;
    })
    .filter(Boolean)
    .reduce((acc, account) => {
      acc[account!.id] = account!.name;

      return acc;
    }, {} as AccountsCache);

  return accounts;
}
