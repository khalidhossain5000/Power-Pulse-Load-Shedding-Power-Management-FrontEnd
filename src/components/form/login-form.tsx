"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "../ui/field";
import { loginSchema } from "@/validation";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { useLogin } from "@/hooks";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import GoogleLoginComponet from "../modules/google/GoogleComponent";
import { getSafeRedirect, withRedirect } from "@/lib/redirect";
import type { TUserRole } from "@/types";

type QuickLoginAccounts = Record<TUserRole, { email: string; password: string }>;

const quickLoginOptions = [
  { role: "ADMIN", label: "Admin", icon: ShieldCheck },
  { role: "CUSTOMER", label: "Customer", icon: UserRound },
  { role: "TECHNICIAN", label: "Technician", icon: Wrench },
] as const;

export default function LoginForm({ quickLoginAccounts }: { quickLoginAccounts: QuickLoginAccounts }) {
  const [showPassword, setShowPassword] = useState(false);
  const [signingInAs, setSigningInAs] = useState<TUserRole | null>(null);
  const { mutate: login, isPending } = useLogin()
  const router = useRouter()
  const searchParams = useSearchParams();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => submitLogin(value),
  });

  const submitLogin = (credentials: { email: string; password: string }, role?: TUserRole) => {
    setSigningInAs(role ?? null);
    login(credentials, {
      onSuccess: (res) => {
        console.log(res,"login res")
        setSigningInAs(null);
        toast.success(res.message || "User login successful");
        router.replace(getSafeRedirect(searchParams.get("redirect")));
      },
      onError: (error) => {
        setSigningInAs(null);
        const loginError = error as { data?: { message?: string }; message?: string };
        toast.error(loginError.data?.message || loginError.message || "Login failed. Please try again.");
      },
    });
  };

  const isSubmitting = isPending || signingInAs !== null;

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    autoComplete="username"
                    aria-invalid={isInvalid}
                    className="bg-background rounded-xl shadow-sm "
                    placeholder="Enter Your Email Address"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Link
                      href="/reset-password"
                      className="text-xs font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="current-password"
                      aria-invalid={isInvalid}
                      className="h-12 rounded-xl border-border bg-background pr-10 shadow-sm transition-shadow focus-visible:ring-primary/20"
                      placeholder="Enter Your Password"
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />

                      ) : (
                        <Eye className="size-4" />

                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">Quick login</p>
              <span className="text-xs text-muted-foreground">Choose a role</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quickLoginOptions.map(({ role, label, icon: Icon }) => (
                <Button
                  key={role}
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || !quickLoginAccounts[role].email || !quickLoginAccounts[role].password}
                  onClick={() => submitLogin(quickLoginAccounts[role], role)}
                  className="h-auto min-h-16 min-w-0 flex-col gap-1.5 rounded-xl border-border/70 bg-background px-2 py-2.5 text-xs font-medium text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer"
                >
                  {signingInAs === role ? <Spinner /> : <Icon aria-hidden="true" className="size-4" />}
                  <span className="truncate">{signingInAs === role ? "Signing in" : label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="min-h-12 w-full cursor-pointer rounded-xl font-semibold shadow-sm transition-transform hover:-translate-y-0.5">
            {isPending && <Spinner />}
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </FieldGroup>

      </form>

      <FieldSeparator>Or continue with</FieldSeparator>

      <GoogleLoginComponet />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={withRedirect("/select-role", searchParams.get("redirect"))}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
        >
          Register
        </Link>
      </p>

    </div>
  );
}