import { GetAccountBackgroundResponse, UpdateAccountPropertiesBackgroundResponse } from "../background";

export type Account = {
  id: number;
  name: string;
  color?: string;
  managementConsoleDetails?: Array<{
    roleName: string;
    roleUrl: string;
  }>;
};

export type AccountsCache = Record<string, string>;

export async function getAccount(runtime: typeof chrome.runtime, id: number): Promise<Account | null> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "GET_ACCOUNT", payload: id }, (response: GetAccountBackgroundResponse) => {
      resolve(response.payload ?? null);
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
