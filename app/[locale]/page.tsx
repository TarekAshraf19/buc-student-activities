import Hero from "@/components/home/Hero";
import ExploreStudentLife from "@/components/home/ExploreStudentLife";
import LatestActivities from "@/components/home/LatestActivities";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Colleges from "@/components/home/Colleges";
import Achievements from "@/components/home/Achievements";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ExploreStudentLife />
      <LatestActivities />
      <UpcomingEvents />
      <Colleges />
      <Achievements />
      <CTA />
    </>
  );
}