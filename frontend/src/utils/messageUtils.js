export const parseMessage = (content) => {
  const thinkRegex = /<think>(.*?)<\/think>/s;
  const match = content.match(thinkRegex);
  if (match) {
    const reasoning = match[1].trim();
    const answer = content.replace(thinkRegex, "").trim();
    return { reasoning, answer };
  }
  return { reasoning: '', answer: content };
};
