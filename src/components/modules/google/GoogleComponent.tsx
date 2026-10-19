import { useGoogleLogin } from "@/hooks";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { getSafeRedirect } from "@/lib/redirect";

const GoogleLoginComponet = ({
  role,
}: {
  role?: "ADMIN" | "TECHNICIAN" | "CUSTOMER";
}) => {
  const { mutate: googleLogin, isPending } = useGoogleLogin();
const router = useRouter();
const searchParams = useSearchParams();
  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse?.credential;

    if (!idToken) return toast.error("Google o auth login failed try again");

    googleLogin(
      { idToken, role },
      {
        onSuccess: (res) => {
          
          toast.success(res.message || "Google login is successfully")
            router.replace(getSafeRedirect(searchParams.get("redirect")));

        },
        onError: (err) => {
          const message =
            (err as any)?.data?.message || err.message || "Google login failed";

          console.log(err, "this is google error", message);
          toast.error(message || "Google login failed");
        },
      }
    );
  };

  const handleGoogleError = () => {
    toast.error("Google login failed");
  };

  if (isPending) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="h-10 rounded-full disabled:cursor-not-allowed"
      >
        <Spinner />
        Signing in...
      </Button>
    );
  }

  return (
    <GoogleLogin
      theme="outline"
      shape="pill"
      text="continue_with"
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  );
};

export default GoogleLoginComponet;