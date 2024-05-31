import bcrypt from "bcrypt";

export async function isValidPassword(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
