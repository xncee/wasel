// Re-export database client
export { db } from "./db";

// Re-export schema tables
export { users, posts } from "./schema/schema";

// Re-export relations
export { usersRelations, postsRelations } from "./schema/relations";

// Re-export query functions
export {
    getUserByEmail,
    createUser,
    getUserWithPosts,
    createPost,
    getPublishedPosts,
    updateUser,
    deletePost,
} from "./queries/users";
