import { relations } from "drizzle-orm";
import { users, posts } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
    user: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
}));
