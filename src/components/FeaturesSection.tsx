import { Camera, Zap, Shield, BookOpen, Clock, Globe } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Easy Image Upload",
    description: "Simply take a photo of your crop leaf and upload it. Our system accepts images from any device."
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get results in seconds. Our AI processes your image immediately and provides accurate diagnosis."
  },
  {
    icon: Shield,
    title: "High Accuracy",
    description: "Powered by state-of-the-art machine learning models trained on millions of plant images."
  },
  {
    icon: BookOpen,
    title: "Treatment Guides",
    description: "Receive detailed treatment recommendations and preventive measures for each detected disease."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access our service anytime, anywhere. No appointments or waiting required."
  },
  {
    icon: Globe,
    title: "Multi-Crop Support",
    description: "Supports detection for various crops including rice, wheat, corn, tomatoes, and more."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose CropGuard?
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform offers comprehensive features to help you protect your crops effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card shadow-card hover:shadow-glow transition-all duration-300 border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
