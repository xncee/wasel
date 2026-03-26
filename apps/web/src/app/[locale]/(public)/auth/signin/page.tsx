"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
    const params = useParams<{ locale: string }>();
    const locale = params.locale ?? "en";
    const router = useRouter();
    const t = useTranslations("auth.signin");

    const [serverError, setServerError] = useState<string | null>(null);

    const formSchema = useMemo(
        () =>
            z.object({
                email: z.email(t("errorEmail")),
                password: z.string().min(8, t("errorPassword")),
            }),
        [t],
    );

    type FormValues = z.infer<typeof formSchema>;

    const resolver: Resolver<FormValues> = async (values) => {
        const result = formSchema.safeParse(values);

        if (result.success) {
            return {
                values: result.data,
                errors: {},
            };
        }

        return {
            values: {},
            errors: result.error.issues.reduce(
                (allErrors, issue) => {
                    const field = issue.path[0];

                    if (typeof field === "string") {
                        allErrors[field as keyof FormValues] = {
                            type: issue.code,
                            message: issue.message,
                        };
                    }

                    return allErrors;
                },
                {} as Partial<
                    Record<keyof FormValues, { type: string; message: string }>
                >,
            ),
        };
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver,
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const submitForm = handleSubmit(async (values) => {
        setServerError(null);

        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: `/${locale}/dashboard`,
        });

        if (error) {
            setServerError(error.message || t("errorGeneric"));
            return;
        }

        router.replace(`/${locale}/dashboard`);
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void submitForm(event);
    };

    return (
        <main className="grid min-h-screen place-items-center bg-muted/20 px-4 py-8">
            <div className={cn("flex w-full max-w-sm flex-col gap-6")}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {serverError ? (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTitle>{t("title")}</AlertTitle>
                                <AlertDescription>
                                    {serverError}
                                </AlertDescription>
                            </Alert>
                        ) : null}

                        <form method="post" onSubmit={onSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        {t("email")}
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder={t("emailPlaceholder")}
                                        aria-invalid={Boolean(errors.email)}
                                        required
                                        {...register("email")}
                                    />
                                    {errors.email?.message ? (
                                        <FieldDescription className="text-destructive">
                                            {errors.email.message}
                                        </FieldDescription>
                                    ) : null}
                                </Field>

                                <Field>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password">
                                            {t("password")}
                                        </FieldLabel>
                                        <Link
                                            href={`/${locale}`}
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            {t("forgotPassword")}
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder={t("passwordPlaceholder")}
                                        aria-invalid={Boolean(errors.password)}
                                        required
                                        {...register("password")}
                                    />
                                    {errors.password?.message ? (
                                        <FieldDescription className="text-destructive">
                                            {errors.password.message}
                                        </FieldDescription>
                                    ) : null}
                                </Field>

                                <Field>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full"
                                    >
                                        {isSubmitting
                                            ? t("submitting")
                                            : t("submit")}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        {t("submitGoogle")}
                                    </Button>
                                    <FieldDescription className="text-center">
                                        {t("noAccount")}{" "}
                                        <Link
                                            href={`/${locale}/auth/signup`}
                                            className="underline underline-offset-4"
                                        >
                                            {t("createAccount")}
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
