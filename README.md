# Sitecore Migration Simulator

An interactive, step-by-step walkthrough of migrating a legacy Sitecore SXA site to a headless Next.js architecture — component-by-component, with real trade-off decisions at each step.

Built as a project demonstrating deep enterprise CMS expertise and modern front-end architecture knowledge.

## What it covers

10 migration steps across 4 phases:

**Phase 1 — Audit & Architecture**

- Assessing your Sitecore installation (version, rendering mode, component inventory)
- Choosing a headless approach (JSS SDK vs. XM Cloud vs. custom fetch)
- Rendering mode decisions (SSG / ISR / SSR per route type)

**Phase 2 — Component Migration**

- Mapping SXA renderings to React components
- Integrating the Layout Service with typed interfaces
- Migrating the Media Library to `next/image`

**Phase 3 — Advanced Features**

- Personalisation migration (rules engine → edge middleware)
- Search migration (Solr/ContentSearch → Typesense/Algolia)
- Multisite configuration (Sitecore sites config → Next.js middleware)

**Phase 4 — DevOps & Launch**

- CI/CD pipeline (TDS/Unicorn → GitHub Actions + Netlify)

Each step includes real code comparisons (Sitecore before, Next.js after), clickable decision options with trade-off details, and a practical note from real enterprise migrations.

## Tech stack

| Concern             | Choice                                 |
| ------------------- | -------------------------------------- |
| Framework           | Next.js 15 (App Router, static export) |
| Language            | TypeScript (strict)                    |
| Styling             | Tailwind CSS v4                        |
| Icons               | Lucide React                           |
| Syntax highlighting | Shiki (server-rendered, zero runtime)  |
| Fonts               | Inter (Google Fonts via `next/font`)   |
| Hosting             | Netlify (free tier)                    |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Outputs a fully static site to `out/`. No server required.

## Deployment

Deploys automatically to Netlify on push to `main`. See [netlify.toml](netlify.toml) for build config.

To deploy manually:

```bash
npm run build
npx netlify-cli deploy --prod --dir=out
```

## Printable checklist

Navigate to `/print/checklist` for a print-optimised checklist of all 44 migration tasks. Use `Ctrl+P` / `Cmd+P` to save as PDF.

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, fonts
│   ├── page.tsx            # Landing page with hero + simulator
│   ├── globals.css         # CSS custom properties, Tailwind setup
│   └── print/checklist/    # Print-optimised checklist page
├── components/
│   ├── layout/             # Header, Footer
│   ├── simulator/          # Simulator wrapper and step components
│   └── ui/                 # Badge, Button, Callout primitives
├── data/
│   ├── steps.ts            # All 10 migration steps with code examples
│   └── checklist.ts        # Printable checklist items
└── lib/
    ├── highlight.ts        # Shiki syntax highlighting helper
    └── utils.ts            # cn() helper, shared constants
```

## License

MIT — see [LICENSE](LICENSE).
