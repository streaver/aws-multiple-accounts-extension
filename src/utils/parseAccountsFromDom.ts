import { Account } from "./accountsStorage";

export const parseAccountsFromDom = (): Account[] => {
  const accounts = Array.from(document.querySelectorAll('[data-testid="account-list-cell"]'))
    .map((account) => {
      const accountName = account.querySelector("div div strong div")?.innerHTML;
      const accountDescription = account.querySelector("div div p div")?.innerHTML;

      if (accountDescription) {
        const [accountId] = accountDescription.split("|").map((s) => s.trim());
        if (accountId && accountName) {
          const parsedId = parseInt(accountId);
          if (!isNaN(parsedId)) {
            return {
              name: accountName,
              id: parsedId,
            };
          }
        }
      }

      return null;
    })
    .filter(Boolean);

  return accounts as Account[];
};
