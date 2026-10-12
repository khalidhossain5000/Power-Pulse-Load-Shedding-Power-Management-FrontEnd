"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { useResendOtp, useVerifyEmail } from "@/hooks";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { getSafeRedirect } from "@/lib/redirect";



const otpSlotStyles =
  "size-8 sm:size-11 !rounded-xl border border-input bg-background text-base sm:text-lg font-semibold shadow-sm transition-all data-[active=true]:border-primary data-[active=true]:bg-primary/5 data-[active=true]:text-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/10 data-[active=true]:z-10";

const VerifyResetPassOtpFields = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState("");

  const [isInvalid, setIsInvalid] = useState(false);
  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const { mutate: resendCode, isPending: resendPending } = useResendOtp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  //resend timer handler
  useEffect(() => {
    const resendTimer = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(resendTimer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(resendTimer);
  }, []);

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
    verifyEmail(verifyData, {
      onSuccess: async (res) => {
    
        toast.success("You account is verified and active now");

        // backend auto-logs in on verify, so refresh the cached user first
        await queryClient.invalidateQueries({ queryKey: ["user"] });

        router.replace(getSafeRedirect(searchParams.get("redirect")));
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

  //resend otp handler

  const handleResendOtp = () => {
    if (timer !== 0) return;

    resendCode(
      { email },
      {
        onSuccess: (res) => {
    
          toast.success(res.message || "OTP resent successfully,check now.");
          setTimer(RESEND_COOLDOWN);
        },
        onError: (err: any) => {
          console.log(
            err,
            "error in otp resend",
            err?.data?.message || err?.response?._data?.message
          );
          toast.error(
            err?.data?.message ||
              err?.response?._data?.message ||
              "Something went wrong while OTP resend"
          );
        },
      }
    );
  };

  return (
    <Card className="border-0 ring-0 shadow-none p-0">
      <CardContent className="px-0">
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

            <div className="w-full flex flex-col items-center">
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
                <InputOTPGroup className="flex justify-center gap-1 sm:gap-2.5 py-1">
                  <InputOTPSlot index={0} className={otpSlotStyles} />
                  <InputOTPSlot index={1} className={otpSlotStyles} />
                  <InputOTPSlot index={2} className={otpSlotStyles} />
                  <InputOTPSlot index={3} className={otpSlotStyles} />
                  <InputOTPSlot index={4} className={otpSlotStyles} />
                  <InputOTPSlot index={5} className={otpSlotStyles} />
                </InputOTPGroup>
              </InputOTP>
              {isInvalid && (
                <FieldError
                  errors={[{ message: "Invalid Code. Please try again" }]}
                />
              )}
            </div>

            <FieldDescription className="text-sm text-center">
              Didn&apos;t receive the code?{" "}
              <span className="font-medium text-foreground">
                Resend in {timer} s
              </span>
            </FieldDescription>
          </Field>
        </form>
      </CardContent>

      <CardFooter className="border-t border-t-slate-300 px-0 pt-6 flex flex-col items-center gap-3">
        <Button
          type="submit"
          disabled={isPending}
          form="otp-form"
          className={`w-full rounded-xl h-11 font-medium shadow-sm cursor-pointer ${
            isPending && "cursor:not-allowed"
          }`}
        >
          {isPending ? "Verifying....." : "Verify Account"}
        </Button>

        <Button
          type="button"
          disabled={timer !== 0 || resendPending}
          onClick={handleResendOtp}
          variant="outline"
          className={`w-full rounded-xl h-10 text-muted-foreground hover:text-foreground border-primary/50 ${
            timer !== 0 ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {resendPending ? "Resending....." : "Resend Code"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerifyResetPassOtpFields;
