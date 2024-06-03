import path from "path";
import { fileURLToPath } from "url";

// Helper function to get the directory name in ES module
const getDirname = (meta) => {
  const __filename = fileURLToPath(meta.url);
  return path.dirname(__filename);
};

export default getDirname;
