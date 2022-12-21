import { AccountsCache } from "./utils/accounts";

export type BackgroundRequest =
  | {
      type: "SET_ACCOUNTS";
      payload: AccountsCache;
    }
  | { type: "GET_ACCOUNTS" };

export type BackgroundResponse =
  | {
      type: "GET_ACCOUNTS";
      payload: AccountsCache;
    }
  | {
      type: "SET_ACCOUNTS";
    };

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "GET_ACCOUNTS") {
    chrome.storage.sync.get("aws-accounts", (result) => {
      const accounts = JSON.parse(result["aws-accounts"]);

      sendResponse({ type: "GET_ACCOUNTS", payload: accounts });
    });
  } else if (request.type === "SET_ACCOUNTS") {
    chrome.storage.sync.set({ "aws-accounts": JSON.stringify(request.payload) }, () => {
      sendResponse({ type: "SET_ACCOUNTS" });
    });
  }

  return true;
});

export default {};
