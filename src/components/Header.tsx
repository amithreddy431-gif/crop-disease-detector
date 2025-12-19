import { Leaf, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ThemeLanguageToggle } from "./ThemeLanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">CropGuard</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.features')}
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.howItWorks')}
            </a>
            <a href="#diseases" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.diseases')}
            </a>
            <ThemeLanguageToggle />
            <Button variant="hero" size="sm" asChild>
              <a href="#scan">{t('nav.scanNow')}</a>
            </Button>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <ThemeLanguageToggle />
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.features')}
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.howItWorks')}
              </a>
              <a href="#diseases" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.diseases')}
              </a>
              <Button variant="hero" size="sm" asChild>
                <a href="#scan">{t('nav.scanNow')}</a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
