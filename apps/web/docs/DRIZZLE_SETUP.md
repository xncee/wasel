# Drizzle ORM Configuration Guide

This project uses **Drizzle ORM** for type-safe database operations alongside **Better Auth** for authentication.

## Setup Overview

### Files Created

1. **`drizzle.config.ts`** - Drizzle configuration
2. **`src/lib/db.ts`** - Database client initialization
3. **`src/lib/schema.ts`** - Database schema definitions
4. **`src/lib/queries.ts`** - Example query functions
5. **`src/app/api/users/route.ts`** - Example API route using Drizzle

### Installed Packages

- `drizzle-orm@latest` - ORM library
- `drizzle-kit@latest` - CLI tool for migrations and schema management

## Database Schema

### Current Tables

#### `app_users`
- `id` - Serial primary key
- `email` - Unique email address
- `name` - User's name (optional)
- `bio` - User biography (optional)
- `role` - User role (default: 'user')
- `isActive` - Account status (default: true)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### `posts`
- `id` - Serial primary key
- `userId` - Foreign key referencing app_users
- `title` - Post title
- `content` - Post content
- `published` - Publication status (default: false)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Available Commands

### Development

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply pending migrations to database
npm run db:migrate

# Open Drizzle Studio (visual database explorer)
npm run db:studio
```

### Important Note

Use `npm run db:migrate` instead of `npm run db:push` to avoid interfering with Better Auth's managed tables (user, session, account, verification).

## Usage Examples

### Querying Users

```typescript
import { db } from "@/lib/db";
import { getUserByEmail, getUserWithPosts } from "@/lib/queries";

// Fetch user by email
const user = await getUserByEmail("user@example.com");

// Get user with all their posts
const userWithPosts = await getUserWithPosts(userId);
```

### Creating Records

```typescript
import { createUser, createPost } from "@/lib/queries";

// Create a user
const newUser = await createUser({
    email: "new@example.com",
    name: "John Doe",
    bio: "Software developer",
});

// Create a post
const post = await createPost({
    userId: newUser.id,
    title: "My First Post",
    content: "This is the content...",
    published: true,
});
```

### Updating Records

```typescript
import { updateUser } from "@/lib/queries";

await updateUser(userId, {
    name: "Updated Name",
    bio: "Updated bio",
});
```

### Using in API Routes

```typescript
import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/queries";

export async function POST(request: Request) {
    const { email, name } = await request.json();

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return NextResponse.json(
            { error: "User already exists" },
            { status: 400 }
        );
    }

    const newUser = await createUser({ email, name });
    return NextResponse.json(newUser, { status: 201 });
}
```

## Schema Management

### Adding New Tables

1. **Update `src/lib/schema.ts`:**

```typescript
import { pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }),
    author: varchar("author", { length: 255 }),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow(),
});
```

2. **Generate migration:**
```bash
npm run db:generate
```

3. **Review generated SQL** in `drizzle/` folder

4. **Apply migration:**
```bash
npm run db:migrate
```

### Modifying Existing Tables

1. Update the table definition in `src/lib/schema.ts`
2. Run `npm run db:generate`
3. Review the generated migration
4. Run `npm run db:migrate`

## Important Notes

### Better Auth Integration

This project uses **Better Auth** for authentication with its own managed tables:
- `user` - Better Auth users
- `session` - Active sessions
- `account` - OAuth/provider accounts
- `verification` - Email verification tokens

**Never** use `npm run db:push` as it will try to delete these tables. Always use `npm run db:migrate` for schema changes.

### Type Safety

Drizzle provides full TypeScript support:

```typescript
// Types are automatically inferred
import { users } from "@/lib/schema";

type User = typeof users.$inferSelect; // For SELECT queries
type NewUser = typeof users.$inferInsert; // For INSERT queries
```

### Relations

Relations are defined using `relations()` for better type inference:

```typescript
export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));

// Use in queries
const userWithPosts = await db.query.users.findFirst({
    with: {
        posts: true,
    },
});
```

## Production Considerations

1. **Environment Variables**: Ensure `DATABASE_URL` is set in your environment
2. **Connection Pooling**: Already handled via Neon's pooler endpoint
3. **Migrations**: Run all pending migrations before deployment
4. **Backups**: Enable Neon's automatic backups

## Drizzle Studio

Open the visual database explorer:

```bash
npm run db:studio
```

This opens an interactive UI where you can:
- Browse your database schema
- View and edit records
- Run custom SQL queries
- Monitor connections

## Troubleshooting

### Migration Issues

If migrations fail, check:
1. `DATABASE_URL` is correctly set
2. Network connectivity to Neon
3. Generated SQL syntax in `drizzle/` folder

### Type Errors

For TypeScript errors with Drizzle:
1. Ensure `drizzle-orm` and `drizzle-kit` versions match
2. Run `npm install` to sync dependencies
3. Restart TypeScript server in your editor

## Further Learning

- [Drizzle Documentation](https://orm.drizzle.team/)
- [Drizzle React Query Integration](https://orm.drizzle.team/docs/integrations/react)
- [Better Auth Documentation](https://www.better-auth.com/)
