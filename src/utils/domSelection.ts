import waitForElement from "./waitForElement";

export async function getPortalElement(): Promise<Element> {
  return waitForElement('portal-application[title="AWS Account"]');
}

export async function getAccountElements(): Promise<Element[]> {
  // It waits for the first element to be rendered, then it returns all the elements
  await waitForElement("portal-instance");

  return Array.from(document.querySelectorAll("portal-instance"));
}

export async function getAccountProfileElements(account: Element): Promise<Element[]> {
  // It waits for the first element to be rendered, then it returns all the elements
  await waitForElement("portal-profile", account);

  return Array.from(account.querySelectorAll("portal-profile"));
}
