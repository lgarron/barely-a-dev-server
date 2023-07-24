import { stat, readdir } from "node:fs/promises";
import { join } from "node:path";

export async function listFiles(folderPath, filter, relativePath) {
  const childNames = await readdir(
    relativePath ? join(folderPath, relativePath) : folderPath,
  );

  const ownMatches = [];
  let recursiveMatches = [];
  for (const childName of childNames) {
    const newRelativePath = relativePath
      ? join(relativePath, childName)
      : childName;
    if ((await stat(join(folderPath, newRelativePath))).isDirectory()) {
      recursiveMatches = recursiveMatches.concat(
        await listFiles(folderPath, filter, newRelativePath),
      );
    } else if (filter(newRelativePath)) {
      ownMatches.push(newRelativePath);
    }
  }
  return ownMatches.concat(recursiveMatches);
}
