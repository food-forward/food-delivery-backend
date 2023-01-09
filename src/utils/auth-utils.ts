import bcrypt from "bcrypt";

export const getSalt = async () => {
  return await bcrypt.genSalt();
};

export const getEncryptedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
