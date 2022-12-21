import { Account } from "./utils/accounts";

export type BackgroundRequestType = "GET_ACCOUNT" | "SET_ACCOUNT";

export type BackgroundRequest =
  | {
      type: "GET_ACCOUNT";
      payload: number;
    }
  | {
      type: "SET_ACCOUNT";
      payload: Account;
    };

export type BackgroundResponse =
  | {
      type: "GET_ACCOUNT";
      payload: Account;
    }
  | {
      type: "SET_ACCOUNT";
      payload: Account;
    };

function buildAccountKey(id: number): string {
  return `aws-accounts:${id}`;
}

function getAccount(id: number): Promise<Account> {
  return new Promise((resolve) => {
    const accountKey = buildAccountKey(id);

    chrome.storage.sync.get(accountKey, (result) => {
      const account = JSON.parse(result[accountKey]) as Account;

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
      sendResponse({ type: "SET_ACCOUNT", payload: account });
    });
  }

  return true;
});

export default {};
