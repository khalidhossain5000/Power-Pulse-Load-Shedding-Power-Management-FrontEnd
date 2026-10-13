/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiRadio,
  FiShield,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-45 h-105 w-105 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-30 top-[35%] h-65 w-65 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-25 top-[25%] h-75 w-75 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1400px] overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 xl:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="min-w-0 max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-2 text-sm font-medium text-primary"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>

              <span className="truncate">Smart Power Management Platform</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.65 }}
              className="font-manrope text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.05]"
            >
              Smarter Power.
              <br />
              <span className="bg-linear-to-r from-primary via-primary/80 to-primary/50 dark:to-chart-2 bg-clip-text text-transparent">
                Better Connected.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.65 }}
              className="mt-6 max-w-xl font-inter text-base leading-7 text-muted-foreground sm:text-lg"
            >
              PowerPulse brings load shedding, outage reporting, power
              infrastructure, and technician coordination into one intelligent
              platform.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.65 }}
              className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <Link
                href="/load-shedding"
                className="group inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-inter text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 sm:w-auto"
              >
                View Power Schedule
                <FiArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/planned-outage"
                className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 font-inter text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent sm:w-auto"
              >
                Track Maintenance Schedule
              </Link>
            </motion.div>

            {/* Trust points */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.65 }}
              className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <FiCheckCircle className="size-4 shrink-0 text-primary" />
                Real-time monitoring
              </div>

              <div className="flex items-center gap-2">
                <FiCheckCircle className="size-4 shrink-0 text-primary" />
                Role-based access
              </div>

              <div className="flex items-center gap-2">
                <FiCheckCircle className="size-4 shrink-0 text-primary" />
                Secure platform
              </div>
            </motion.div>

            {/* Small Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.65 }}
              className="mt-10 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3"
            >
              <div className="min-w-0 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-sm">
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FiActivity className="size-4" />
                </div>

                <p className="font-manrope text-xl font-bold text-foreground">
                  Live
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  System Status
                </p>
              </div>

              <div className="min-w-0 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-sm">
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FiClock className="size-4" />
                </div>

                <p className="font-manrope text-xl font-bold text-foreground">
                  24/7
                </p>

                <p className="mt-1 text-xs text-muted-foreground">Monitoring</p>
              </div>

              <div className="col-span-2 min-w-0 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-sm sm:col-span-1">
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FiShield className="size-4" />
                </div>

                <p className="font-manrope text-xl font-bold text-foreground">
                  Secure
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Access Control
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto min-w-0 w-full max-w-155 overflow-visible lg:ml-auto"
          >
            {/* Main dashboard */}
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-5">
              {/* Grid background */}
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, color-mix(in oklch, var(--border) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--border) 45%, transparent) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />

              {/* Header */}
              <div className="relative z-10 flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-border bg-background/75 p-4 backdrop-blur-md">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <FiZap className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-manrope text-sm font-bold text-foreground">
                      PowerPulse Grid
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      Infrastructure Overview
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[10px] font-semibold text-primary sm:px-3 sm:text-xs">
                  <span className="size-2 shrink-0 rounded-full bg-primary" />
                  Operational
                </div>
              </div>

              {/* Main Visualization */}
              <div className="relative z-10 mt-4 overflow-hidden rounded-2xl border border-border bg-background/65 p-4 backdrop-blur-md sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Grid Flow
                    </p>

                    <p className="mt-1 font-manrope text-2xl font-bold text-foreground">
                      98.6%
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    <FiTrendingUp className="size-3.5" />
                    +4.8%
                  </div>
                </div>

                {/* Animated Power Flow */}
                <div className="relative mt-6 h-62.5 overflow-hidden sm:h-72.5">
                  <svg
                    viewBox="0 0 600 300"
                    className="absolute inset-0 size-full"
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="powerGradient"
                        x1="0"
                        y1="0"
                        x2="600"
                        y2="0"
                      >
                        <stop
                          offset="0%"
                          stopColor="currentColor"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="45%"
                          stopColor="currentColor"
                          stopOpacity="0.9"
                        />
                        <stop
                          offset="100%"
                          stopColor="currentColor"
                          stopOpacity="0.3"
                        />
                      </linearGradient>
                    </defs>

                    {/* Connection Lines */}
                    <motion.path
                      d="M300 150 C230 150 210 80 120 80"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6 8"
                      className="text-primary/35 dark:text-chart-2"
                      animate={{ strokeDashoffset: [0, -28] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.path
                      d="M300 150 C230 150 210 220 120 220"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6 8"
                      className="text-primary/35 dark:text-chart-2"
                      animate={{ strokeDashoffset: [0, -28] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.path
                      d="M300 150 C370 150 390 80 480 80"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6 8"
                      className="text-primary/35 dark:text-chart-2"
                      animate={{ strokeDashoffset: [0, -28] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.path
                      d="M300 150 C370 150 390 220 480 220"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6 8"
                      className="text-primary/35 dark:text-chart-2"
                      animate={{ strokeDashoffset: [0, -28] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Central Ring */}
                    <motion.circle
                      cx="300"
                      cy="150"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-primary/20 dark:text-chart-2"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <motion.circle
                      cx="300"
                      cy="150"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-primary/40     dark:text-chart-1"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Nodes */}
                    <circle cx="120" cy="80" r="7" className="fill-primary dark:fill-chart-2" />
                    <circle cx="120" cy="220" r="7" className="fill-primary dark:fill-chart-2" />
                    <circle cx="480" cy="80" r="7" className="fill-primary dark:fill-chart-2" />
                    <circle cx="480" cy="220" r="7" className="fill-primary dark:fill-chart-2" />

                    {/* Central node */}
                    <circle
                      cx="300"
                      cy="150"
                      r="25"
                      className="fill-primary/10 stroke-primary dark:text-chart-2"
                      strokeWidth="2"
                    />

                    <foreignObject x="278" y="128" width="44" height="44">
                      <div className="flex size-11 items-center justify-center">
                        <FiZap className="size-5 text-primary dark:text-chart-2" />
                      </div>
                    </foreignObject>
                  </svg>

                  {/* Floating cards */}
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute left-1 top-3 origin-top-left scale-90 rounded-xl border border-border bg-card/90 p-2.5 shadow-lg backdrop-blur-md sm:left-0 sm:scale-100 sm:p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FiRadio className="size-4" />
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                          Zone A
                        </p>

                        <p className="text-[11px] font-bold text-foreground sm:text-xs">
                          Stable
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 7, 0] }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-3 left-1 origin-bottom-left scale-90 rounded-xl border border-border bg-card/90 p-2.5 shadow-lg backdrop-blur-md sm:left-0 sm:scale-100 sm:p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FiMapPin className="size-4" />
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                          Area 0
                        </p>

                        <p className="text-[11px] font-bold text-foreground sm:text-xs">
                          Connected
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute right-1 top-3 origin-top-right scale-90 rounded-xl border border-border bg-card/90 p-2.5 shadow-lg backdrop-blur-md sm:right-0 sm:scale-100 sm:p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FiActivity className="size-4" />
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                          Load
                        </p>

                        <p className="text-[11px] font-bold text-foreground sm:text-xs">
                          192.4 MW
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-3 right-1 origin-bottom-right scale-90 rounded-xl border border-border bg-card/90 p-2.5 shadow-lg backdrop-blur-md sm:right-0 sm:scale-100 sm:p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FiShield className="size-4" />
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                          Security
                        </p>

                        <p className="text-[11px] font-bold text-foreground sm:text-xs">
                          Protected
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom metrics */}
                <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Substations
                    </p>

                    <p className="mt-1 font-manrope text-sm font-bold text-primary">
                      55 + 
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Feeders
                    </p>

                    <p className="mt-1 font-manrope text-sm font-bold text-foreground">
                      10+
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Active Outages
                    </p>

                    <p className="mt-1 font-manrope text-sm font-bold text-primary">
                      05 + 
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-5 left-5 hidden rounded-2xl border border-border bg-card/90 px-4 py-3 shadow-xl backdrop-blur-md sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FiCheckCircle className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Power status synchronized
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    All systems are up to date
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
