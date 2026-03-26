import * as React from "react";
import { cn } from "@/lib/utils";

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("grid gap-4", className)} {...props} />;
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("grid gap-2", className)} {...props} />;
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
    return (
        <label
            className={cn("text-sm leading-none font-medium", className)}
            {...props}
        />
    );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

export { Field, FieldDescription, FieldGroup, FieldLabel };
