import { getAccount, setAccount } from "./utils/accountsStorage";
import injectInputToAccounts from "./utils/injectInputToAccounts";
import parseAccountsFromDom from "./utils/parseAccountsFromDom";
import waitForElement from "./utils/waitForElement";

(async function main() {
  if (window.location.host.endsWith("awsapps.com")) {
    const element = await waitForElement('portal-application[title="AWS Account"]');

    element.addEventListener("click", async () => {
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

      injectInputToAccounts();
    });
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
