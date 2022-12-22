import updatedAccountProperties, { getAccount } from "./accountsStorage";

export default function injectInputToAccounts(): void {
  Array.from(document.querySelectorAll(".instance-section")).forEach(async (accountBlock) => {
    const accountId = accountBlock.querySelector(".accountId")?.innerHTML.replace(/\#/g, "");
    if (!accountId) {
      return;
    }

    const account = await getAccount(chrome.runtime, parseInt(accountId));

    const accountColorInput = document.createElement("input");
    accountColorInput.type = "color";
    accountColorInput.value = account.color || "#000000";
    accountColorInput.style.marginLeft = "10px";

    // In order to avoid the parent menu from opening when clicking on the color input
    accountColorInput.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    accountColorInput.addEventListener(
      "input",
      (event) => {
        if (!accountId) {
          return;
        }

        updatedAccountProperties(chrome.runtime, {
          id: parseInt(accountId),
          //@ts-ignore
          color: event.target?.value,
        });
      },
      true,
    );

    accountBlock?.append(accountColorInput);
  });
}
