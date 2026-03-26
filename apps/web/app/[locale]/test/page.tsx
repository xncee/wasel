import { getTranslations } from "next-intl/server";

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function TestPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "test" });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
            <h1 className="text-3xl font-semibold">{t("title")}</h1>
            <p className="text-zinc-600">{t("message")}</p>
            <p className="text-sm text-zinc-500">Locale: {locale}</p>
        </main>
    );
}
