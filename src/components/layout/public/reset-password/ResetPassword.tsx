"use client";

import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-react";
import { MotionConfig, motion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      delayChildren: 0.25,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const particles = [
  { pos: "left-[5%]", size: "size-1", delay: 0, duration: 9 },
  { pos: "left-[13%]", size: "size-1.5", delay: 2.2, duration: 11 },
  { pos: "left-[22%]", size: "size-1", delay: 4.1, duration: 8 },
  { pos: "left-[31%]", size: "size-1.5", delay: 1.2, duration: 10 },
  { pos: "left-[42%]", size: "size-1", delay: 5.4, duration: 12 },
  { pos: "left-[54%]", size: "size-1.5", delay: 0.6, duration: 9 },
  { pos: "left-[63%]", size: "size-1", delay: 3.3, duration: 11 },
  { pos: "left-[72%]", size: "size-1.5", delay: 6.2, duration: 8 },
  { pos: "left-[82%]", size: "size-1", delay: 1.8, duration: 10 },
  { pos: "left-[93%]", size: "size-1.5", delay: 4.7, duration: 12 },
];

const ResetPassword = () => {
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
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 -z-10 size-96 rounded-full bg-chart-2/15 blur-3xl"
          animate={{ opacity: [1, 0.4, 1], x: [0, -30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-2/3 -z-10 size-96 rounded-full bg-chart-4/15 blur-3xl"
          animate={{ opacity: [0.4, 0.9, 0.4], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Rising light particles */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {particles.map((particle) => (
            <motion.span
              key={particle.pos}
              className={`absolute bottom-0 rounded-full bg-chart-1 shadow-[0_0_8px_2px] shadow-chart-1/60 ${particle.pos} ${particle.size}`}
              initial={{ opacity: 0, y: "0vh" }}
              animate={{ opacity: [0, 1, 0], y: ["0vh", "-100vh"] }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Card with rotating border beam */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-md overflow-hidden rounded-3xl p-px shadow-2xl shadow-primary/20"
        >
          <motion.div
            aria-hidden
            className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_290deg,var(--primary)_330deg,var(--chart-1)_360deg)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card px-6 py-10 text-center sm:px-10">
            {/* Top hairline + inner glow */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 size-56 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
            />

            {/* Icon core */}
            <motion.div
              variants={itemVariants}
              className="relative mx-auto size-28"
            >
              {[0, 1].map((index) => (
                <motion.span
                  key={index}
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-chart-1/50"
                  animate={{ scale: [0.55, 1.4], opacity: [0.6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: index * 1.5,
                  }}
                />
              ))}

              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full border border-dashed border-primary/30 dark:border-chart-1/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                aria-hidden
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-chart-1 shadow-[0_0_12px_3px] shadow-chart-1/60" />
              </motion.div>

              <div className="absolute inset-5 flex items-center justify-center">
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative flex size-full items-center justify-center rounded-full border border-primary/30 bg-linear-to-br from-primary/20 to-primary/5 backdrop-blur-md dark:border-chart-1/30">
                  <motion.div
                    animate={{ rotate: [0, -14, 14, -8, 0, 0, 0] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <KeyRound
                      className="size-8 text-primary dark:text-chart-1"
                      strokeWidth={1.75}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="mt-7 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Forgot your{" "}
              <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent dark:from-chart-1 dark:to-chart-2">
                password?
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base"
            >
              No worries. Enter the email linked to your PowerPulse account and
              we will send you a one-time password (OTP) to verify it is you.
              Once verified, you can set a new password.
            </motion.p>

            {/* Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={(event) => event.preventDefault()}
              className="mt-8 space-y-5 text-left"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="reset-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address
                </Label>

                <div className="group relative">
                  <div
                    aria-hidden
                    className="absolute -inset-0.5 rounded-xl bg-linear-to-r from-primary/0 via-primary/50 to-chart-1/0 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-100"
                  />
                  <Mail className="absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary dark:group-focus-within:text-chart-1" />
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="relative h-12 rounded-xl border-border bg-background pl-10 shadow-sm transition-all placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  We&apos;ll send a one-time password (OTP) to this email.
                </p>
              </div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  className="group/btn relative h-12 w-full cursor-pointer gap-2 overflow-hidden rounded-xl text-base font-semibold shadow-lg shadow-primary/30"
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
                  <span className="relative">Send OTP</span>
                  <Send className="relative size-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-1" />
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

export default ResetPassword;