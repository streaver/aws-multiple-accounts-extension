export default async function waitForElement(selector: string): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
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
  });
}
