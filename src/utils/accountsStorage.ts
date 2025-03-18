import { GetAccountBackgroundResponse, UpdateAccountPropertiesBackgroundResponse } from "../background";

export type Account = {
  id: number;
  name: string;
  color?: string;
};

export type AccountsCache = Record<string, string>;

const getDefaultColor = (accountName: string): string => {
  const patterns = [
    { regex: /qa/i, color: "#448430" }, // Green for QA
    { regex: /stage|staging/i, color: "#d6662a" }, // Orange for Staging
    { regex: /prod|production/i, color: "#d32a35" }, // Red for Production
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(accountName)) {
      return pattern.color;
    }
  }

  return "#000000";
};

export async function getAccount(runtime: typeof chrome.runtime, id: number): Promise<Account | null> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "GET_ACCOUNT", payload: id }, (response: GetAccountBackgroundResponse) => {
      const account = response.payload;
      if (account && !account.color) {
        account.color = getDefaultColor(account.name || "");
      }
      resolve(account ?? null);
    });
  });
}

export async function setAccount(runtime: typeof chrome.runtime, account: Account): Promise<void> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "SET_ACCOUNT", payload: account }, () => {
      resolve();
    });
  });
}

export function updateAccountProperties(
  runtime: typeof chrome.runtime,
  account: Pick<Account, "id"> & Partial<Account>,
): Promise<Account | null> {
  return new Promise((resolve) => {
    runtime.sendMessage(
      { type: "UPDATE_ACCOUNT_PROPERTIES", payload: account },
      (response: UpdateAccountPropertiesBackgroundResponse) => {
        resolve(response.payload);
      },
    );
  });
}
