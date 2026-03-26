import type { Config } from "drizzle-kit";

export default {
    out: "./drizzle/migrations",
    schema: "./src/lib/drizzle/schema/index.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "",
    },
    schemaFilter: ["public"],
    verbose: true,
    strict: true,
} satisfies Config;
