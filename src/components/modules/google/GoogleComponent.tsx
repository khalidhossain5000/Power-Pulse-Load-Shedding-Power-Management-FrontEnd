import { useGoogleLogin } from "@/hooks";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { getSafeRedirect } from "@/lib/redirect";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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
            icon: "error",
            title: "Google Login Failed",
            text: message || "Google login failed",
            confirmButtonText: "OK",
            background: "#0f172a",
            color: "#f8fafc",
            confirmButtonColor: "#009689",
            focusConfirm: true,
            customClass: {
              popup: "power-pulse-alert",
            },
            didOpen: () => {
              const popup = Swal.getPopup();
              const title = Swal.getTitle();
              const button = Swal.getConfirmButton();

              if (popup) {
                popup.style.border = "1px solid #2563eb";
                popup.style.borderRadius = "20px";
                popup.style.boxShadow = "0 0 25px rgba(37, 99, 235, 0.25)";
              }

              if (title) {
                title.style.color = "#3b82f6";
              }

              if (button) {
                button.style.backgroundColor = "#009689";
                button.style.color = "#ffffff";
                button.style.borderRadius = "10px";
                button.style.padding = "10px 28px";
                button.style.fontWeight = "600";
                button.style.border = "none";
                button.style.boxShadow = "0 4px 12px rgba(0, 150, 137, 0.3)";
              }
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