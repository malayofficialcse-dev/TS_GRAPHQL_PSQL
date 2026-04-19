import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;

  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const parsePort = (value: string, key: string) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${key} must be a valid port number`);
  }

  return parsed;
};

export const env = {
  port: parsePort(process.env.PORT ?? "5000", "PORT"),
  dbHost: getEnv("DB_HOST"),
  dbPort: parsePort(getEnv("DB_PORT"), "DB_PORT"),
  dbUser: getEnv("DB_USER"),
  dbPassword: getEnv("DB_PASSWORD"),
  dbName: getEnv("DB_NAME"),
  jwtSecret: getEnv("JWT_SECRET"),
};
