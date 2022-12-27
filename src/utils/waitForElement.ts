export default async function waitForElement(selector: string, timeout: number = 2500): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);

      if (element) {
        observer.disconnect();
        resolve(element as HTMLElement);
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();

      reject(new Error(`Element ${selector} not found`));
    }, timeout);
  });
}
