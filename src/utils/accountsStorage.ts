export type Account = {
  id: number;
  name: string;
  color?: string;
};

export type AccountsCache = Record<string, string>;

export async function getAccount(runtime: typeof chrome.runtime, id: number): Promise<Account> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "GET_ACCOUNT", payload: id }, (response) => {
      resolve(response.payload);
    });
  });
}

export async function setAccount(runtime: typeof chrome.runtime, account: Account): Promise<void> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "SET_ACCOUNT", payload: account }, (response) => {
      resolve(response.payload);
    });
  });
}

export default function updatedAccountProperties(
  runtime: typeof chrome.runtime,
  account: Pick<Account, "id"> & Partial<Account>,
): Promise<void> {
  return new Promise((resolve) => {
    runtime.sendMessage({ type: "UPDATE_PROPERTIES", payload: account }, (response) => {
      resolve(response.payload);
    });
  });
}
