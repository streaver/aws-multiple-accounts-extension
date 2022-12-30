import { Account } from "./utils/accountsStorage";

export type GetAccountBackgroundRequest = {
  type: "GET_ACCOUNT";
  payload: number;
};

export type SetAccountBackgroundRequest = {
  type: "SET_ACCOUNT";
  payload: Account;
};

export type UpdateAccountPropertiesBackgroundRequest = {
  type: "UPDATE_ACCOUNT_PROPERTIES";
  payload: Pick<Account, "id"> & Partial<Account>;
};

export type BackgroundRequest =
  | GetAccountBackgroundRequest
  | SetAccountBackgroundRequest
  | UpdateAccountPropertiesBackgroundRequest;

export type GetAccountBackgroundResponse = {
  type: "GET_ACCOUNT";
  payload: Account | null;
};

export type SetAccountBackgroundResponse = {
  type: "SET_ACCOUNT";
};

export type UpdateAccountPropertiesBackgroundResponse = {
  type: "UPDATE_ACCOUNT_PROPERTIES";
  payload: Account | null;
};

export type BackgroundResponse =
  | GetAccountBackgroundResponse
  | SetAccountBackgroundResponse
  | UpdateAccountPropertiesBackgroundResponse;

function buildAccountKey(id: number): string {
  return `aws-accounts:${id}`;
}

function getAccount(id: number): Promise<Account | null> {
  return new Promise((resolve) => {
    const accountKey = buildAccountKey(id);

    chrome.storage.sync.get(accountKey, (result) => {
      const account = JSON.parse(result[accountKey] ?? null);

      resolve(account);
    });
  });
}

function setAccount(account: Account): Promise<Account> {
  return new Promise((resolve) => {
    const accountKey = buildAccountKey(account.id);

    chrome.storage.sync.set({ [accountKey]: JSON.stringify(account) }, () => {
      resolve(account);
    });
  });
}

chrome.runtime.onMessage.addListener(function (
  request: BackgroundRequest,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: BackgroundResponse) => void,
) {
  if (request.type === "GET_ACCOUNT") {
    getAccount(request.payload).then((account) => {
      sendResponse({ type: "GET_ACCOUNT", payload: account });
    });
  } else if (request.type === "SET_ACCOUNT") {
    setAccount(request.payload).then((account) => {
      sendResponse({ type: "SET_ACCOUNT" });
    });
  } else if (request.type === "UPDATE_ACCOUNT_PROPERTIES") {
    getAccount(request.payload.id).then((account) => {
      if (!account) {
        return;
      }

      const updatedAccount = {
        ...account,
        ...request.payload,
      };

      setAccount(updatedAccount).then((account) => {
        sendResponse({ type: "UPDATE_ACCOUNT_PROPERTIES", payload: account });
      });
    });
  }

  return true;
});

export default {};
