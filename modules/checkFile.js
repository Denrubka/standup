import fs from "node:fs/promises";
export const checkFile = async (path, createIfMissing) => {
  if (createIfMissing) {
    try {
      await fs.access(path);
    } catch (error) {
      await fs.writeFile("clients.json", JSON.stringify([]));
      console.error(`Файл ${path} был создан!`);
      return false;
    }
  }

  try {
    await fs.access(path);
  } catch (error) {
    console.error(`Файл ${path} не найден!`);
    return false;
  }

  return true;
};
