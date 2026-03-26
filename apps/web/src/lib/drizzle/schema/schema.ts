import {
    pgTable,
    text,
    varchar,
    timestamp,
    boolean,
    integer,
    serial,
} from "drizzle-orm/pg-core";

// Example users table (separate from Better Auth users)
export const users = pgTable("app_users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 255 }),
    bio: text("bio"),
    role: varchar("role", { length: 50 }).default("user").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Example posts table
export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
