import { AlertTriangle, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const diseases = [
  {
    name: "Leaf Blight",
    crop: "Rice, Wheat",
    severity: "High",
    symptoms: "Brown lesions with yellow halos on leaves",
    color: "bg-destructive/10 border-destructive/20"
  },
  {
    name: "Powdery Mildew",
    crop: "Various Crops",
    severity: "Medium",
    symptoms: "White powdery coating on leaf surface",
    color: "bg-warning/10 border-warning/20"
  },
  {
    name: "Bacterial Wilt",
    crop: "Tomato, Potato",
    severity: "High",
    symptoms: "Sudden wilting and yellowing of leaves",
    color: "bg-destructive/10 border-destructive/20"
  },
  {
    name: "Rust Disease",
    crop: "Wheat, Corn",
    severity: "Medium",
    symptoms: "Orange-brown pustules on leaves and stems",
    color: "bg-warning/10 border-warning/20"
  },
  {
    name: "Mosaic Virus",
    crop: "Various Crops",
    severity: "High",
    symptoms: "Mottled yellow and green leaf patterns",
    color: "bg-destructive/10 border-destructive/20"
  },
  {
    name: "Root Rot",
    crop: "Various Crops",
    severity: "Medium",
    symptoms: "Stunted growth and wilting despite watering",
    color: "bg-warning/10 border-warning/20"
  }
];

const DiseasesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="diseases" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('diseases.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('diseases.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((disease) => (
            <div
              key={disease.name}
              className={`p-6 rounded-2xl border ${disease.color} transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {disease.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{disease.crop}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  disease.severity === "High" 
                    ? "bg-destructive/20 text-destructive" 
                    : "bg-warning/20 text-warning"
                }`}>
                  {disease.severity}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{disease.symptoms}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-accent/50 border border-border max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
            <div>
              <h4 className="font-display font-semibold text-foreground mb-1">
                Early Detection is Key
              </h4>
              <p className="text-sm text-muted-foreground">
                Detecting diseases early can save up to 90% of your crop yield. 
                Regular scanning with CropGuard helps you stay ahead of potential threats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiseasesSection;
