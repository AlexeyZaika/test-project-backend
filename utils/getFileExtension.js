export default (string) => {
  const lastIndex = string.lastIndexOf('.');

  return string.substring(lastIndex);
}
