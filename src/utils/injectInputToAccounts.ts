import { getAccount, updateAccountProperties } from "./accountsStorage";

export default async function injectInputToAccounts(): Promise<HTMLInputElement[]> {
  const style = document.createElement("style");

  style.textContent = `
    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 50%;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
      border-radius: 50%;
    }
  `;

  document.head.appendChild(style);

  const promises = Array.from(document.querySelectorAll('[data-testid="account-list-cell"]')).map(
    async (accountBlock) => {
      const accountDescription = accountBlock.querySelector("div div p div")?.innerHTML;

      if (!accountDescription) {
        return;
      }

      const [accountId] = accountDescription.split("|").map((s) => s.trim());

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
      accountColorInput.style.alignSelf = "center";
      accountColorInput.style.width = "30px";
      accountColorInput.style.height = "30px";
      accountColorInput.style.padding = "0";
      accountColorInput.style.border = "none";
      accountColorInput.style.borderRadius = "50%";
      accountColorInput.style.cursor = "pointer";

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
    },
  );

  return Promise.all(promises).then((results) => results.filter(Boolean) as HTMLInputElement[]);
}
