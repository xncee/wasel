import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const betterAuthSecret =
    process.env.BETTER_AUTH_SECRET || "dev-only-change-this-secret-key-0001";
const betterAuthUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error(
        "DATABASE_URL is not set. Please configure Neon connection string.",
    );
}

const pool = new Pool({
    connectionString: databaseUrl,
});

export const auth = betterAuth({
    secret: betterAuthSecret,
    baseURL: betterAuthUrl,
    database: pool,
    emailAndPassword: {
        enabled: true,
    },
    plugins: [nextCookies()],
});
