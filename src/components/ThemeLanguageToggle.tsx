import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
] as const;

export function ThemeLanguageToggle() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative glass hover:bg-accent/50">
            <Globe className="h-4 w-4" />
            <span className="sr-only">{t('language')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass border-border z-50">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={language === lang.code ? 'bg-accent' : ''}
            >
              <span className="font-medium">{lang.nativeName}</span>
              <span className="ml-2 text-muted-foreground text-sm">({lang.name})</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        className="relative glass hover:bg-accent/50 overflow-hidden"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
