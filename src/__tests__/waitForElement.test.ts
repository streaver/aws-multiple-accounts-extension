/**
 * @jest-environment jsdom
 */

import waitForElement from "../utils/waitForElement";

describe("waitForElement", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("waits for the element to appear", async () => {
    const element = document.createElement("div");
    element.id = "test-element";

    setTimeout(() => {
      document.body.appendChild(element);
    }, 0);

    const result = await waitForElement("#test-element");
    expect(result).toBe(element);
  });

  test("the dom changes but the element does not appear", async () => {
    const element = document.createElement("div");
    element.id = "test-element";

    setTimeout(() => {
      document.body.appendChild(element);
    }, 0);

    await expect(waitForElement("#test-element-2")).rejects.toThrowError("Element #test-element-2 not found");
  });

  test("throws an error if the element does not appear within a certain time", async () => {
    await expect(waitForElement("#test-element")).rejects.toThrowError("Element #test-element not found");
  });
});
