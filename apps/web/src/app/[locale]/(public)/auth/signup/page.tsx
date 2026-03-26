"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
    const params = useParams<{ locale: string }>();
    const locale = params.locale ?? "en";
    const router = useRouter();
    const t = useTranslations("auth.signup");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const { error: signUpError } = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: `/${locale}/dashboard`,
        });

        setIsSubmitting(false);

        if (signUpError) {
            setError(signUpError.message || t("errorGeneric"));
            return;
        }

        router.replace(`/${locale}/dashboard`);
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
            <h1 className="mb-2 text-3xl font-semibold">{t("title")}</h1>
            <p className="mb-8 text-sm text-zinc-600">{t("description")}</p>

            <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                    <span className="mb-1 block text-sm font-medium">
                        {t("name")}
                    </span>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        className="w-full rounded-md border border-zinc-300 px-3 py-2"
                    />
                </label>

                <label className="block">
                    <span className="mb-1 block text-sm font-medium">
                        {t("email")}
                    </span>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="w-full rounded-md border border-zinc-300 px-3 py-2"
                    />
                </label>

                <label className="block">
                    <span className="mb-1 block text-sm font-medium">
                        {t("password")}
                    </span>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        minLength={8}
                        className="w-full rounded-md border border-zinc-300 px-3 py-2"
                    />
                </label>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-60"
                >
                    {isSubmitting ? t("submitting") : t("submit")}
                </button>
            </form>

            <p className="mt-6 text-sm text-zinc-600">
                {t("hasAccount")}{" "}
                <Link
                    href={`/${locale}/auth/signin`}
                    className="font-medium text-zinc-900 underline"
                >
                    {t("goToSignIn")}
                </Link>
            </p>
        </main>
    );
}
