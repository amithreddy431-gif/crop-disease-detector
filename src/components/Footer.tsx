import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">CropGuard</span>
            </a>
            <p className="text-background/70 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <nav className="flex flex-col gap-2">
              <a href="#features" className="text-background/70 hover:text-background transition-colors">{t('nav.features')}</a>
              <a href="#how-it-works" className="text-background/70 hover:text-background transition-colors">{t('nav.howItWorks')}</a>
              <a href="#diseases" className="text-background/70 hover:text-background transition-colors">{t('nav.diseases')}</a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">{t('footer.contact')}</a>
            </nav>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-background/70 hover:text-background transition-colors">Help Center</a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">FAQs</a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">Privacy Policy</a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">Terms of Service</a>
            </nav>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/50 text-sm">
          © {new Date().getFullYear()} CropGuard. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
