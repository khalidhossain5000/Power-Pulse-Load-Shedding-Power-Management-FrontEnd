/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Zap, Mail, ArrowRight, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

// ভাসমান bolt গুলোর fixed position (hydration mismatch এড়াতে random ব্যবহার করিনি)
const FLOATING_BOLTS = [
  { top: "12%", left: "8%", size: 22, delay: 0, duration: 6 },
  { top: "22%", left: "86%", size: 30, delay: 1, duration: 7 },
  { top: "68%", left: "6%", size: 28, delay: 2, duration: 8 },
  { top: "80%", left: "82%", size: 20, delay: 0.5, duration: 6.5 },
  { top: "45%", left: "92%", size: 16, delay: 1.5, duration: 5.5 },
  { top: "8%", left: "52%", size: 18, delay: 2.5, duration: 7.5 },
  { top: "88%", left: "40%", size: 24, delay: 3, duration: 6 },
];

const container: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
      staggerChildren: 0.1,
      delayChildren: 0.25,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);

  // 3D tilt effect (mouse এর সাথে card ঘুরবে)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 120, damping: 14 });
  const smy = useSpring(my, { stiffness: 120, damping: 14 });
  const rotateX = useTransform(smy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smx, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Glowing orbs */}
      <motion.div
        className="pointer-events-none absolute -left-24 -top-24 size-[420px] rounded-full bg-primary/25 blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -right-24 size-[480px] rounded-full bg-chart-2/25 blur-3xl"
        animate={{ x: [0, -90, 0], y: [0, -50, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 size-[300px] -translate-x-1/2 rounded-full bg-chart-1/20 blur-3xl"
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating bolts */}
      {FLOATING_BOLTS.map((b, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-primary/30"
          style={{ top: b.top, left: b.left }}
          animate={{ y: [0, -28, 0], rotate: [0, 15, -15, 0], opacity: [0.25, 0.7, 0.25] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Zap size={b.size} fill="currentColor" />
        </motion.div>
      ))}

      {/* Card wrapper (perspective for 3D tilt) */}
      <div className="relative z-10 w-full max-w-md [perspective:1200px]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative overflow-hidden rounded-2xl p-[1.5px] shadow-2xl shadow-primary/20"
        >
          {/* Rotating gradient border */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="aspect-square w-[200%] shrink-0"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, var(--primary) 18%, var(--chart-1) 30%, transparent 45%, transparent 100%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Card body */}
          <div className="relative rounded-[calc(1rem-1.5px)] bg-card p-7 text-card-foreground sm:p-9">
            {/* Icon with pulse rings */}
            <motion.div variants={item} className="mb-6 flex justify-center">
              <div className="relative flex size-20 items-center justify-center">
                {[0, 1].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-primary/50"
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{
                      duration: 2.4,
                      delay: i * 1.2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}
                <motion.div
                  className="relative flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                  animate={{ rotate: [0, -6, 6, -6, 0], y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.15, rotate: 12 }}
                >
                  <KeyRound className="size-8" />
                  <motion.span
                    className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-background text-primary shadow"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <Zap className="size-3.5" fill="currentColor" />
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={item} className="mb-7 space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Forgot your{" "}
                <span className="relative inline-block text-primary">
                  password?
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
                  />
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                No worries! Enter your email and we&apos;ll send you a link to reset it.
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <motion.div variants={item} className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>

                <div className="relative">
                  {/* Focus glow */}
                  <motion.div
                    className="absolute -inset-1 rounded-xl bg-primary/30 blur-md"
                    animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.96 }}
                    transition={{ duration: 0.25 }}
                  />
                  <div className="relative">
                    <motion.span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      animate={{
                        color: focused ? "var(--primary)" : "var(--muted-foreground)",
                        scale: focused ? 1.15 : 1,
                        rotate: focused ? [0, -12, 12, 0] : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <Mail className="size-[18px]" />
                    </motion.span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Submit button */}
              <motion.div variants={item}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30"
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/25"
                    initial={{ x: "-150%" }}
                    animate={{ x: "450%" }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative">Send Reset Link</span>
                  <motion.span
                    className="relative"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="size-4" />
                  </motion.span>
                </motion.button>
              </motion.div>
            </form>

            {/* Back to login */}
            <motion.div variants={item} className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <motion.span whileHover={{ x: -4 }}>
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                </motion.span>
                Back to login
              </Link>
            </motion.div>

            {/* Secure note */}
            <motion.div
              variants={item}
              className="mt-6 flex items-center justify-center gap-2 border-t pt-5 text-xs text-muted-foreground"
            >
              <ShieldCheck className="size-4 text-primary" />
              Secured by PowerPulse
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;