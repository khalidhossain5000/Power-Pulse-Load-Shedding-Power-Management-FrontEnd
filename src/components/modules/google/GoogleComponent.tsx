import { useGoogleLogin } from "@/hooks";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { getSafeRedirect } from "@/lib/redirect";
import Swal from "sweetalert2";

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
         Swal.fire({
  toast: true,
  position: "top-end",
  icon: "error",
  iconColor: "var(--destructive)",
  title: message || "Google login failed",
  showConfirmButton: true,
  confirmButtonText: "OK",
  buttonsStyling: false,
  customClass: {
    popup:
      "!bg-card !text-card-foreground !border !border-border !rounded-xl !shadow-lg !px-4 !py-3",
    title: "!text-sm !font-medium !text-foreground",
    confirmButton:
      "!bg-primary !text-primary-foreground !text-xs !font-semibold !rounded-md !px-4 !py-1.5 hover:!opacity-90",
  },
});
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