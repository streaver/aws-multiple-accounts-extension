export default async function waitForElement(
  selector: string,
  root: Element | Document = document,
  timeout: number = 2500,
): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const element = root.querySelector(selector);

      if (element) {
        observer.disconnect();
        resolve(element as HTMLElement);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();

      reject(new Error(`Element ${selector} not found`));
    }, timeout);
  });
}
