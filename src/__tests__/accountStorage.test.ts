import { chrome } from "jest-chrome";
import { getAccount, setAccount, updateAccountProperties } from "../utils/accountsStorage";

describe("accountStorage", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("getAccount", () => {
    test("returns the account when it exists", async () => {
      const message = { type: "GET_ACCOUNT", payload: 123 };
      const response = { type: "GET_ACCOUNT", payload: { id: 123, name: "test" } };

      chrome.runtime.sendMessage.mockImplementation((message, callback) => {
        //@ts-ignore
        callback(response);
      });

      //@ts-ignore
      const account = await getAccount(chrome.runtime, 123);

      expect(chrome.runtime.sendMessage).toBeCalledWith(message, expect.anything());
      expect(account).toEqual({ id: 123, name: "test" });
    });

    test("returns null when it does not exist", async () => {
      const message = { type: "GET_ACCOUNT", payload: 123 };
      const response = { type: "GET_ACCOUNT", payload: undefined };

      chrome.runtime.sendMessage.mockImplementation((message, callback) => {
        //@ts-ignore
        callback(response);
      });

      //@ts-ignore
      const account = await getAccount(chrome.runtime, 123);

      expect(chrome.runtime.sendMessage).toBeCalledWith(message, expect.anything());
      expect(account).toBeNull();
    });
  });

  describe("setAccount", () => {
    test("sends a message to the background script", async () => {
      const message = { type: "SET_ACCOUNT", payload: { id: 123, name: "test" } };
      const response = { type: "SET_ACCOUNT" };

      chrome.runtime.sendMessage.mockImplementation((message, callback) => {
        //@ts-ignore
        callback(response);
      });

      // @ts-ignore
      await setAccount(chrome.runtime, { id: 123, name: "test" });

      expect(chrome.runtime.sendMessage).toBeCalledWith(message, expect.anything());
    });
  });

  describe("updateAccountProperties", () => {
    test("returns the updated account", async () => {
      const message = { type: "UPDATE_ACCOUNT_PROPERTIES", payload: { id: 123, name: "test", color: "#ff0000" } };
      const response = { type: "UPDATE_ACCOUNT_PROPERTIES", payload: { id: 123, name: "test", color: "#ff0000" } };

      chrome.runtime.sendMessage.mockImplementation((message, callback) => {
        //@ts-ignore
        callback(response);
      });

      // @ts-ignore
      const account = await updateAccountProperties(chrome.runtime, { id: 123, name: "test", color: "#ff0000" });

      expect(chrome.runtime.sendMessage).toBeCalledWith(message, expect.anything());
      expect(account).toEqual({ id: 123, name: "test", color: "#ff0000" });
    });
  });
});
