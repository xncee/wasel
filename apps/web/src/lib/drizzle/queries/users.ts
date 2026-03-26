import { db } from "../db";
import { users, posts } from "../schema/schema";
import { eq } from "drizzle-orm";

// Get user by email
export async function getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    return user;
}

// Create a new user
export async function createUser(data: {
    email: string;
    name?: string;
    bio?: string;
}) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
}

// Get user with their posts
export async function getUserWithPosts(userId: number) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            posts: true,
        },
    });
    return user;
}

// Create a post
export async function createPost(data: {
    userId: number;
    title: string;
    content: string;
    published?: boolean;
}) {
    const result = await db.insert(posts).values(data).returning();
    return result[0];
}

// Get all published posts
export async function getPublishedPosts() {
    const allPosts = await db.query.posts.findMany({
        where: eq(posts.published, true),
        with: {
            user: true,
        },
    });
    return allPosts;
}

// Update user
export async function updateUser(
    userId: number,
    data: Partial<typeof users.$inferInsert>,
) {
    const result = await db
        .update(users)
        .set(data)
        .where(eq(users.id, userId))
        .returning();
    return result[0];
}

// Delete post
export async function deletePost(postId: number) {
    await db.delete(posts).where(eq(posts.id, postId));
}
