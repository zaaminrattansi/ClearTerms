export function extractVisibleText(): string {
  function getTextFromNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node as Text).data;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = (node as Element).tagName.toLowerCase();
      if (["script", "style", "noscript"].includes(tag)) return '';
      let text = '';
      node.childNodes.forEach(child => {
        text += getTextFromNode(child);
      });
      return text;
    }
    return '';
  }
  return getTextFromNode(document.body).replace(/\s+/g, ' ').trim();
} 