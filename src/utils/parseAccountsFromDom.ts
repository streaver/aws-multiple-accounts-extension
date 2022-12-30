import { Account } from "./accountsStorage";

export default function parseAccountsFromDom(): Account[] {
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
