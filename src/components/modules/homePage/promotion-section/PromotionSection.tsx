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

const GRADIENT = "bg-linear-to-br from-primary to-chart-3";

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

const STATUS = [
  {
    text: "Outage reported. Waiting in the standard queue.",
    dot: "bg-destructive",
    wave: "stroke-destructive",
  },
  {
    text: "Priority fee paid. Moving to the front.",
    dot: "bg-chart-2",
    wave: "stroke-chart-2",
  },
  {
    text: "Power restored. Back online.",
    dot: "bg-emerald-500",
    wave: "stroke-chart-2",
  },
];

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

const RestoreQueue = ({ reduce }: { reduce: boolean }) => {
  const [phase, setPhase] = useState(reduce ? 2 : 0);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % 3), PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  const order = phase === 0 ? ORDER_WAITING : ORDER_PRIORITY;
  const restored = phase === 2;
  const status = STATUS[phase];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-foreground/15">
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            key="flash"
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 bg-chart-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0, 0.16, 0] }}
            transition={{ duration: 0.9, delay: 0.35 }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 border-b border-border bg-muted px-5 py-4 sm:px-6">
        <div className="relative grid h-3 w-3 shrink-0 place-items-center">
          <span
            className={`absolute h-3 w-3 rounded-full transition-colors duration-500 ${status.dot}`}
          />
          {!reduce && (
            <motion.span
              className={`absolute h-3 w-3 rounded-full transition-colors duration-500 ${status.dot}`}
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
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

        <svg
          viewBox="0 0 240 60"
          preserveAspectRatio="none"
          className="h-8 w-24 shrink-0 sm:w-32"
        >
          <motion.path
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className={`transition-colors duration-500 ${status.wave}`}
            initial={false}
            animate={{ d: phase === 0 ? FLAT : PULSE }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

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
              className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 transition-colors duration-300 ${
                isYou ? "z-10" : ""
              } ${
                priority
                  ? "border-sidebar-primary bg-card shadow-lg shadow-primary/30 ring-4 ring-primary/25"
                  : "border-border bg-muted"
              } ${!isYou && phase >= 1 ? "opacity-60" : "opacity-100"}`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                  priority
                    ? `${GRADIENT} text-primary-foreground`
                    : "bg-border text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>

              <span
                className={`min-w-0 flex-1 truncate text-sm font-medium ${
                  isYou ? "text-foreground" : "text-muted-foreground"
                }`}
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
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 14,
                      }}
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-950"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
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
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 16,
                      }}
                      className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground ${GRADIENT}`}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
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
                      className="shrink-0 rounded-full bg-border px-3 py-1 text-xs font-medium text-muted-foreground"
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

const PromotionSection = () => {
  const { data: user, isPending } = useGetMe();
  const isLoggedIn = !!user;
  const role = user?.data?.role;
  const isCustomer = isLoggedIn && role === "CUSTOMER";
  const isOtherRole = isLoggedIn && !isCustomer;

  const reduce = !!useReducedMotion();
  const priceRef = useRef<HTMLDivElement>(null);
  const priceInView = useInView(priceRef, { once: true, amount: 0.6 });

  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    Math.round(v).toLocaleString("en-US")
  );

  useEffect(() => {
    if (!priceInView) return;
    if (reduce) {
      count.set(1299);
      return;
    }
    const controls = animate(count, 1299, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [priceInView, reduce, count]);

  const ctaHref = isCustomer ? "/customer/dashboard" : "/login";
  const ctaLabel = isCustomer ? "Go to dashboard" : "Sign in to get priority";

  return (
    <section className="relative isolate w-full overflow-hidden bg-background px-4 py-20 font-inter text-foreground sm:px-6 sm:py-28 lg:px-8">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 -z-10 h-104 w-104 rounded-full bg-primary/25 blur-3xl"
        animate={reduce ? undefined : { x: [0, 50, -20, 0], y: [0, 40, 70, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-112 w-md rounded-full bg-chart-2/20 blur-3xl"
        animate={
          reduce ? undefined : { x: [0, -60, 20, 0], y: [0, -40, -80, 0] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16"
      >
        <div className="min-w-0">
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              className="fill-sidebar-primary"
            >
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

          <motion.ol variants={rise} className="mt-9 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <motion.span
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-sidebar-primary bg-card text-sm font-bold text-sidebar-primary"
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

          <motion.div variants={rise} className="mt-10">
            <div className="relative inline-block w-full max-w-md overflow-hidden rounded-3xl p-0.5">
              {reduce ? (
                <div aria-hidden className={`absolute inset-0 ${GRADIENT}`} />
              ) : (
                <>
                  <motion.div
                    aria-hidden
                    className="absolute -inset-full bg-conic from-transparent via-primary to-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    aria-hidden
                    className="absolute -inset-full bg-conic from-transparent via-chart-2 to-transparent"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 9,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </>
              )}

              <div className="relative flex flex-col gap-5 rounded-[1.4rem] bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div ref={priceRef}>
                  <div className="flex items-start gap-1">
                    <span className="mt-1.5 text-2xl font-bold text-sidebar-primary">
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

                {isPending ? (
                  <div
                    aria-busy
                    className="h-14 w-full animate-pulse rounded-2xl bg-muted sm:w-52"
                  />
                ) : isOtherRole ? (
                  <div
                    aria-disabled
                    className="flex h-14 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-border bg-muted px-6 text-base font-semibold text-muted-foreground"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <span className="whitespace-nowrap">Customers only</span>
                  </div>
                ) : (
                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <Link
                      href={ctaHref}
                      className={`relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/40 outline-none focus-visible:ring-4 focus-visible:ring-ring/50 ${GRADIENT}`}
                    >
                      {!reduce && (
                        <motion.span
                          aria-hidden
                          className="absolute inset-y-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/45 to-transparent"
                          initial={{ left: "-40%" }}
                          animate={{ left: ["-40%", "140%"] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 2.4,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                      {isCustomer ? (
                        <svg
                          className="relative"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                        </svg>
                      ) : (
                        <svg
                          className="relative"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <path d="m10 17 5-5-5-5" />
                          <path d="M15 12H3" />
                        </svg>
                      )}
                      <span className="relative whitespace-nowrap">
                        {ctaLabel}
                      </span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-4 min-h-5 text-sm text-muted-foreground">
              <AnimatePresence mode="wait" initial={false}>
                {!isPending && (
                  <motion.p
                    key={isCustomer ? "customer" : isOtherRole ? "other" : "out"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {isCustomer ? (
                      "You're signed in. Report an outage from your dashboard whenever you need it."
                    ) : isOtherRole ? (
                      "Outage reporting is available for customer accounts only."
                    ) : (
                      <>
                        You need an account to report an outage.{" "}
                        <Link
                          href="/register"
                          className="font-medium text-sidebar-primary underline underline-offset-4 transition-colors hover:text-foreground"
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

        <motion.div variants={rise} className="relative w-full min-w-0">
          <RestoreQueue reduce={reduce} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PromotionSection;