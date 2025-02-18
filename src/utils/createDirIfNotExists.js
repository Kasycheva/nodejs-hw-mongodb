import fs from "fs/promises";

export const createDirIfNotExists = async (dir) => {
  try {
    await fs.access(dir);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};
