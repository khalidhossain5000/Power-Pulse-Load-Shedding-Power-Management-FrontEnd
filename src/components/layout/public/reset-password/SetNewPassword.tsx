/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LockOpen,
  ShieldCheck,
} from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useResetPassword } from "@/hooks";
import { toast } from "sonner";


// full circle (r = 46) starting at 3 o'clock, drawn clockwise
const RING_PATH = "M96 50a46 46 0 1 1-92 0a46 46 0 1 1 92 0";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.09,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const strengthLevels = [
  {
    label: "Not set yet",
    text: "text-muted-foreground",
    stroke: "stroke-border",
  },
  { label: "Weak", text: "text-destructive", stroke: "stroke-destructive" },
  { label: "Fair", text: "text-chart-4", stroke: "stroke-chart-4" },
  { label: "Good", text: "text-chart-3", stroke: "stroke-chart-3" },
  { label: "Strong", text: "text-chart-2", stroke: "stroke-chart-2" },
];

const SetNewPassword = ({ email }: { email: string }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const checks = [
    { label: "8+ characters", passed: password.length >= 8 },
    {
      label: "Upper & lower case",
      passed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    { label: "A number", passed: /\d/.test(password) },
    { label: "A symbol", passed: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((check) => check.passed).length;
  const level = strengthLevels[score];
  const isLocked = score >= 3;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPassword = new FormData(e.currentTarget).get(
      "newPassword"
    ) as string;

    if (!email) {
      toast.error("Email is not found Try Again");
      return;
    }

    const payload = {
      email,
      newPassword,
    };

    resetPassword(payload, {
      onSuccess: () => {
        toast("Password Reset successfully!", {
          description: "You can now login using your latest password",
          action: {
            label: "OK",
            onClick: () => {},
          },
          duration: Infinity,
        });

   
      },

      onError: (err: any) => {
        console.log(
          err,
          "error in otp Sending",
          err?.data?.message || err?.response?._data?.message
        );

        toast.error(
          err?.data?.message ||
            err?.response?._data?.message ||
            "Something went wrong while OTP sending"
        );
      },
    });
  };
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-16">
        {/* Dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
        />

        {/* Ambient glows */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 -z-10 size-96 rounded-full bg-chart-2/15 blur-3xl"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Card with rotating border beam */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-md overflow-hidden rounded-3xl p-px shadow-2xl shadow-primary/20"
        >
          <motion.div
            aria-hidden
            className="absolute -inset-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_290deg,var(--primary)_330deg,var(--chart-1)_360deg)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card px-6 py-10 text-center sm:px-10">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 size-56 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
            />

            {/* Lock with strength ring */}
            <motion.div
              variants={itemVariants}
              className="relative mx-auto size-28"
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full -rotate-90"
                aria-hidden
              >
                <path
                  d={RING_PATH}
                  fill="none"
                  strokeWidth="3"
                  className="stroke-border"
                />
                <motion.path
                  d={RING_PATH}
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={cn("transition-colors duration-300", level.stroke)}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: score / 4,
                    opacity: score === 0 ? 0 : 1,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>

              {/* Burst when the lock closes */}
              {isLocked && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-chart-1"
                  initial={{ scale: 0.7, opacity: 0.7 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              )}

              <div className="absolute inset-4 flex items-center justify-center">
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
                  animate={{
                    opacity: [0.35, 0.9, 0.35],
                    scale: [0.9, 1.15, 0.9],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative flex size-full items-center justify-center rounded-full border border-primary/30 bg-linear-to-br from-primary/20 to-primary/5 backdrop-blur-md dark:border-chart-1/30">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isLocked ? "locked" : "open"}
                      initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.5, rotate: 20, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 18,
                      }}
                    >
                      {isLocked ? (
                        <Lock
                          className="size-8 text-primary dark:text-chart-1"
                          strokeWidth={1.75}
                        />
                      ) : (
                        <LockOpen
                          className="size-8 text-primary dark:text-chart-1"
                          strokeWidth={1.75}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="mt-7 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Set a{" "}
              <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent dark:from-chart-1 dark:to-chart-2">
                new password
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base"
            >
              You are verified. Choose a strong password to keep your PowerPulse
              account safe.
            </motion.p>

            {/* Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="mt-8 space-y-5 text-left"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="new-password"
                  className="text-sm font-medium text-foreground"
                >
                  New password
                </Label>

                <div className="group relative">
                  <div
                    aria-hidden
                    className="absolute -inset-0.5 rounded-xl bg-linear-to-r from-primary/0 via-primary/50 to-chart-1/0 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-100"
                  />
                  <KeyRound className="absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary dark:group-focus-within:text-chart-1" />
                  <Input
                    id="new-password"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your new password"
                    className="relative h-12 rounded-xl border-border bg-background pl-10 pr-11 shadow-sm transition-all placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Strength checks */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Password strength:{" "}
                  <span
                    className={cn(
                      "font-semibold transition-colors",
                      level.text
                    )}
                  >
                    {level.label}
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {checks.map((check) => (
                    <div
                      key={check.label}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors duration-300",
                        check.passed
                          ? "border-primary/30 bg-primary/10 text-foreground"
                          : "border-border bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                          check.passed
                            ? "border-transparent bg-primary text-primary-foreground dark:bg-chart-1 dark:text-background"
                            : "border-border"
                        )}
                      >
                        {check.passed && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 20,
                            }}
                          >
                            <Check className="size-2.5" strokeWidth={3} />
                          </motion.span>
                        )}
                      </span>
                      {check.label}
                    </div>
                  ))}
                </div>
              </div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="group/btn relative h-12 w-full cursor-pointer gap-2 overflow-hidden rounded-xl text-base font-semibold shadow-lg shadow-primary/30 disabled:cursor-not-allowed"
                >
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-primary-foreground/30 to-transparent"
                    initial={{ x: "-150%" }}
                    animate={{ x: "450%" }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: "easeInOut",
                    }}
                  />
                  <ShieldCheck className="relative size-4" />
                  <span className="relative"> {isPending ? "Resetting Password...." : "Reset Password" }</span>
                </Button>
              </motion.div>
            </motion.form>

            {/* Back to login */}
            <motion.div variants={itemVariants} className="mt-6">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary dark:hover:text-chart-1"
              >
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to login
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
};

export default SetNewPassword;
