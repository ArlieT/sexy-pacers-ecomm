import { randomBytes, randomUUID } from "crypto";

export const generateUserId = () => {
  return randomUUID();
};

export const generateVerificationToken = () => {
  return randomBytes(32).toString("hex");
};
