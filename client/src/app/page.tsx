import NavigationMenu from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ProblemSolution from "@/components/ProblemSolution";
import CoreFeatures from "@/components/CoreFeatures";
import MapPreview from "@/components/MapPreview";

export default function Home() {
  return (
    < >
      <NavigationMenu />
      <HeroSection />
      <ProblemSolution />
      <CoreFeatures />
      <MapPreview />
    </>
  );
}
