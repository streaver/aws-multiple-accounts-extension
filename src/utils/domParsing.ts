import { Account } from "./accountsStorage";

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

type AccountDetails = Pick<Account, "name" | "id">;
type AccountProfileDetails = ArrayElement<Account["managementConsoleDetails"]>;

export function getAccountDetails(account: Element): AccountDetails | undefined {
  const accountName = account.querySelector(".name")?.innerHTML;
  const accountId = account.querySelector(".accountId")?.innerHTML.replace(/\#/g, "");

  if (accountName && accountId) {
    return { name: accountName, id: parseInt(accountId) };
  }
}

export function getProfileDetails(profile: Element): AccountProfileDetails | undefined {
  const roleName = profile.querySelector("span#profile-name")?.innerHTML.trimEnd();
  const roleUrl = profile.querySelector<HTMLAnchorElement>("a.profile-link")?.href;

  if (roleName && roleUrl) {
    return { roleName, roleUrl };
  }
}
