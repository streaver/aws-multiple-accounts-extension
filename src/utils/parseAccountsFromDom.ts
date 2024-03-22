import { Account } from "./accountsStorage";

export default function parseAccountsFromDom(): Account[] {
  const accounts = Array.from(document.querySelectorAll('[data-testid="account-list-cell"]'))
    .map((account) => {
      const accountName = account.querySelector("div div strong")?.innerHTML;
      const accountId = account.querySelector("div > div:nth-child(2) > div")?.innerHTML.replace(/\s*\|.*$/, "");
      
      if (accountName && accountId) {
        return { name: accountName, id: parseInt(accountId) };
      }

      return null;
    })
    .filter(Boolean);

  return accounts as Account[];
}
