import Link from "next/link";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "dashboard" });
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-4 px-6">
            <h1 className="text-3xl font-semibold">{t("title")}</h1>
            <p className="text-zinc-600">{t("description")}</p>
            <p className="text-sm text-zinc-700">
                {t("signedInAs")}{" "}
                <span className="font-medium">{session?.user.email}</span>
            </p>

            <div className="flex items-center gap-4">
                <SignOutButton locale={locale} />
                <Link href={`/${locale}`} className="text-sm underline">
                    {t("backHome")}
                </Link>
            </div>
        </main>
    );
}
