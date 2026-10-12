/** biome-ignore-all lint/a11y/noSvgWithoutTitle: decorative SVGs */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import { useGetMe } from "@/hooks";


const GRADIENT = "linear-gradient(135deg, var(--primary), var(--chart-3))";
const ACCENT = "var(--sidebar-primary)"; 
const GLOW = "color-mix(in oklch, var(--primary) 30%, transparent)";
const SHADOW =
  "0 30px 80px -30px color-mix(in oklch, var(--foreground) 35%, transparent)";
const BTN_SHADOW =
  "0 18px 40px -14px color-mix(in oklch, var(--primary) 70%, transparent)";
// তোমার থিমে সবুজ টোকেন নেই, তাই "Restored" এর জন্য আলাদা semantic সবুজ
const OK = "oklch(0.72 0.17 160)";
const OK_INK = "oklch(0.2 0.05 163)";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    title: "Report from your dashboard",
    text: "Signed in and the power just dropped? Open your dashboard and report the outage.",
  },
  {
    title: "Pay ৳1,299 once",
    text: "A single one-time priority fee. No subscription, nothing recurring.",
  },
  {
    title: "Your case jumps the queue",
    text: "It's flagged high priority and moved to the front for fast restoration.",
  },
];

type Ticket = { id: string; label: string; you?: boolean };

const TICKETS: Record<string, Ticket> = {
  a: { id: "a", label: "Report #4818" },
  b: { id: "b", label: "Report #4821" },
  c: { id: "c", label: "Report #4824" },
  you: { id: "you", label: "Your report", you: true },
  d: { id: "d", label: "Report #4830" },
};

const ORDER_WAITING = ["a", "b", "c", "you", "d"];
const ORDER_PRIORITY = ["you", "a", "b", "c", "d"];

const PHASE_MS = [2400, 2800, 3200];

const FLAT = "M0 30 H60 L75 30 L85 30 L100 30 L112 30 L122 30 H240";
const PULSE = "M0 30 H60 L75 30 L85 6 L100 54 L112 18 L122 30 H240";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

