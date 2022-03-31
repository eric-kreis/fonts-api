const kebabCaseSerializer = (payload: string) => {
  const lowerWithoutSpaces = payload.toLowerCase().trim();
  const words = lowerWithoutSpaces.split(' ');
  const notEmptyWords = words.filter((word) => word);
  return notEmptyWords.join('-');
};

export default kebabCaseSerializer;
