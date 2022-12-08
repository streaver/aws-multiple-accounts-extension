import { getAccounts, parseAccountsFromDom, setAccounts } from "./utils/accounts";
import waitForElement from "./utils/waitForElement";

(async function main() {
  if (window.location.host.endsWith("awsapps.com")) {
    const element = await waitForElement('portal-application[title="AWS Account"]');

    element.addEventListener("click", async (event) => {
      const accounts = parseAccountsFromDom();

      await setAccounts(chrome.runtime, accounts);
    });
  } else if (window.location.host.endsWith("aws.amazon.com")) {
    const accounts = await getAccounts(chrome.runtime);

    const accountIdElement = await waitForElement('div[data-testid="account-detail-menu"] span:nth-child(2)');

    const accountTextElement = await waitForElement('span[data-testid="awsc-nav-account-menu-button"] span');

    if (accountIdElement && accountTextElement) {
      const accountIdFromDom = accountIdElement.innerHTML.replace(/\-/g, "");
      const accountNameFromDom = accountTextElement.innerHTML;
      const newAccountName = `${accounts[accountIdFromDom]}/${accountNameFromDom}`;

      accountTextElement.innerHTML = newAccountName;
    }
  }
})();

export {};
