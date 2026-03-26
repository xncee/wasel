import Link from "next/link";
import { getTranslations } from "next-intl/server";

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "home" });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
            <h1 className="text-3xl font-semibold">{t("title")}</h1>
            <p className="text-zinc-600">{t("description")}</p>

            <div className="flex items-center gap-4 text-sm">
                <Link href={`/${locale}/auth/signin`} className="underline">
                    {t("signIn")}
                </Link>
                <Link href={`/${locale}/auth/signup`} className="underline">
                    {t("signUp")}
                </Link>
                <Link href={`/${locale}/dashboard`} className="underline">
                    {t("dashboard")}
                </Link>
            </div>
        </main>
    );
}
