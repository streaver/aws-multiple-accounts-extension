import { getAccount, setAccount, Account } from "./utils/accountsStorage";
import injectInputToAccounts from "./utils/injectInputToAccounts";
import { parseAccountsFromDom } from "./utils/parseAccountsFromDom";
import waitForElement from "./utils/waitForElement";
import { ACCOUNT_MENU_STYLES } from "./utils/styles";
import { handleAccountMenuClick } from "./utils/accountUtils";

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

      const copyIcon = `<svg 
        class="copy-icon"
        style="display: inline-block; width: 14px; height: 14px; margin-right: 4px; vertical-align: middle; cursor: pointer;" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 448 512">
        <path fill="currentColor" d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h192c8.8 0 16 7.2 16 16v256c0 8.8-7.2 16-16 16zM192 384h192c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H192C156.7 0 128 28.7 128 64v256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h192c35.3 0 64-28.7 64-64h-48c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16V128z"/>
      </svg>`;

      const checkIcon = `<svg 
        style="display: inline-block; width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 512 512">
        <path fill="currentColor" d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
      </svg>`;

      const newAccountName = `${copyIcon}${account.name} | ${accountNameFromDom}`;
      accountTextElement.style.display = "flex";
      accountTextElement.style.alignItems = "center";
      accountTextElement.style.backgroundColor = account.color ?? "";
      accountTextElement.style.borderRadius = "5px";
      accountTextElement.style.padding = "0 5px";
      accountTextElement.style.cursor = "pointer";
      accountTextElement.addEventListener("mouseover", () => {
        accountTextElement.style.color = "#fff";
      });

      accountTextElement.innerHTML = newAccountName;
      Object.assign(accountTextElement.style, ACCOUNT_MENU_STYLES.menuItem);

      const iconElement = accountTextElement.querySelector(".copy-icon");
      if (iconElement) {
        const handleClick = async (event: Event) => {
          event.preventDefault();
          event.stopPropagation();

          try {
            await navigator.clipboard.writeText(accountIdFromDom);
            const originalText = accountTextElement.innerHTML;
            accountTextElement.innerHTML = `${checkIcon} AWS Account ID Copied!`;

            setTimeout(() => {
              accountTextElement.innerHTML = originalText;
              const newIconElement = accountTextElement.querySelector(".copy-icon");
              if (newIconElement) {
                newIconElement.addEventListener("click", handleClick);
              }
            }, 500);
          } catch (err) {
            console.error("Failed to copy account ID:", err);
          }
        };

        iconElement.addEventListener("click", handleClick);
      }

      const accountMenuButton = await waitForElement('[data-testid="awsc-nav-account-menu-button"]');

      if (accountMenuButton) {
        let isProcessing = false;

        const resetProcessing = (event: MouseEvent) => {
          if (!accountMenuButton.contains(event.target as Node)) {
            isProcessing = false;
          }
        };

        document.addEventListener("click", resetProcessing);

        accountMenuButton.addEventListener("click", async () => {
          if (isProcessing) return;
          isProcessing = true;

          const menuContent = await waitForElement('[data-testid="awsc-account-menu-other-session-content"]');
          await handleAccountMenuClick(menuContent, getAccount, chrome);
        });
      }
    }
  }
})();

export {};
