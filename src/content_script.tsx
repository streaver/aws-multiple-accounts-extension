import { getAccount, parseAccountsFromDom, setAccount } from "./utils/accounts";
import waitForElement from "./utils/waitForElement";

(async function main() {
  if (window.location.host.endsWith("awsapps.com")) {
    const element = await waitForElement('portal-application[title="AWS Account"]');

    element.addEventListener("click", async () => {
      const accounts = parseAccountsFromDom();

      await Promise.allSettled(
        accounts.map((account) => {
          return setAccount(chrome.runtime, {
            ...account,
            color: account.name.toLowerCase().includes("prod") ? "red" : "blue",
          });
        }),
      );
    });
  } else if (window.location.host.endsWith("aws.amazon.com")) {
    const accountIdElement = await waitForElement('div[data-testid="account-detail-menu"] span:nth-child(2)');
    const accountTextElement = await waitForElement('span[data-testid="awsc-nav-account-menu-button"] span');

    if (accountIdElement && accountTextElement) {
      const accountIdFromDom = accountIdElement.innerHTML.replace(/\-/g, "");
      const accountNameFromDom = accountTextElement.innerHTML;

      const account = await getAccount(chrome.runtime, parseInt(accountIdFromDom));

      const newAccountName = `${account.name}/${accountNameFromDom}`;

      accountTextElement.style.backgroundColor = account.color ?? "";
      accountTextElement.style.borderRadius = "5px";
      accountTextElement.style.padding = "0 5px";

      accountTextElement.innerHTML = newAccountName;
    }
  }
})();

export {};
