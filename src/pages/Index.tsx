import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import UploadSection from "@/components/UploadSection";
import DiseasesSection from "@/components/DiseasesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UploadSection />
        <DiseasesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
