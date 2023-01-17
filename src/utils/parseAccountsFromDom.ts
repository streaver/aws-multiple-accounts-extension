import { Account } from "./accountsStorage";
import waitForElement from "./waitForElement";

export default function parseAccountsFromDom(): Account[] {
  const accounts = Array.from(document.querySelectorAll("portal-instance"))
    .map((account) => {
      const accountsDetails = account.querySelector(".instance-block");

      if (!accountsDetails) {
        return;
      }

      account.addEventListener("click", async () => {
        await waitForElement("portal-profile", account);

        const profiles = Array.from(account.querySelectorAll("portal-profile"));

        const rolesElements = profiles.map((profile) => {
          const roleName = profile.querySelector("span#profile-name")?.innerHTML.trimEnd();
          const roleLink = profile.querySelector<HTMLAnchorElement>("a.profile-link")?.href;

          return { roleName, roleLink };
        });
      });

      const accountName = accountsDetails.querySelector(".name")?.innerHTML;
      const accountId = accountsDetails.querySelector(".accountId")?.innerHTML.replace(/\#/g, "");

      if (accountName && accountId) {
        return { name: accountName, id: parseInt(accountId) };
      }

      return null;
    })
    .filter(Boolean);

  return accounts as Account[];
}

// const sections = Array.from(document.querySelectorAll("portal-instance"));

//       sections.forEach((section) => {

//       });
