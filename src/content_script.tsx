import { getAccount, setAccount } from "./utils/accountsStorage";
import injectInputToAccounts from "./utils/injectInputToAccounts";
import parseAccountsFromDom from "./utils/parseAccountsFromDom";
import waitForElement from "./utils/waitForElement";

(async function main() {
  if (window.location.host.endsWith("awsapps.com")) {
    const element: HTMLElement = await waitForElement('[data-testid="accounts"]');
    
    element.addEventListener("click", async () => {
      await waitForElement('[data-testid="account-list-cell"]');
      const accounts = parseAccountsFromDom();

      await Promise.allSettled(
        accounts.map(async (account) => {
          const maybeAccount = await getAccount(chrome.runtime, account.id);

          if (maybeAccount) {
            return;
          }

          return setAccount(chrome.runtime, account);
        }),
      );

      await injectInputToAccounts();
    });

    window.location.hash.split("=")[1] == "accounts" ? element.click() : null;
  } else if (window.location.host.endsWith("aws.amazon.com")) {
    const accountIdElement = await waitForElement('div[data-testid="account-detail-menu"] span:nth-child(2)');
    const accountTextElement = await waitForElement('span[data-testid="awsc-nav-account-menu-button"] span');

    if (accountIdElement && accountTextElement) {
      const accountIdFromDom = accountIdElement.innerHTML.replace(/\-/g, "");
      const accountNameFromDom = accountTextElement.innerHTML;

      const account = await getAccount(chrome.runtime, parseInt(accountIdFromDom));

      if (!account) {
        return;
      }

      const newAccountName = `${account.name}/${accountNameFromDom}`;

      accountTextElement.style.backgroundColor = account.color ?? "";
      accountTextElement.style.borderRadius = "5px";
      accountTextElement.style.padding = "0 5px";

      accountTextElement.innerHTML = newAccountName;
    }
  }
})();

export {};
