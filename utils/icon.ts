import * as mdiIcons from "@mdi/js";

function convertToKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function getIcons(query: string): { name: string; value: string }[] {
  const formattedIcons = Object.keys(mdiIcons).map((e) => ({
    name: convertToKebabCase(e).replace("mdi-", ""),
    value: convertToKebabCase(e).replace("mdi-", ""),
  }));

  const filteredIcons = formattedIcons.filter((icon) =>
    icon.name.includes(query.toLowerCase()),
  );

  return filteredIcons.slice(0, 20);
}
