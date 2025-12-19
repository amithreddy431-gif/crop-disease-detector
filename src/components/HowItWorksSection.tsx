import { Upload, Cpu, FileText, Pill } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Upload,
      step: "01",
      titleKey: 'howItWorks.step1.title',
      descKey: 'howItWorks.step1.desc'
    },
    {
      icon: Cpu,
      step: "02",
      titleKey: 'howItWorks.step2.title',
      descKey: 'howItWorks.step2.desc'
    },
    {
      icon: FileText,
      step: "03",
      titleKey: 'howItWorks.step3.title',
      descKey: 'howItWorks.step3.desc'
    },
    {
      icon: Pill,
      step: "04",
      titleKey: 'upload.treatment',
      descKey: 'features.treatment.desc'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-display font-bold text-sm flex items-center justify-center border-2 border-background">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-muted-foreground">
                  {t(item.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
