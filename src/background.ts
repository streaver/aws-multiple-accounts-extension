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

async function getAccount(id: number): Promise<Account | null> {
  const accountKey = buildAccountKey(id);

  const syncAccount = await new Promise<Account>((resolve) => {
    chrome.storage.sync.get(accountKey, (result) => {
      const account = JSON.parse(result[accountKey] ?? null);

      resolve(account);
    });
  });

  const localAccount = await new Promise<Account>((resolve) => {
    chrome.storage.local.get(accountKey, (result) => {
      const account = JSON.parse(result[accountKey] ?? null);

      resolve(account);
    });
  });

  return { ...syncAccount, ...localAccount };
}

async function setAccount(account: Account): Promise<Account> {
  const accountKey = buildAccountKey(account.id);

  const syncAccount = await new Promise<Account>((resolve) => {
    const accountWithoutManagementConsoleDetails = {
      ...account,
      managementConsoleDetails: undefined,
    };

    chrome.storage.sync.set({ [accountKey]: JSON.stringify(accountWithoutManagementConsoleDetails) }, () => {
      resolve(account);
    });
  });

  const localAccount = await new Promise<Account>((resolve) => {
    const accountWithoutColor = {
      id: account.id,
      managementConsoleDetails: account.managementConsoleDetails,
    };

    chrome.storage.local.set({ [accountKey]: JSON.stringify(accountWithoutColor) }, () => {
      resolve(account);
    });
  });

  return { ...syncAccount, ...localAccount };
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
