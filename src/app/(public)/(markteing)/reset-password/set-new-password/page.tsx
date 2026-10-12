import SetNewPassword from '@/components/layout/public/reset-password/SetNewPassword';
type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

const page = async ({ searchParams }: PageProps) => {
  const { email } = await searchParams ;
    return (
        <div>
            <SetNewPassword email={email as string }/>
        </div>
    );
};

export default page;