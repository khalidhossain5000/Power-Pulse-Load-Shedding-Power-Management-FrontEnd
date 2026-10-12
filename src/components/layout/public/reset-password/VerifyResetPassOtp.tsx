"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  LoaderCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { MotionConfig, motion, type Variants } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifyForgotPassOtp } from "@/hooks";

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
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

const otpSlotStyles =
  "size-9 sm:size-12 !rounded-xl border border-input bg-background text-base sm:text-lg font-semibold shadow-sm transition-all data-[active=true]:border-primary data-[active=true]:bg-primary/5 data-[active=true]:text-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/10 data-[active=true]:z-10 dark:data-[active=true]:border-chart-1 dark:data-[active=true]:text-chart-1 dark:data-[active=true]:ring-chart-1/15";

const VerifyResetPassOtpFields = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState("");

  const [isInvalid, setIsInvalid] = useState(false);
  const { mutate: verifyOtp, isPending } = useVerifyForgotPassOtp();

  const router = useRouter();

  const isComplete = otp.length === 6;

  const handleSubmitOtp = () => {
    if (otp.length < 6) {
      setIsInvalid(true);
      return;
    }
    //--prepare the data

    const verifyData = {
      email,
      otp,
    };

    //--data is ready go for the api hit
    verifyOtp(verifyData, {
      onSuccess: async (res) => {
        toast.success("Otp verified now you can reset password ");

        router.push(
          `/reset-password/set-new-password?email=${encodeURIComponent(email)}`
        );
      },
      onError: (err: any) => {
        console.log(
          err,
          "error in otp verification",
          err?.data?.message || err?.response?._data?.message
        );
        toast.error(
          err?.data?.message ||
            err?.response?._data?.message ||
            "Something went wrong while OTP verification"
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

          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card px-5 py-10 text-center sm:px-10">
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
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ShieldCheck
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
              Check your{" "}
              <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent dark:from-chart-1 dark:to-chart-2">
                email
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base"
            >
              We sent a verification code to the email below. Confirm it is you
              to continue resetting your password.
            </motion.p>

            {/* Email chip */}
            {email && (
              <motion.div
                variants={itemVariants}
                className="mx-auto mt-4 flex max-w-full w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-foreground sm:text-sm"
              >
                <Mail className="size-3.5 shrink-0 text-primary dark:text-chart-1" />
                <span className="truncate">{email}</span>
              </motion.div>
            )}

            {/* OTP form + button */}
            <motion.div variants={itemVariants} className="mt-8">
              <form
                id="otp-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmitOtp();
                }}
              >
                <Field className="w-full items-center text-center gap-4">
                  <p className="text-sm text-muted-foreground font-manrope">
                    Enter the 6-digit code sent to your email
                  </p>

                  <div className="relative flex w-full flex-col items-center">
                    {/* Glow when all 6 digits are filled */}
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-2 top-1/2 h-14 -translate-y-1/2 rounded-2xl bg-primary/25 blur-xl dark:bg-chart-1/25"
                      animate={{
                        opacity: isComplete ? 1 : 0,
                        scale: isComplete ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.4 }}
                    />

                    <div className="relative z-10">
                      <InputOTP
                        maxLength={6}
                        id="otp"
                        name="otp"
                        onChange={(value) => {
                          setOtp(value);
                          setIsInvalid(false);
                        }}
                        value={otp}
                        autoComplete="off"
                        pattern={REGEXP_ONLY_DIGITS}
                      >
                        <InputOTPGroup className="flex justify-center gap-1.5 sm:gap-2.5 py-1">
                          <InputOTPSlot index={0} className={otpSlotStyles} />
                          <InputOTPSlot index={1} className={otpSlotStyles} />
                          <InputOTPSlot index={2} className={otpSlotStyles} />
                          <InputOTPSlot index={3} className={otpSlotStyles} />
                          <InputOTPSlot index={4} className={otpSlotStyles} />
                          <InputOTPSlot index={5} className={otpSlotStyles} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {isInvalid && (
                      <motion.div
                        className="mt-3"
                        initial={{ x: 0 }}
                        animate={{ x: [0, -6, 6, -4, 4, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <FieldError
                          errors={[
                            { message: "Invalid Code. Please try again" },
                          ]}
                        />
                      </motion.div>
                    )}
                  </div>
                </Field>
              </form>

              <motion.div
                className="mt-6"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  disabled={isPending}
                  form="otp-form"
                  className={`group/btn relative h-12 w-full cursor-pointer gap-2 overflow-hidden rounded-xl text-base font-semibold shadow-lg shadow-primary/30 ${
                    isPending && "cursor:not-allowed"
                  }`}
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
                  {isPending ? (
                    <LoaderCircle className="relative size-4 animate-spin" />
                  ) : (
                    <BadgeCheck className="relative size-4" />
                  )}
                  <span className="relative">
                    {isPending ? "Verifying....." : "Verify Otp"}
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Back link */}
            <motion.div variants={itemVariants} className="mt-6">
              <Link
                href="/reset-password"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary dark:hover:text-chart-1"
              >
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Use a different email
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
};

export default VerifyResetPassOtpFields;
