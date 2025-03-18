import { ACCOUNT_MENU_STYLES } from "./styles";

const copyIcon = `<svg 
  class="copy-icon"
  style="${Object.entries(ACCOUNT_MENU_STYLES.copyIcon)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${value}`)
    .join(";")};" 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 448 512">
  <path fill="currentColor" d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h192c8.8 0 16 7.2 16 16v256c0 8.8-7.2 16-16 16zM192 384h192c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H192C156.7 0 128 28.7 128 64v256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h192c35.3 0 64-28.7 64-64h-48c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16V128z"/>
</svg>`;

const checkIcon = `<svg 
  style="${Object.entries(ACCOUNT_MENU_STYLES.icon)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${value}`)
    .join(";")};" 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 512 512">
  <path fill="currentColor" d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
</svg>`;

export function getAccountIdFromText(text: string): string | null {
  const match = text.match(/(\d{4}-\d{4}-\d{4})/);
  return match ? match[1].replace(/-/g, "") : null;
}

export async function updateMenuElement(element: Element, menuAccount: any) {
  const htmlElement = element as HTMLElement;
  const text = element.textContent?.trim() ?? "";
  const accountId = getAccountIdFromText(text);

  if (!accountId) return;

  const formattedAccountId = accountId.match(/.{1,4}/g)?.join("-") ?? "";
  htmlElement.innerHTML = `${copyIcon}${menuAccount.name} | ${formattedAccountId}`;

  Object.assign(htmlElement.style, ACCOUNT_MENU_STYLES.menuListItem);
  if (menuAccount.color !== "#000000") {
    htmlElement.style.backgroundColor = menuAccount.color ?? "";
  }

  const iconElement = htmlElement.querySelector(".copy-icon");
  if (iconElement) {
    const handleClick = async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        await navigator.clipboard.writeText(accountId);
        const originalText = htmlElement.innerHTML;
        htmlElement.innerHTML = `${checkIcon} AWS Account ID Copied!`;

        setTimeout(() => {
          htmlElement.innerHTML = originalText;
          const newIconElement = htmlElement.querySelector(".copy-icon");
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
}

export async function handleAccountMenuClick(menuContent: Element, getAccount: any, chrome: any) {
  const accountElements = menuContent.querySelectorAll(
    'a > div > div:nth-child(1), [data-testid="account-detail-menu"] span:nth-child(2)',
  );

  const updatePromises = Array.from(accountElements).map(async (element) => {
    const text = element.textContent?.trim() ?? "";
    const accountId = getAccountIdFromText(text);

    if (accountId) {
      const menuAccount = await getAccount(chrome.runtime, parseInt(accountId));
      if (menuAccount) {
        await updateMenuElement(element, menuAccount);
      }
    }
  });

  await Promise.all(updatePromises);
}
