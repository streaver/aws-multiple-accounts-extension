export default async function waitForElement(selector: string): Promise<Element> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);

      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  });
}
