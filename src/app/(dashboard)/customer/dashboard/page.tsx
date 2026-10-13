import DashboardHeader from "@/components/layout/dashboard/common/DashboardHeader/DashboardHeader";
import CustomerAnalyticsReport from "@/components/layout/dashboard/customer/customer-analytics-report/CustomerAnalyticsReport";

const CustomerDashboardPageHome = () => {
    return (
        <section className="space-y-6 p-4 md:p-6">
            <DashboardHeader
                title="Dashboard Overview"
                description="Track your spending patterns and account activity at a glance."
                showDateTime={true}
            />
            <div className="py-4">
                <CustomerAnalyticsReport />
            </div>
        </section>
    );
};

export default CustomerDashboardPageHome;