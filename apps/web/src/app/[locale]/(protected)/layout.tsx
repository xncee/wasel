import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function ProtectedLayout({ children, params }: Props) {
    const { locale } = await params;
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect(`/${locale}/auth/signin`);
    }

    return <>{children}</>;
}
