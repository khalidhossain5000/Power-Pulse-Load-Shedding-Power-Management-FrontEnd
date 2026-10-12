/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
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

/* ------------------------------------------------------------------ */
/*  THEME TOKENS (ResetPassword পেজের সাথে একই)                         */
/*  তোমার গ্লোবাল CSS এ যদি --pp-* ভ্যারিয়েবল আগে থেকেই থাকে, তাহলে এই    */
/*  themeCSS ব্লকটা মুছে দিলেই হবে।                                      */
/* ------------------------------------------------------------------ */
const themeCSS = `
.pp-promo {
  --pp-bg: #F2F5FA;
  --pp-surface: #FFFFFF;
  --pp-surface-2: #EEF2F9;
  --pp-border: #D6DEEC;
  --pp-ink: #0B1B3A;
  --pp-muted: #5B6B8A;
  --pp-accent: #F59E0B;
  --pp-accent-2: #F97316;
  --pp-accent-ink: #1A1200;
  --pp-wave: #0891B2;
  --pp-glow: rgba(245, 158, 11, 0.28);
  --pp-orb-a: rgba(245, 158, 11, 0.28);
  --pp-orb-b: rgba(8, 145, 178, 0.22);
  --pp-shadow: 0 30px 80px -30px rgba(11, 27, 58, 0.35);
  --pp-danger: #EF4444;
  --pp-ok: #10B981;
}
.dark .pp-promo,
[data-theme="dark"] .pp-promo {
  --pp-bg: #060A14;
  --pp-surface: #0D1426;
  --pp-surface-2: #131C33;
  --pp-border: #1F2B49;
  --pp-ink: #EAF0FF;
  --pp-muted: #8C9ABB;
  --pp-accent: #FFC53D;
  --pp-accent-2: #FF8A1F;
  --pp-accent-ink: #1A1200;
  --pp-wave: #22D3EE;
  --pp-glow: rgba(255, 197, 61, 0.22);
  --pp-orb-a: rgba(255, 197, 61, 0.14);
  --pp-orb-b: rgba(34, 211, 238, 0.14);
  --pp-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.8);
}
`;

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
      ? { text: "Outage reported. Waiting in the standard queue.", color: "var(--pp-danger)" }
      : phase === 1
      ? { text: "Priority fee paid. Moving to the front.", color: "var(--pp-accent)" }
      : { text: "Power restored. Back online.", color: "var(--pp-ok)" };

  return (
    <div
      className="relative overflow-hidden rounded-3xl border"
      style={{
        background: "var(--pp-surface)",
        borderColor: "var(--pp-border)",
        boxShadow: "var(--pp-shadow)",
      }}
    >
      {/* strike flash when the ticket jumps */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            key="flash"
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{ background: "var(--pp-accent)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0, 0.18, 0] }}
            transition={{ duration: 0.9, delay: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* status header with live waveform */}
      <div
        className="flex items-center gap-4 border-b px-5 py-4 sm:px-6"
        style={{ borderColor: "var(--pp-border)", background: "var(--pp-surface-2)" }}
      >
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
              className="truncate text-sm font-medium"
              style={{ color: "var(--pp-ink)" }}
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
              stroke: phase === 0 ? "var(--pp-danger)" : "var(--pp-wave)",
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
                background: priority ? "var(--pp-surface)" : "var(--pp-surface-2)",
                borderColor: priority ? "var(--pp-accent)" : "var(--pp-border)",
                boxShadow: priority ? "0 0 0 4px var(--pp-glow), 0 14px 30px -14px var(--pp-accent-2)" : "none",
                opacity: !isYou && phase >= 1 ? 0.6 : 1,
              }}
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold"
                style={{
                  background: priority
                    ? "linear-gradient(135deg, var(--pp-accent), var(--pp-accent-2))"
                    : "var(--pp-border)",
                  color: priority ? "var(--pp-accent-ink)" : "var(--pp-muted)",
                }}
              >
                {i + 1}
              </span>

              <span
                className="flex-1 truncate text-sm font-medium"
                style={{ color: isYou ? "var(--pp-ink)" : "var(--pp-muted)" }}
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
                      style={{ background: "var(--pp-ok)", color: "#04170F" }}
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
                      style={{
                        background: "linear-gradient(135deg, var(--pp-accent), var(--pp-accent-2))",
                        color: "var(--pp-accent-ink)",
                      }}
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
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ background: "var(--pp-border)", color: "var(--pp-muted)" }}
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

  return (
    <section
      className="pp-promo relative isolate w-full overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      style={{
        background: "var(--pp-bg)",
        color: "var(--pp-ink)",
        fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <style>{themeCSS}</style>

      {/* ambient orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 -z-10 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{ background: "var(--pp-orb-a)" }}
        animate={reduce ? undefined : { x: [0, 50, -20, 0], y: [0, 40, 70, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "var(--pp-orb-b)" }}
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
          stroke="var(--pp-wave)"
          strokeWidth={1.5}
          strokeOpacity={0.35}
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
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium"
            style={{ borderColor: "var(--pp-border)", background: "var(--pp-surface)", color: "var(--pp-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--pp-accent)">
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
            </svg>
            Priority restore for signed-in customers
          </motion.div>

          <motion.h2
            variants={rise}
            className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            When the lights go out, don&apos;t wait in line.
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--pp-muted)" }}
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
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-sm font-bold"
                  style={{
                    borderColor: "var(--pp-accent)",
                    color: "var(--pp-accent)",
                    background: "var(--pp-surface)",
                  }}
                  whileHover={reduce ? undefined : { rotate: -8, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  {i + 1}
                </motion.span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--pp-muted)" }}>
                    {s.text}
                  </p>
                </div>
              </li>
            ))}
          </motion.ol>

          {/* price + CTA with rotating conic border */}
          <motion.div variants={rise} className="mt-10">
            <div className="relative inline-block w-full max-w-md overflow-hidden rounded-3xl p-[2px]">
              {!reduce && (
                <motion.div
                  aria-hidden
                  className="absolute -inset-[100%]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, var(--pp-accent) 70deg, var(--pp-accent-2) 120deg, transparent 180deg, var(--pp-wave) 250deg, transparent 320deg)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              )}
              {reduce && (
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, var(--pp-accent), var(--pp-accent-2))" }}
                />
              )}

              <div
                className="relative flex flex-col gap-5 rounded-[1.4rem] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                style={{ background: "var(--pp-surface)" }}
              >
                <div ref={priceRef}>
                  <div className="flex items-start gap-1">
                    <span className="mt-1.5 text-2xl font-bold" style={{ color: "var(--pp-accent)" }}>
                      ৳
                    </span>
                    <motion.span className="text-5xl font-bold tabular-nums tracking-tight">
                      {display}
                    </motion.span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--pp-muted)" }}>
                    One-time fee per outage report
                  </p>
                </div>

                <motion.div
                  whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <Link
                    href="/dashboard"
                    className="relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 text-base font-semibold outline-none focus-visible:ring-4"
                    style={{
                      background: "linear-gradient(135deg, var(--pp-accent), var(--pp-accent-2))",
                      color: "var(--pp-accent-ink)",
                      boxShadow: "0 18px 40px -14px var(--pp-accent-2)",
                    }}
                  >
                    {!reduce && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-y-0 w-1/3 -skew-x-12"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                        }}
                        initial={{ left: "-40%" }}
                        animate={{ left: ["-40%", "140%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                      />
                    )}
                    <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                    </svg>
                    <span className="relative whitespace-nowrap">Get priority restore</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            <p className="mt-4 text-sm" style={{ color: "var(--pp-muted)" }}>
              Available from your dashboard once you&apos;re signed in.
            </p>
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