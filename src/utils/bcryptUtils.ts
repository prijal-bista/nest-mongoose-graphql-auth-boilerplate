import * as bcrypt from 'bcrypt';

export const hash = async (input: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedOutput = await bcrypt.hash(input, salt);
  return hashedOutput;
};

export const verifyHash = (
  plainText: string,
  hashedText: string,
): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedText);
};
