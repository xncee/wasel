"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";

type Props = {
    locale: string;
};

export function SignOutButton({ locale }: Props) {
    const router = useRouter();
    const t = useTranslations("dashboard");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSignOut = async () => {
        setIsSubmitting(true);
        await authClient.signOut();
        setIsSubmitting(false);
        router.replace(`/${locale}/auth/signin`);
    };

    return (
        <button
            type="button"
            onClick={onSignOut}
            disabled={isSubmitting}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
        >
            {isSubmitting ? t("signingOut") : t("signOut")}
        </button>
    );
}
