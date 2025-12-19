import { Camera, Zap, Shield, BookOpen, Clock, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Camera,
      titleKey: 'features.instant.title',
      descKey: 'features.instant.desc'
    },
    {
      icon: Zap,
      titleKey: 'features.accurate.title',
      descKey: 'features.accurate.desc'
    },
    {
      icon: Shield,
      titleKey: 'features.treatment.title',
      descKey: 'features.treatment.desc'
    },
    {
      icon: BookOpen,
      titleKey: 'features.offline.title',
      descKey: 'features.offline.desc'
    },
    {
      icon: Clock,
      titleKey: 'features.multi.title',
      descKey: 'features.multi.desc'
    },
    {
      icon: Globe,
      titleKey: 'features.free.title',
      descKey: 'features.free.desc'
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.titleKey}
              className="group p-6 rounded-2xl bg-card shadow-card hover:shadow-glow transition-all duration-300 border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
