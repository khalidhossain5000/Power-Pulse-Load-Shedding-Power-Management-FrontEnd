import VerifyResetPassOtpFields from "@/components/layout/public/reset-password/VerifyResetPassOtp";

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

const page = async ({ searchParams }: PageProps) => {
  const { email } = await searchParams ;

  

  return (
    <div>
      <VerifyResetPassOtpFields email={email as string} />
    </div>
  );
};

export default page;