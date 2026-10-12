"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import {  useVerifyForgotPassOtp } from "@/hooks";
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
  const { mutate: verifyOtp, isPending } = useVerifyForgotPassOtp();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  

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
          {isPending ? "Verifying....." : "Verify Otp"}
        </Button>

     
      </CardFooter>
    </Card>
  );
};

export default VerifyResetPassOtpFields;
