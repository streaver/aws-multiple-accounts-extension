import { getAccount, updateAccountProperties } from "./accountsStorage";

export default async function injectInputToAccounts(): Promise<HTMLInputElement[]> {
  const promises = Array.from(document.querySelectorAll('[data-testid="account-list-cell"]')).map(async (accountBlock) => {
    const accountId = accountBlock.querySelector("div > div:nth-child(2) > div")?.innerHTML.replace(/\s*\|.*$/, "");

    if (!accountId) {
      return;
    }

    const account = await getAccount(chrome.runtime, parseInt(accountId));

    if (!account) {
      return;
    }

    const accountColorInput = document.createElement("input");
    accountColorInput.type = "color";
    accountColorInput.value = account.color || "#000000";
    accountColorInput.style.marginLeft = "auto";

    // In order to avoid the parent menu from opening when clicking on the color input
    accountColorInput.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    accountColorInput.addEventListener(
      "input",
      (event) => {
        updateAccountProperties(chrome.runtime, {
          id: parseInt(accountId),
          //@ts-ignore
          color: event.target?.value,
        });
      },
      true,
    );

    accountBlock?.append(accountColorInput);

    return accountColorInput;
  });

  return Promise.all(promises).then((results) => results.filter(Boolean) as HTMLInputElement[]);
}
