function transformColoredText(text) {
  const gradientPattern = /{([^}]*)}(.*?){}/g;
  const gradientMatches = text.matchAll(gradientPattern);
  for (const gradientMatch of gradientMatches) {
    const gradientColors = gradientMatch[1].split('-');
    const gradientContent = gradientMatch[2];
    const colorStops = gradientColors.map((color, index) => `${color} ${(index / (gradientColors.length - 1)) * 100}%`);

    const gradientStyle = `linear-gradient(to right, ${colorStops.join(', ')})`;
    const gradientReplacement = `<span style="background-image: ${gradientStyle}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${gradientContent}</span>`;
    text = text.replace(gradientMatch[0], gradientReplacement);
  }
  const nonGradientPattern = /\[(.*?)\](.*?)\[\]/g;
  const nonGradientMatches = text.matchAll(nonGradientPattern);
  for (const nonGradientMatch of nonGradientMatches) {
    const colorTag = nonGradientMatch[1];
    const content = nonGradientMatch[2];
    const replacement = `<span style="color: ${colorTag}">${content}</span>`;
    text = text.replace(nonGradientMatch[0], replacement);
  }
  return text;
}
function observeNewElements(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const addedElements = mutation.addedNodes;
      for (const addedElement of addedElements) {
        if (addedElement instanceof HTMLElement) {
          const divElements = addedElement.querySelectorAll('div.messageContent-2t3eCI');
          divElements.forEach(element => {
            if (!element.dataset.transformed) {
              element.innerHTML = transformColoredText(element.innerHTML);
              element.dataset.transformed = true;
            }
          });
        }
      }
    }
  }
}
const observer = new MutationObserver(observeNewElements);
const observerConfig = { childList: true, subtree: true };
observer.observe(document.body, observerConfig);