/* ------------------------------------------------------------------ */
/*  LIVE QUEUE: the one memorable moment                               */
/* ------------------------------------------------------------------ */
const RestoreQueue = ({ reduce }: { reduce: boolean }) => {
  const [phase, setPhase] = useState(reduce ? 2 : 0);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % 3), PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  const order = phase === 0 ? ORDER_WAITING : ORDER_PRIORITY;
  const restored = phase === 2;

  const status =
    phase === 0
      ? { text: "Outage reported. Waiting in the standard queue.", color: "var(--destructive)" }
      : phase === 1
        ? { text: "Priority fee paid. Moving to the front.", color: "var(--chart-2)" }
        : { text: "Power restored. Back online.", color: OK };

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border bg-card"
      style={{ boxShadow: SHADOW }}
    >
      {/* strike flash when the ticket jumps */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            key="flash"
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{ background: "var(--chart-2)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0, 0.16, 0] }}
            transition={{ duration: 0.9, delay: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* status header with live waveform */}
      <div className="flex items-center gap-4 border-b border-border bg-muted px-5 py-4 sm:px-6">
        <div className="relative grid h-3 w-3 place-items-center">
          <motion.span
            className="absolute h-3 w-3 rounded-full"
            animate={{ background: status.color }}
          />
          {!reduce && (
            <motion.span
              className="absolute h-3 w-3 rounded-full"
              animate={{ background: status.color, scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="truncate text-sm font-medium text-foreground"
            >
              {status.text}
            </motion.p>
          </AnimatePresence>
        </div>

        <svg viewBox="0 0 240 60" preserveAspectRatio="none" className="h-8 w-24 shrink-0 sm:w-32">
          <motion.path
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{
              d: phase === 0 ? FLAT : PULSE,
              stroke: phase === 0 ? "var(--destructive)" : "var(--chart-2)",
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

      {/* queue */}
      <ul className="relative space-y-2.5 p-4 sm:p-6">
        {order.map((id, i) => {
          const t = TICKETS[id];
          const isYou = !!t.you;
          const priority = isYou && phase >= 1;
          return (
            <motion.li
              key={id}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5"
              style={{
                zIndex: isYou ? 10 : 1,
                background: priority ? "var(--card)" : "var(--muted)",
                borderColor: priority ? "var(--sidebar-primary)" : "var(--border)",
                boxShadow: priority
                  ? `0 0 0 4px ${GLOW}, 0 14px 30px -14px var(--primary)`
                  : "none",
                opacity: !isYou && phase >= 1 ? 0.6 : 1,
              }}
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold"
                style={{
                  background: priority ? GRADIENT : "var(--border)",
                  color: priority ? "var(--primary-foreground)" : "var(--muted-foreground)",
                }}
              >
                {i + 1}
              </span>

              <span
                className="flex-1 truncate text-sm font-medium"
                style={{ color: isYou ? "var(--foreground)" : "var(--muted-foreground)" }}
              >
                {t.label}
              </span>

              {isYou && (
                <AnimatePresence mode="wait">
                  {restored ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 14 }}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: OK, color: OK_INK }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      Restored
                    </motion.span>
                  ) : priority ? (
                    <motion.span
                      key="prio"
                      initial={{ scale: 0, x: 20 }}
                      animate={{ scale: 1, x: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 16 }}
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: GRADIENT, color: "var(--primary-foreground)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                      </svg>
                      Priority
                    </motion.span>
                  ) : (
                    <motion.span
                      key="wait"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-full bg-border px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      Standard
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  SECTION                                                            */
/* ------------------------------------------------------------------ */
const PromotionSection = () => {
  const { data: user, isPending } = useGetMe();
  const isLoggedIn = !!user;

  const reduce = !!useReducedMotion();
  const priceRef = useRef<HTMLDivElement>(null);
  const priceInView = useInView(priceRef, { once: true, amount: 0.6 });

  const count = useMotionValue(0);
  const display = useTransform(count, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    if (!priceInView) return;
    if (reduce) {
      count.set(1299);
      return;
    }
    const controls = animate(count, 1299, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [priceInView, reduce, count]);

  /* CTA depends on auth state */
  const ctaHref = isLoggedIn ? "/dashboard" : "/login";
  const ctaLabel = isLoggedIn ? "Go to dashboard" : "Sign in to get priority";

  const ctaClass =
    "relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 text-base font-semibold text-primary-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/50";

  return (
    <section className="relative isolate w-full overflow-hidden bg-background px-4 py-20 font-inter text-foreground sm:px-6 sm:py-28 lg:px-8">
      {/* ambient orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 -z-10 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklch, var(--primary) 28%, transparent)" }}
        animate={reduce ? undefined : { x: [0, 50, -20, 0], y: [0, 40, 70, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklch, var(--chart-2) 24%, transparent)" }}
        animate={reduce ? undefined : { x: [0, -60, 20, 0], y: [0, -40, -80, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* flatline that wakes up into a pulse when the section scrolls in */}
      <svg
        aria-hidden
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 top-1/2 -z-10 h-40 w-full -translate-y-1/2 opacity-60"
      >
        <motion.path
          fill="none"
          stroke="var(--chart-2)"
          strokeWidth={1.5}
          strokeOpacity={0.4}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
          d="M0 100 H380 L410 100 L430 100 L460 100 H700 L730 100 L755 30 L790 175 L820 60 L840 100 H1200"
        />
      </svg>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
      >
        {/* LEFT: pitch */}
        <div>
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={ACCENT}>
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
            </svg>
            Priority restore for signed-in customers
          </motion.div>

          <motion.h2
            variants={rise}
            className="mt-6 font-manrope text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            When the lights go out, don&apos;t wait in line.
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Hit an unexpected outage? Report it from your dashboard, pay a
            one-time priority fee, and your case moves to the front of the
            restoration queue.
          </motion.p>

          {/* steps: a real sequence, so numbering is meaningful */}
          <motion.ol variants={rise} className="mt-9 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <motion.span
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border bg-card text-sm font-bold"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                  whileHover={reduce ? undefined : { rotate: -8, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  {i + 1}
                </motion.span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </li>
            ))}
          </motion.ol>

          {/* price + CTA with rotating conic border */}
          <motion.div variants={rise} className="mt-10">
            <div className="relative inline-block w-full max-w-md overflow-hidden rounded-3xl p-[2px]">
              {reduce ? (
                <div aria-hidden className="absolute inset-0" style={{ background: GRADIENT }} />
              ) : (
                <motion.div
                  aria-hidden
                  className="absolute -inset-[100%]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, var(--primary) 70deg, var(--chart-2) 130deg, transparent 190deg, var(--chart-1) 250deg, transparent 320deg)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              )}

              <div className="relative flex flex-col gap-5 rounded-[1.4rem] bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div ref={priceRef}>
                  <div className="flex items-start gap-1">
                    <span className="mt-1.5 text-2xl font-bold" style={{ color: ACCENT }}>
                      ৳
                    </span>
                    <motion.span className="font-manrope text-5xl font-bold tabular-nums tracking-tight">
                      {display}
                    </motion.span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    One-time fee per outage report
                  </p>
                </div>

                {/* auth-aware CTA */}
                {isPending ? (
                  <div
                    aria-busy
                    className="h-14 w-full animate-pulse rounded-2xl bg-muted sm:w-52"
                  />
                ) : (
                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <Link
                      href={ctaHref}
                      className={ctaClass}
                      style={{ background: GRADIENT, boxShadow: BTN_SHADOW }}
                    >
                      {!reduce && (
                        <motion.span
                          aria-hidden
                          className="absolute inset-y-0 w-1/3 -skew-x-12"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                          }}
                          initial={{ left: "-40%" }}
                          animate={{ left: ["-40%", "140%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                        />
                      )}
                      {isLoggedIn ? (
                        <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                        </svg>
                      ) : (
                        <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <path d="m10 17 5-5-5-5" />
                          <path d="M15 12H3" />
                        </svg>
                      )}
                      <span className="relative whitespace-nowrap">{ctaLabel}</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            {/* helper line */}
            <div className="mt-4 min-h-5 text-sm text-muted-foreground">
              <AnimatePresence mode="wait" initial={false}>
                {!isPending && (
                  <motion.p
                    key={isLoggedIn ? "in" : "out"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {isLoggedIn ? (
                      "You're signed in. Report an outage from your dashboard whenever you need it."
                    ) : (
                      <>
                        You need an account to report an outage.{" "}
                        <Link
                          href="/register"
                          className="font-medium underline underline-offset-4 transition-colors hover:text-foreground"
                          style={{ color: ACCENT }}
                        >
                          Create one in a minute
                        </Link>
                      </>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: live queue visual */}
        <motion.div variants={rise} className="relative">
          <RestoreQueue reduce={reduce} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PromotionSection;