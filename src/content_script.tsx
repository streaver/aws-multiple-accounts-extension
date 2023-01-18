import { Account, getAccount, setAccount } from "./utils/accountsStorage";
import { getAccountDetails, getProfileDetails } from "./utils/domParsing";
import { getAccountElements, getAccountProfileElements, getPortalElement } from "./utils/domSelection";
import injectInputToAccounts from "./utils/injectInputToAccounts";
import waitForElement from "./utils/waitForElement";

(async function main() {
  if (window.location.host.endsWith("awsapps.com")) {
    const portalElement = await getPortalElement();

    portalElement.addEventListener("click", async () => {
      const accountsElements = await getAccountElements();

      accountsElements.forEach(async (accountElement) => {
        const account = getAccountDetails(accountElement);

        console.log("account", account);

        if (!account) {
          return;
        }

        accountElement.addEventListener("click", async () => {
          const profileElements = await getAccountProfileElements(accountElement);

          const profiles = profileElements.map(getProfileDetails);

          console.log("profiles", account, profiles);

          setAccount(chrome.runtime, { ...account, managementConsoleDetails: profiles } as Account);
        });

        return setAccount(chrome.runtime, account as Account);
      });

      await injectInputToAccounts();
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

      const newLink = document.createElement("a");
      newLink.href =
        "https://d-90674c4cf2.awsapps.com/start/#/saml/custom/199957260584%20%28Dev%29/MTE5ODQxNTMyODM1X2lucy1mOGQyZDA1MTZjNTE4ZWVhX3AtNDQ5NTUwNzY5OWM3Yzc0MA%3D%3D";
      newLink.innerText = "AWS Dev Console";

      accountTextElement.append(newLink);
    }
  }
})();

export {};
