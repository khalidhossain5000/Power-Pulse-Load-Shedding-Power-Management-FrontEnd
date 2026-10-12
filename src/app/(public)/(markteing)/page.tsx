import HeroSection from "@/components/modules/homePage/heroSection/HeroSection";
import HowWeWorks from "@/components/modules/homePage/how-we-works/HowWeWorks";
import Overview from "@/components/modules/homePage/power-overview/Overview";
import PowerZones from "@/components/modules/homePage/power-zones/PowerZones";
import PromotionSection from "@/components/modules/homePage/promotion-section/PromotionSection";
import ReportOutageCta from "@/components/modules/homePage/report-outage-cta/ReportOutageCta";
import UpcomingLoadSheddingSchedule from "@/components/modules/homePage/upcoming-load-shedding-schedule/UpcomingLoadShedding";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata = createPageMetadata(
  "Power Schedules and Outage Updates",
  "Check local load-shedding schedules, planned outages, and power-zone updates with Power Pulse.",
);

export default function PublicHomePage() {
  return (
   <div>

    <HeroSection/>
    <Overview/>
    <UpcomingLoadSheddingSchedule/>
    <PromotionSection/>
    <PowerZones/>
    <HowWeWorks/>
    <ReportOutageCta/>
   </div>
  );
}
