import { useState } from "react";
import { ArrowRight, Upload, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import heroImage from "@/assets/hero-crops.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import ScanModal from "./ScanModal";

const HeroSection = () => {
  const { t } = useLanguage();
  const [scanModalOpen, setScanModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Healthy crop leaves"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70 dark:from-background dark:via-background/98 dark:to-background/80" />
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-foreground text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('hero.titleHighlight')} Disease Detection
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t('hero.title')}
              <span className="text-gradient block">{t('hero.titleHighlight')} {t('hero.titleEnd')}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" className="group" onClick={() => setScanModalOpen(true)}>
                <Upload className="w-5 h-5" />
                {t('hero.scanButton')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#features">{t('hero.learnMore')}</a>
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-center glass px-4 py-3 rounded-xl">
                <div className="font-display text-3xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Diseases Detected</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center glass px-4 py-3 rounded-xl">
                <div className="font-display text-3xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center glass px-4 py-3 rounded-xl">
                <div className="font-display text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Farmers Helped</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      <ScanModal open={scanModalOpen} onOpenChange={setScanModalOpen} />
    </>
  );
};

export default HeroSection;
