export function convertToKey(str: string) {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let words = str.split(/\s+/);

  let camelCaseStr = words
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");

  return camelCaseStr.replaceAll("?", "").replaceAll("!", "");
}
