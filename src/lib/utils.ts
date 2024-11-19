import { randomBytes, randomUUID } from "crypto";

export const generateUserId = () => {
  return randomUUID();
};

export const generateVerificationToken = () => {
  return randomBytes(32).toString("hex");
};

export const normalizeEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  if (domain === "gmail.com") {
    return localPart.replace(/\./g, "") + "@" + domain;
  }
  return email; // Leave non-Gmail emails untouched
};
