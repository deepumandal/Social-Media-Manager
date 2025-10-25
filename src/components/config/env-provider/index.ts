import { config } from "dotenv";

config();
type envKey = "";

export const getOrThrowEnv = (key: envKey): string => {
  const env = process.env[key];
  if (typeof env === "undefined" && process.env.NODE_ENV === "development") {
    throw new Error(`${key} is not defined`);
  }
  return process.env[key] as string;
};
