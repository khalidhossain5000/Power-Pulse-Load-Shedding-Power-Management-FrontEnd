import AdminAnalyticsReport from "@/components/layout/dashboard/admin/admin-analytics/AdminAnalyticsReport";
import DashboardHeader from "@/components/layout/dashboard/common/DashboardHeader/DashboardHeader";

const AdminDashboardHome = () => {
    return (
        <section className="space-y-6 p-4 md:p-6">
            <DashboardHeader
                title="Welcome to PowerPulse Admin Dashboard"
                description="Monitor users, technicians, outages and revenue across the platform at a glance."
                showDateTime={true}
            />
            <div className="py-4">
                <AdminAnalyticsReport />
            </div>
        </section>
    );
};

export default AdminDashboardHome;