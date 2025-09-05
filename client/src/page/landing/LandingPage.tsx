import NavigationMenu from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolution from "@/components/landing/ProblemSolution";
import CoreFeatures from "@/components/landing/CoreFeatures";
import MapPreview from "@/components/landing/MapPreview";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
    return (
        < >
            <NavigationMenu />
            <HeroSection />
            <ProblemSolution />
            <CoreFeatures />
            <MapPreview />
            <Footer />
        </>
    );
}
