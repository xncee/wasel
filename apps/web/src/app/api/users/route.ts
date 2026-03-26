import { NextResponse } from "next/server";
import { createUser, getUserByEmail, getUserWithPosts } from "@/lib/drizzle";

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        // Check if user exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 },
            );
        }

        // Create new user
        const newUser = await createUser({
            email,
            name,
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 },
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const email = searchParams.get("email");

        if (userId) {
            const userWithPosts = await getUserWithPosts(parseInt(userId));
            return NextResponse.json(userWithPosts);
        }

        if (email) {
            const user = await getUserByEmail(email);
            console.log("Fetched user:", user);
            return NextResponse.json(user);
        }

        return NextResponse.json(
            { error: "userId or email query parameter required" },
            { status: 400 },
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 },
        );
    }
}
