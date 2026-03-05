# Harvest Healer AI 🌾

AI-powered crop disease detection and treatment recommendation system supporting English, Hindi, and Telugu.

**Live URL:** [harvest-healer-ai.lovable.app](https://harvest-healer-ai.lovable.app)

---

## Features

- **AI Crop Disease Scanner** — Upload a photo or manually enter crop/disease name to get instant diagnosis, severity, treatment, and prevention advice
- **Multilingual Support** — Full UI and AI responses in English, Hindi (हिंदी), and Telugu (తెలుగు)
- **Dark / Light Theme** — Toggle between themes
- **Disease Reference Catalog** — Browse known crop diseases from the database
- **Text-to-Speech** — Listen to analysis results

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Component library |
| React Router DOM | Client-side routing |
| TanStack React Query | Server state management |
| next-themes | Dark/light mode |
| Lucide React | Icons |
| Framer Motion | Animations |

### Backend (Lovable Cloud / Supabase)
| Service | Purpose |
|---|---|
| PostgreSQL Database | Disease catalog storage |
| Edge Function: `analyze-crop` | AI crop analysis via Google Gemini 2.5 Flash |
| Edge Function: `text-to-speech` | Text-to-speech conversion |

---

## Database Schema

### `diseases` table
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | Disease name |
| `crop_type` | TEXT | Associated crop |
| `symptoms` | TEXT | Symptom description |
| `treatment` | TEXT | Treatment recommendations |
| `prevention` | TEXT | Preventive measures |
| `severity` | TEXT | Low / Moderate / High / Critical |
| `image_url` | TEXT | Reference image URL |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

---

## Project Structure

```
├── src/
│   ├── assets/              # Static images
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── HeroSection.tsx  # Landing hero
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── UploadSection.tsx # Image upload & scan trigger
│   │   ├── ScanModal.tsx    # AI analysis modal
│   │   ├── DiseasesSection.tsx # Disease catalog
│   │   ├── Footer.tsx
│   │   └── ThemeLanguageToggle.tsx
│   ├── contexts/
│   │   └── LanguageContext.tsx  # i18n (EN/HI/TE)
│   ├── integrations/
│   │   └── supabase/        # Auto-generated client & types
│   ├── pages/
│   │   ├── Index.tsx        # Main landing page
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Root component with providers
│   └── main.tsx             # Entry point
├── supabase/
│   └── functions/
│       ├── analyze-crop/    # AI disease analysis edge function
│       └── text-to-speech/  # TTS edge function
├── public/                  # Static public assets
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

These are auto-configured when using Lovable Cloud:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Supported Languages

| Code | Language |
|---|---|
| `en` | English |
| `hi` | Hindi (हिंदी) |
| `te` | Telugu (తెలుగు) |

---

## License

This project is private.
