import type { Step } from "./types";

export const steps: Step[] = [
  // ─── PHASE 1: AUDIT & ARCHITECTURE ───────────────────────────────────────

  {
    id: 1,
    phase: 1,
    title: "Assess Your Sitecore Installation",
    subtitle: "Understand your starting point before planning anything else.",
    context:
      "The scope and complexity of your migration depends entirely on what you're migrating from. Sitecore MVC with SXA, vanilla Sitecore MVC, and JSS all require fundamentally different approaches. Attempting to plan a headless migration without this audit is the most common source of blown timelines.",
    severity: "architecture-critical",
    before: {
      label: "Sitecore: SXA Razor view (typical starting point)",
      language: "razor",
      code: `@* SXA Component: PromoComponent.cshtml *@
@using Sitecore.Mvc.Presentation
@model RenderingModel

<div class="component promo @Html.Sitecore().GetComponentCssClassNames()">
  <div class="component-content">
    @if (Model.Item != null)
    {
      <div class="field-promoicon">
        @Html.Sitecore().Field("PromoIcon", Model.Item)
      </div>
      <div class="field-promotext">
        @Html.Sitecore().Field("PromoText", Model.Item)
      </div>
      <div class="field-promolink">
        @Html.Sitecore().Field("PromoLink", Model.Item)
      </div>
    }
  </div>
</div>`,
    },
    after: {
      label: "Inventory output: what you need to catalogue",
      language: "yaml",
      code: `# Migration Audit Checklist Output
sitecore_version: "10.3"
rendering_mode: SXA           # MVC | SXA | JSS

components:
  total: 47
  with_datasources: 38         # → need JSS field mapping
  rendering_parameters_only: 9 # → simpler migration
  custom_mvc_controllers: 6    # → require API endpoints
  third_party_renderings: 4    # → evaluate replace vs wrap

content_tree:
  total_items: 12_400
  media_items: 3_200
  multisite: true
  sites: ["corporate", "regional-emea", "regional-apac"]

personalization:
  rules_in_use: 23
  xdb_dependent: 14            # → evaluate replacement
  content_testing: true

known_risks:
  - Custom pipeline processors: 8
  - Glass.Mapper ORM usage: true  # → replace with typed interfaces
  - Inline presentation details: "~200 items"`,
    },
    decisions: [
      {
        id: "mvc",
        title: "Sitecore MVC (non-SXA)",
        description:
          "Traditional Sitecore MVC with Razor views and controller renderings. No SXA grid, no component variants.",
        pros: [
          "Simpler component structure — one-to-one mapping is straightforward",
          "No SXA-specific abstractions to unpick",
          "Rendering parameters are direct equivalents of React props",
        ],
        cons: [
          "Custom pipeline processors may have no headless equivalent",
          "Glass.Mapper ORM usage needs full replacement with typed interfaces",
          "WebForms remnants in older installs require extra effort",
        ],
      },
      {
        id: "sxa",
        title: "Sitecore SXA",
        description:
          "Site Experience Accelerator — grid-based layout, rendering variants, partial designs, and page designs.",
        pros: [
          "Component structure is already well-defined — good JSS mapping",
          "Rendering variants map cleanly to React component composition",
          "SXA creative exchange assets can be referenced during design system build",
        ],
        cons: [
          "Page designs / partial designs need a Next.js layout strategy",
          "SXA search integration (Solr-backed) needs full replacement",
          "SXA forms require separate migration work",
        ],
        recommended: true,
      },
      {
        id: "jss",
        title: "Sitecore JSS (existing)",
        description:
          "Already running JSS — migrating from Angular/React JSS to Next.js JSS.",
        pros: [
          "Layout Service integration already in place",
          "Component structure is already JS-based",
          "Smaller delta — mostly a framework swap",
        ],
        cons: [
          "Angular JSS → Next.js is a near-full rewrite",
          "React JSS → Next.js JSS is closer to a refactor",
          "Verify JSS package versions — significant API changes between v16 and v21",
        ],
      },
    ],
    practicalNote:
      "On every enterprise Sitecore project I've worked on, the audit phase was the one that uncovered the real complexity — not the component count, but the custom pipeline processors and Glass.Mapper usage. These are the things that take 3x longer than expected. Budget at least two weeks for a thorough audit before committing to a migration timeline.",
  },

  {
    id: 2,
    phase: 1,
    title: "Choose Your Headless Approach",
    subtitle: "Three viable paths — each with real vendor lock-in trade-offs.",
    context:
      "Not all 'headless Sitecore' architectures are equal. Sitecore JSS SDK couples you tightly to Sitecore's Layout Service contract. XM Cloud adds managed infrastructure cost. A custom fetch-based approach gives you full control at the cost of building what the SDK gives you for free. This is the most consequential decision in the migration.",
    severity: "architecture-critical",
    before: {
      label: "Sitecore: Rendering registration (Sitecore.config)",
      language: "xml",
      code: `<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/"
               xmlns:set="http://www.sitecore.net/xmlconfig/set/">
  <sitecore>
    <rendering>
      <!-- SXA Component registration -->
      <renderingContentsResolver>
        <resolvers>
          <resolver name="PromoResolver"
            type="MySite.Feature.Promo.Resolvers.PromoContentsResolver,
                  MySite.Feature.Promo"
            patch:after="resolver[@name='DefaultResolver']" />
        </resolvers>
      </renderingContentsResolver>
    </rendering>

    <!-- Layout Service serialization config -->
    <layoutService>
      <configurations>
        <config name="jss">
          <rendering>
            <renderingContentsResolver
              type="Sitecore.LayoutService.Serialization
                    .RendererContentsResolver, Sitecore.LayoutService" />
          </rendering>
        </config>
      </configurations>
    </layoutService>
  </sitecore>
</configuration>`,
    },
    after: {
      label: "Next.js JSS: Typed component with Layout Service contract",
      language: "tsx",
      code: `// src/components/Promo/index.tsx
import type {
  ComponentRendering,
  TextField,
  LinkField,
  ImageField,
} from "@sitecore-jss/sitecore-jss-nextjs";
import { Text, Link, Image } from "@sitecore-jss/sitecore-jss-react";

interface PromoFields {
  PromoIcon: ImageField;
  PromoText: TextField;
  PromoLink: LinkField;
}

interface PromoProps {
  rendering: ComponentRendering;
  fields: PromoFields;
}

export default function Promo({ fields }: PromoProps): JSX.Element {
  return (
    <div className="promo">
      <Image field={fields.PromoIcon} />
      <Text field={fields.PromoText} tag="p" />
      <Link field={fields.PromoLink} className="promo__link" />
    </div>
  );
}`,
    },
    decisions: [
      {
        id: "jss-sdk",
        title: "Sitecore JSS SDK",
        description:
          "Use @sitecore-jss/sitecore-jss-nextjs — the official SDK with Layout Service integration, editing support, and component factory.",
        pros: [
          "Experience Editor / Pages editing works out of the box",
          "Layout Service contract is handled — no custom fetch logic",
          "Component factory pattern scales to 50+ components cleanly",
          "Mature — used in production at Fortune 500 scale",
        ],
        cons: [
          "Tight vendor coupling — major JSS version updates can be breaking",
          "Opinionated project structure (component factory, layout wrappers)",
          "Slightly larger bundle due to SDK overhead",
        ],
        recommended: true,
      },
      {
        id: "xm-cloud",
        title: "XM Cloud + JSS",
        description:
          "Sitecore's managed SaaS CMS with built-in headless delivery via Edge and GraphQL.",
        pros: [
          "No infrastructure to manage — Sitecore runs on XM Cloud",
          "Edge delivery via Sitecore Experience Edge (CDN-backed)",
          "Included in XM Cloud license — no separate hosting cost",
        ],
        cons: [
          "Requires upgrading to XM Cloud (significant cost/migration in itself)",
          "GraphQL schema learning curve versus REST Layout Service",
          "Less flexibility for custom pipeline work",
        ],
      },
      {
        id: "custom-fetch",
        title: "Custom fetch (SDK-free)",
        description:
          "Call the Layout Service REST API directly with typed interfaces. No JSS SDK dependency.",
        pros: [
          "Zero vendor lock-in — swap the CMS later without touching components",
          "Full control over fetch strategy (ISR, SSG, SSR per route)",
          "Smaller bundle — no SDK code in the client",
        ],
        cons: [
          "You build the component registry, editing integration, and placeholder logic",
          "Experience Editor / Pages inline editing requires significant custom work",
          "More upfront engineering cost",
        ],
      },
    ],
    practicalNote:
      "I've shipped with both JSS SDK and custom fetch in production. JSS SDK is the right call when the client has an active Sitecore license and editors use Experience Editor daily — the editing integration alone saves weeks. Custom fetch makes sense when the CMS contract is up for renewal or the team wants to hedge against future vendor changes. I've never recommended XM Cloud as a migration target mid-project; it's a separate initiative.",
  },

  {
    id: 3,
    phase: 1,
    title: "Choose a Rendering Mode Per Route Type",
    subtitle:
      "SSG, SSR, and ISR are not interchangeable — route type determines the right choice.",
    context:
      "One of the most common Next.js migration mistakes is treating all Sitecore pages the same. Marketing landing pages, search results, user dashboards, and product pages have very different caching and freshness requirements. The rendering mode decision should be made per route type, not once for the whole site.",
    severity: "architecture-critical",
    before: {
      label: "Sitecore: All pages use the same output caching config",
      language: "xml",
      code: `<?xml version="1.0" encoding="utf-8"?>
<!-- Sitecore.Caching.config — one cache config for everything -->
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <sites>
      <site name="website">
        <!-- HTML cache applies globally — no per-route granularity -->
        <patch:attribute name="htmlCacheEnabled">true</patch:attribute>
        <patch:attribute name="htmlCacheDuration">00:30:00</patch:attribute>
        <!-- Personalised content bypasses cache entirely -->
        <patch:attribute name="personalizeContent">true</patch:attribute>
      </site>
    </sites>

    <!-- Output cache varies by item path only -->
    <outputCaching>
      <cacheSettings>
        <setting name="VaryByUser" value="false" />
        <setting name="VaryByQueryString" value="false" />
        <setting name="VaryByParam" value="none" />
      </cacheSettings>
    </outputCaching>
  </sitecore>
</configuration>`,
    },
    after: {
      label: "Next.js: Per-route rendering strategy",
      language: "tsx",
      code: `// Route type examples — each uses a different rendering mode

// ── 1. Marketing page (SSG) ────────────────────────────────────────
// src/app/(marketing)/[slug]/page.tsx
export const dynamic = "force-static";
export const revalidate = false; // build-time only

export async function generateStaticParams() {
  const routes = await getPublishedRoutes(); // fetch from Layout Service
  return routes.map((r) => ({ slug: r.path }));
}

export default async function MarketingPage({ params }: PageProps) {
  const data = await fetch(
    \`\${process.env.SITECORE_API_HOST}/sitecore/api/layout/render/jss?item=\${params.slug}\`,
    { cache: "force-cache" }
  );
  return <PageComposer layout={await data.json()} />;
}

// ── 2. News/blog (ISR) ─────────────────────────────────────────────
// src/app/(news)/news/[slug]/page.tsx
export const revalidate = 3600; // re-generate every hour

// ── 3. Search results (SSR) ───────────────────────────────────────
// src/app/(search)/search/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ── 4. Personalised page (SSR + Edge middleware) ───────────────────
// src/middleware.ts — runs at the CDN edge before the request hits Next.js
export function middleware(req: NextRequest) {
  const segment = req.cookies.get("audience-segment")?.value ?? "default";
  return NextResponse.rewrite(
    new URL(\`/personalised/\${segment}\${req.nextUrl.pathname}\`, req.url)
  );
}`,
    },
    decisions: [
      {
        id: "ssg",
        title: "Static Site Generation (SSG)",
        description:
          "Pages built at deploy time. Best for marketing content that changes on publish, not on request.",
        pros: [
          "Fastest possible TTFB — served from CDN edge",
          "No runtime cost — no server compute per request",
          "Best Core Web Vitals scores (LCP especially)",
        ],
        cons: [
          "Content changes require a new deploy (or revalidation)",
          "Build time grows with page count — 10k+ pages needs incremental builds",
          "Not suitable for user-specific or real-time content",
        ],
        recommended: true,
      },
      {
        id: "isr",
        title: "Incremental Static Regeneration (ISR)",
        description:
          "Pages regenerate in the background after a time window. Best for content that changes frequently but tolerates a few minutes of staleness.",
        pros: [
          "Combines SSG performance with near-real-time content freshness",
          "On-demand revalidation via webhook integrates with Sitecore publish events",
          "Scales to unlimited pages without full rebuilds",
        ],
        cons: [
          "First request after expiry is slower (triggers background regen)",
          "Stale-while-revalidate semantics need to be communicated to content editors",
          "Requires compatible hosting (Netlify, Vercel, self-hosted with cache layer)",
        ],
      },
      {
        id: "ssr",
        title: "Server-Side Rendering (SSR)",
        description:
          "Page rendered on every request. Required for search, filtered listings, and personalized content.",
        pros: [
          "Always fresh — no staleness window",
          "Supports full URL-based personalization and query parameters",
          "Required for authenticated user content",
        ],
        cons: [
          "Slowest TTFB — every request goes to the origin",
          "Higher hosting cost — no CDN cache benefit",
          "Must implement rate limiting and caching at the API layer",
        ],
      },
    ],
    practicalNote:
      "On a recent enterprise migration, we mapped 340 page templates to three rendering modes: SSG for 280 marketing pages, ISR for 45 news/event pages, and SSR for 15 search/filtered pages. We wired Sitecore publish webhooks to Next.js on-demand revalidation so ISR pages update within seconds of a publish — editors felt no difference from the old HTML cache.",
  },

  // ─── PHASE 2: COMPONENT MIGRATION ────────────────────────────────────────

  {
    id: 4,
    phase: 2,
    title: "Map SXA Renderings to React Components",
    subtitle:
      "The Placeholder and datasource model maps cleanly — if you know the pattern.",
    context:
      "SXA renderings are the direct ancestors of JSS components. Every SXA rendering has a datasource template, rendering parameters, and placeholder placement — these map one-to-one to JSS fields, rendering parameters, and the Placeholder component. The key insight: SXA rendering variants become composition in React.",
    severity: "architecture-critical",
    before: {
      label: "SXA: Razor component with placeholder and datasource fields",
      language: "razor",
      code: `@* SXA Hero component — Hero.cshtml *@
@using Sitecore.Mvc.Presentation
@using Sitecore.XA.Foundation.Mvc.Controllers
@model RenderingModel

@{
  var cssClasses = Html.Sitecore().GetComponentCssClassNames();
  var rendering = RenderingContext.Current.Rendering;
  var variant = rendering.Parameters["FieldNames"] ?? "Default";
}

<section class="component hero @cssClasses" data-variant="@variant">
  <div class="component-content container">
    <div class="hero__content">
      @Html.Sitecore().Field("Headline", Model.Item,
        new { @class = "hero__headline" })
      @Html.Sitecore().Field("Subheadline", Model.Item,
        new { tag = "p", @class = "hero__subheadline" })
    </div>
    <div class="hero__media">
      @Html.Sitecore().Field("BackgroundImage", Model.Item,
        new { mw = "1440", mh = "640", @class = "hero__image" })
    </div>
  </div>
  @* Nested placeholder for child components *@
  @Html.Sitecore().Placeholder("hero-content")
</section>`,
    },
    after: {
      label: "JSS Next.js: Typed React component with Placeholder",
      language: "tsx",
      code: `// src/components/Hero/index.tsx
import {
  Placeholder,
  type ComponentRendering,
  type TextField,
  type ImageField,
} from "@sitecore-jss/sitecore-jss-nextjs";
import { Text, Image } from "@sitecore-jss/sitecore-jss-react";
import type { JSX } from "react";

interface HeroFields {
  Headline: TextField;
  Subheadline: TextField;
  BackgroundImage: ImageField;
}

interface HeroProps {
  rendering: ComponentRendering;
  fields: HeroFields;
  params: {
    FieldNames?: string; // maps to SXA variant
    Styles?: string;     // maps to SXA CSS class names
  };
}

export default function Hero({
  rendering,
  fields,
  params,
}: HeroProps): JSX.Element {
  const variant = params.FieldNames ?? "Default";
  const cssClasses = params.Styles ?? "";

  return (
    <section
      className={\`hero \${cssClasses}\`}
      data-variant={variant}
    >
      <div className="hero__content container">
        <Text field={fields.Headline} tag="h1" className="hero__headline" />
        <Text field={fields.Subheadline} tag="p" className="hero__subheadline" />
      </div>
      <div className="hero__media">
        <Image
          field={fields.BackgroundImage}
          width={1440}
          height={640}
          className="hero__image"
          priority
        />
      </div>
      {/* Nested placeholder — direct equivalent of Html.Sitecore().Placeholder() */}
      <Placeholder name="hero-content" rendering={rendering} />
    </section>
  );
}`,
    },
    decisions: [
      {
        id: "jss-fields",
        title: "JSS Field components (Text, Image, Link, RichText)",
        description:
          "Use @sitecore-jss/sitecore-jss-react field components — they handle Experience Editor inline editing automatically.",
        pros: [
          "Inline editing in Experience Editor / Pages works without extra code",
          "Type-safe field interfaces eliminate runtime field access errors",
          "Consistent null-safety — no 'item.Fields[\"Title\"]?.ToString()' patterns",
        ],
        cons: [
          "Adds dependency on jss-react in addition to jss-nextjs",
          "Text component renders a wrapper element — may need tag prop tuning",
        ],
        recommended: true,
      },
      {
        id: "raw-fields",
        title: "Raw field value access",
        description:
          "Access field.value directly and render with standard JSX. Skip the JSS field components.",
        pros: [
          "No extra JSS dependency for rendering",
          "Full control over markup — no wrapper elements",
          "Cleaner for components that never need inline editing",
        ],
        cons: [
          "Inline editing in Experience Editor requires manual EE attribute markup",
          "Null checks must be handled manually",
          "RichText needs dangerouslySetInnerHTML (safe here — content is CMS-managed)",
        ],
      },
    ],
    practicalNote:
      "The Placeholder-to-Placeholder mapping is the cleanest part of an SXA migration. The trickiest are rendering variants — in SXA, a single rendering has multiple display variants driven by a 'FieldNames' parameter. In JSS, you replicate this either with a variant prop pattern (same component, conditional rendering) or separate named components. I prefer the same component with a variant prop for rendering variants with minor differences, and separate components for variants that are structurally different.",
  },

  {
    id: 5,
    phase: 2,
    title: "Integrate the Layout Service",
    subtitle: "Replace MVC route resolution with typed Layout Service fetching.",
    context:
      "In headless Sitecore, the Layout Service is the single source of truth for a page's component tree, datasource data, and context. Understanding its JSON contract — and writing a typed client for it — is the foundation everything else builds on. This is the step where the architecture either holds together or falls apart.",
    severity: "architecture-critical",
    before: {
      label: "Sitecore: MVC route resolution (automatic, implicit)",
      language: "csharp",
      code: `// In traditional Sitecore MVC, routing is handled by
// Sitecore's HttpRequestProcessor pipeline — no code needed.
// The URL resolves to an item in the content tree, which resolves
// to a layout, which resolves to renderings.

// Sitecore.Mvc.Pipelines.HttpRequest.TransferRoutedRequest
// → resolves item from URL
// → reads __Renderings field
// → invokes each rendering's controller/view

// The closest equivalent to "custom routing" is:
// Sitecore.Mvc.Pipelines.Response.RenderRendering
//   .ExecuteRenderer.cs

// Custom pipeline processor example:
public class RedirectProcessor : HttpRequestProcessor
{
    public override void Process(HttpRequestArgs args)
    {
        var item = Sitecore.Context.Item;
        if (item?.Fields["Redirect Target"]?.HasValue == true)
        {
            var target = (LinkField)item.Fields["Redirect Target"];
            HttpContext.Current.Response.Redirect(target.Url, true);
        }
    }
}`,
    },
    after: {
      label: "Next.js: Typed Layout Service client",
      language: "typescript",
      code: `// src/lib/layout-service.ts
import type { LayoutServiceData } from "@sitecore-jss/sitecore-jss-nextjs";

const API_HOST = process.env.SITECORE_API_HOST!;
const API_KEY = process.env.SITECORE_API_KEY!;
const SITE_NAME = process.env.SITECORE_SITE_NAME ?? "website";

interface LayoutOptions {
  language?: string;
  revalidate?: number | false;
}

export async function getLayoutData(
  itemPath: string,
  { language = "en", revalidate = 3600 }: LayoutOptions = {}
): Promise<LayoutServiceData | null> {
  const url = new URL(
    \`\${API_HOST}/sitecore/api/layout/render/jss\`
  );
  url.searchParams.set("item", itemPath);
  url.searchParams.set("sc_apikey", API_KEY);
  url.searchParams.set("sc_site", SITE_NAME);
  url.searchParams.set("sc_lang", language);

  const res = await fetch(url.toString(), {
    next: revalidate === false
      ? { revalidate: false }
      : { revalidate },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(
      \`Layout Service error \${res.status} for \${itemPath}\`
    );
  }

  return res.json() as Promise<LayoutServiceData>;
}

// src/app/[[...path]]/page.tsx — catch-all route for Sitecore content tree
import { notFound } from "next/navigation";
import { getLayoutData } from "@/lib/layout-service";
import PageComposer from "@/components/PageComposer";

interface PageProps {
  params: Promise<{ path?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { path } = await params;
  const itemPath = "/" + (path?.join("/") ?? "");
  const layoutData = await getLayoutData(itemPath);

  if (!layoutData?.sitecore.route) notFound();

  return <PageComposer layout={layoutData} />;
}`,
    },
    decisions: [
      {
        id: "layout-service-rest",
        title: "Layout Service REST API",
        description:
          "Use the /sitecore/api/layout/render/jss endpoint. The original JSS delivery mechanism.",
        pros: [
          "Stable, well-documented contract — works from Sitecore 9.3+",
          "Returns the complete rendering tree in a single request",
          "JSS SDK types align exactly with the REST response shape",
        ],
        cons: [
          "Chatty for multi-language sites — one request per language per page",
          "No batching — 100 pages at build time means 100 HTTP requests",
          "Not available on XM Cloud (which uses Edge/GraphQL)",
        ],
        recommended: true,
      },
      {
        id: "edge-graphql",
        title: "Sitecore Experience Edge (GraphQL)",
        description:
          "Use the Edge GraphQL endpoint — required for XM Cloud, available for XM/XP with the Edge module.",
        pros: [
          "CDN-cached at the edge — dramatically lower latency",
          "Batching via DataLoader pattern — efficient for large sites",
          "Only pay for the fields you query — smaller response payloads",
        ],
        cons: [
          "GraphQL schema must be learned and maintained",
          "Edge module requires separate Sitecore licence/config",
          "JSS SDK types need mapping layer for Edge response shape",
        ],
      },
    ],
    practicalNote:
      "The catch-all route [[...path]] is the right pattern for Sitecore because the content tree is the routing authority, not the Next.js file system. The pattern I use in production wraps getLayoutData in a client class that handles multi-site resolution, language fallback, and circuit-breaking on Layout Service downtime — important for resilience in enterprise environments where the Sitecore CM can go offline during deployments.",
  },

  {
    id: 6,
    phase: 2,
    title: "Migrate Media Library to next/image",
    subtitle:
      "Replace sc:Image with next/image and plan your CDN strategy for media assets.",
    context:
      "Sitecore's media library is a managed asset store with built-in image resizing via URL parameters. next/image provides a modern equivalent — but you need to decide how media URLs are served in headless mode. This decision affects build time, CDN costs, and editor workflow.",
    severity: "recommended",
    before: {
      label: "SXA Razor: sc:Image with server-side resize parameters",
      language: "razor",
      code: `@* SXA Image rendering — several ways to render images in Sitecore *@

@* 1. Html helper — most common in SXA *@
@Html.Sitecore().Field("HeroImage", Model.Item, new {
  mw = 1440,
  mh = 640,
  @class = "hero__image",
  alt = "Override alt here"
})

@* 2. Glass.Mapper strongly-typed (common in enterprise) *@
@{
  var image = (Glass.Mapper.Sc.Fields.Image)Model.HeroImage;
}
<img src="@Sitecore.Resources.Media.MediaManager.GetMediaUrl(image.MediaItem,
  new Sitecore.Resources.Media.MediaUrlOptions {
    Width = 1440, Height = 640, AlwaysIncludeServerUrl = false
  })"
  alt="@image.Alt"
  class="hero__image"
  loading="lazy" />

@* 3. sc:Image web control (older pattern) *@
<sc:Image ID="HeroImage" Field="HeroImage" Parameters="mw=1440&mh=640"
  CssClass="hero__image" runat="server" />`,
    },
    after: {
      label: "Next.js: next/image with Sitecore Media Library URL helper",
      language: "tsx",
      code: `// src/lib/media.ts — URL helper for Sitecore media in headless mode
interface MediaUrlOptions {
  width?: number;
  height?: number;
}

export function getSitecoreMediaUrl(
  src: string,
  { width, height }: MediaUrlOptions = {}
): string {
  if (!src) return "";

  // Sitecore media URLs look like:
  // /-/media/Images/hero.ashx?h=640&w=1440&hash=ABC
  // In headless mode we proxy them through the CM or a CDN
  const url = new URL(src, process.env.SITECORE_API_HOST);
  if (width) url.searchParams.set("w", String(width));
  if (height) url.searchParams.set("h", String(height));
  return url.toString();
}

// next.config.ts — allow Sitecore media domain
// images: { remotePatterns: [{ hostname: "cm.yoursite.com" }] }

// src/components/Hero/index.tsx
import NextImage from "next/image";
import { getSitecoreMediaUrl } from "@/lib/media";
import type { ImageField } from "@sitecore-jss/sitecore-jss-nextjs";

interface HeroMediaProps {
  field: ImageField;
  priority?: boolean;
}

export function HeroMedia({ field, priority = false }: HeroMediaProps) {
  const src = field.value?.src ?? "";
  const alt = field.value?.alt ?? "";
  const width = Number(field.value?.width ?? 1440);
  const height = Number(field.value?.height ?? 640);

  if (!src) return null;

  return (
    <NextImage
      src={getSitecoreMediaUrl(src, { width, height })}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1440px"
    />
  );
}`,
    },
    decisions: [
      {
        id: "direct-cm",
        title: "Direct CM media serving",
        description:
          "Proxy media requests through the Sitecore CM server. Simple setup, works immediately.",
        pros: [
          "No additional infrastructure — works with existing Sitecore",
          "Sitecore's media resize API still applies (mw/mh params)",
          "Fastest to implement",
        ],
        cons: [
          "CM server becomes a CDN origin — adds load to the CMS",
          "No edge caching without additional CDN in front",
          "CM downtime affects media serving",
        ],
      },
      {
        id: "cdn-dam",
        title: "External CDN or DAM",
        description:
          "Migrate media to a CDN-native DAM (Cloudinary, Imgix, Cloudflare Images). Re-point media fields during migration.",
        pros: [
          "Best performance — global CDN delivery with edge resize",
          "Decouples media from Sitecore — clean separation of concerns",
          "Modern image formats (AVIF, WebP) without CM config",
        ],
        cons: [
          "Migration effort — 3,000+ media items need re-ingesting",
          "DAM cost (though Cloudinary free tier covers most portfolio projects)",
          "Editors must learn new DAM workflow",
        ],
        recommended: true,
      },
    ],
    practicalNote:
      "On real projects, I've shipped with direct CM serving for phase 1 (quick win) and planned a DAM migration for phase 2. This avoids blocking the headless go-live on a full media migration. The trick is building the media URL helper as an abstraction from day one so you can swap the source (CM → DAM) with a one-line config change, not a component rewrite.",
  },

  // ─── PHASE 3: ADVANCED FEATURES ──────────────────────────────────────────

  {
    id: 7,
    phase: 3,
    title: "Migrate Personalization Logic",
    subtitle:
      "Sitecore rules engine has a headless equivalent — but the model shifts.",
    context:
      "Sitecore's personalization model is tightly coupled to the MVC request pipeline. In headless mode, personalization must move to the edge (middleware) or be driven by the Layout Service's built-in conditional rendering. The right approach depends on whether your personalization is content-based or behavior-based.",
    severity: "recommended",
    before: {
      label: "Sitecore: Content Editor personalization rule",
      language: "xml",
      code: `<?xml version="1.0" encoding="utf-8"?>
<!-- Sitecore personalization rule stored on the rendering item -->
<!-- Accessed via: item["__Renderings"] field serialized as XML -->
<r xmlns:p="p" xmlns:s="s" p:after="*[@id='{DEFAULT-RENDERING-GUID}']"
  s:id="{HERO-RENDERING-GUID}"
  s:ds="{PREMIUM-DATASOURCE-GUID}"
  s:par="FieldNames=PremiumVariant&amp;Styles=hero--premium"
  s:ph="main">
  <r:p>
    <!-- Condition: visitor is in 'Premium' audience segment -->
    <p:p>
      <condition id="{AUDIENCE-CONDITION-GUID}"
        description="Is Premium Member"
        icon="applications/16x16/personal.png"
        type="Sitecore.Analytics.Rules.Conditions
              .HasValue, Sitecore.Analytics"
        operator="{EQUALS-OPERATOR-GUID}"
        value="PremiumMember" />
    </p:p>
    <!-- Action: swap datasource to premium content item -->
    <p:a>
      <action id="{SET-DATASOURCE-ACTION-GUID}"
        type="Sitecore.Analytics.Rules.Actions
              .SetDatasource, Sitecore.Analytics"
        DataSource="{PREMIUM-DATASOURCE-GUID}" />
    </p:a>
  </r:p>
</r>`,
    },
    after: {
      label: "Next.js: Edge Middleware-based personalization",
      language: "typescript",
      code: `// src/middleware.ts
// Runs at the CDN edge before requests reach Next.js
import { NextRequest, NextResponse } from "next/server";

type AudienceSegment = "premium" | "returning" | "default";

function getAudienceSegment(req: NextRequest): AudienceSegment {
  // Check membership cookie set by auth service
  const tier = req.cookies.get("membership-tier")?.value;
  if (tier === "premium") return "premium";

  // Check returning visitor cookie
  const visits = req.cookies.get("visit-count")?.value;
  if (Number(visits) > 2) return "returning";

  return "default";
}

export function middleware(req: NextRequest) {
  const segment = getAudienceSegment(req);

  // Pass segment as header — Layout Service fetch in page.tsx reads this
  // and requests the appropriate Sitecore personalization variant
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-audience-segment", segment);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Only run on content pages — skip API routes, static assets
    "/((?!api|_next/static|_next/image|favicon|.*\\\\..*).*)"],
};

// src/lib/layout-service.ts — pass segment to Layout Service
export async function getLayoutData(itemPath: string, segment: string) {
  const url = new URL(\`\${API_HOST}/sitecore/api/layout/render/jss\`);
  url.searchParams.set("item", itemPath);
  url.searchParams.set("sc_apikey", API_KEY);
  // Sitecore JSS 21+ supports audience segment as a query parameter
  url.searchParams.set("sc_segment", segment);
  return fetch(url.toString(), { next: { revalidate: 0 } });
}`,
    },
    decisions: [
      {
        id: "layout-service-personalization",
        title: "Layout Service built-in personalization",
        description:
          "Let Sitecore evaluate personalization rules server-side in the Layout Service response. Segment is passed as a query parameter.",
        pros: [
          "Personalization rules stay in Sitecore — no logic duplication",
          "Content editors continue using the familiar rules interface",
          "Works with existing Sitecore xConnect data",
        ],
        cons: [
          "Requires SSR (or ISR with very short TTL) — personalised pages can't be statically cached",
          "Layout Service must be called per-segment, per-page",
          "xDB license required for behavior-based rules",
        ],
        recommended: true,
      },
      {
        id: "edge-middleware",
        title: "Edge Middleware + static variants",
        description:
          "Build multiple static variants of each page at build time, then use edge middleware to route to the right variant based on cookies/headers.",
        pros: [
          "Static page performance even for personalised content",
          "No Sitecore runtime dependency for page delivery",
          "Works without xDB — segment detection in your own cookie/auth layer",
        ],
        cons: [
          "N variants × M pages can balloon build time significantly",
          "Rules are in code, not Sitecore — content editors can't change them",
          "Segment logic must be duplicated between middleware and build pipeline",
        ],
      },
    ],
    practicalNote:
      "The honest answer is that enterprise-grade Sitecore personalization (xDB, ML-based optimization, A/B testing) doesn't have a clean headless equivalent that preserves all capabilities. What does transfer cleanly: content-swapping based on known audience segments. What needs a new platform decision: behavioral targeting, ML optimization, and conversion goal tracking — these should be evaluated as separate tools (LaunchDarkly, Optimizely Feature Flags, or Netlify Split Testing) rather than migrated.",
  },

  {
    id: 8,
    phase: 3,
    title: "Migrate Search",
    subtitle:
      "Solr/ContentSearch has no headless mode — you need a dedicated search service.",
    context:
      "Sitecore's ContentSearch API is a server-side abstraction over Solr or Azure Search. It has no REST endpoint suitable for browser consumption. In headless mode, you need a dedicated search service. The good news: modern search platforms (Typesense, Algolia, Meilisearch) have free tiers suitable for all but the highest-volume sites.",
    severity: "recommended",
    before: {
      label: "Sitecore: ContentSearch API with Solr backend",
      language: "csharp",
      code: `// Sitecore.ContentSearch — C# only, server-side
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.Linq;
using Sitecore.ContentSearch.SearchTypes;

public class SearchService
{
    public IEnumerable<SearchResult> Search(
        string query,
        string language = "en",
        int pageSize = 10,
        int page = 0)
    {
        // Index name follows Sitecore convention
        var indexName = $"sitecore_{Sitecore.Context.Site.Name}_index";
        var index = ContentSearchManager.GetIndex(indexName);

        using var context = index.CreateSearchContext();
        var results = context
            .GetQueryable<SearchResultItem>()
            .Filter(i => i.Language == language)
            .Filter(i => i.TemplateName == "Article Page")
            .Where(i => i.Content.Contains(query))
            .OrderByDescending(i => i["score"])
            .FacetOn(i => i["_templatename"])
            .FacetOn(i => i["articlecategory_sm"])
            .Page(page, pageSize)
            .GetResults();

        return results.Hits.Select(h => new SearchResult {
            Title = h.Document["title"],
            Url = h.Document["url"],
            Summary = h.Document["summary"],
            Score = h.Score,
        });
    }
}`,
    },
    after: {
      label: "Typesense: Free, self-hostable search with InstantSearch UI",
      language: "tsx",
      code: `// src/lib/search.ts — Typesense client setup (free, MIT licensed)
import Typesense from "typesense";

// Collection schema — defined once, matches your Sitecore item structure
export const articleSchema = {
  name: "articles",
  fields: [
    { name: "id", type: "string" as const },
    { name: "title", type: "string" as const, infix: true },
    { name: "summary", type: "string" as const },
    { name: "content", type: "string" as const },
    { name: "url", type: "string" as const, index: false },
    { name: "category", type: "string" as const, facet: true },
    { name: "published_at", type: "int64" as const, sort: true },
  ],
  default_sorting_field: "published_at",
};

export const searchClient = new Typesense.Client({
  apiKey: process.env.TYPESENSE_SEARCH_KEY!,
  nodes: [{
    host: process.env.TYPESENSE_HOST!,
    port: 443,
    protocol: "https",
  }],
  connectionTimeoutSeconds: 5,
});

// src/components/Search/SearchResults.tsx
"use client";
import { useState, useTransition } from "react";
import { searchArticles } from "@/app/actions/search";

export function SearchResults() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(query: string) {
    startTransition(async () => {
      const data = await searchArticles(query);
      setResults(data);
    });
  }

  return (
    <div role="search">
      <input
        type="search"
        aria-label="Search articles"
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
      {isPending && <p aria-live="polite">Searching...</p>}
      <ul aria-label="Search results" aria-live="polite">
        {results.map((r) => (
          <li key={r.id}>
            <a href={r.url}>{r.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
    decisions: [
      {
        id: "typesense",
        title: "Typesense (self-hosted or cloud, free tier)",
        description:
          "Open-source, typo-tolerant search. Self-host on a $5/month VPS or use Typesense Cloud free tier.",
        pros: [
          "MIT licensed — no vendor lock-in, can self-host",
          "Excellent developer experience and clear documentation",
          "Instant search with typo tolerance out of the box",
          "Free tier covers most content sites",
        ],
        cons: [
          "Self-hosting requires infrastructure management",
          "Less mature ecosystem than Algolia",
          "No built-in AI/semantic search (though growing fast)",
        ],
        recommended: true,
      },
      {
        id: "algolia",
        title: "Algolia",
        description:
          "Hosted search-as-a-service. Industry standard. Free tier available (10k records, 10k search ops/month).",
        pros: [
          "Best-in-class developer tooling and React InstantSearch library",
          "AI search (NeuralSearch) included on paid plans",
          "Extensive Sitecore indexing connector available",
        ],
        cons: [
          "Pricing can escalate quickly on high-volume content sites",
          "Vendor lock-in risk — switching from Algolia is non-trivial",
          "Free tier limits are tight for enterprise content volumes",
        ],
      },
      {
        id: "sitecore-search",
        title: "Sitecore Search (formerly Discover)",
        description:
          "Sitecore's own hosted search product with a headless API.",
        pros: [
          "Native Sitecore integration — no separate indexing pipeline",
          "Personalized search results via Sitecore CDP",
          "Single vendor relationship",
        ],
        cons: [
          "Additional Sitecore product licence cost",
          "Less flexible API than Typesense/Algolia for custom UIs",
          "Increases vendor dependency",
        ],
      },
    ],
    practicalNote:
      "Search indexing is the part of the migration nobody wants to think about until the last sprint. The pattern that works: build a Sitecore publish webhook that fires on item publish, calls a Next.js API route, which upserts the document in Typesense. This gives you near-real-time search index updates without a full Solr dependency. I've used this pattern on live sites with 50k+ content items.",
  },

  {
    id: 9,
    phase: 3,
    title: "Handle Multisite Configuration",
    subtitle:
      "Next.js middleware replaces Sitecore's site resolver — with more flexibility.",
    context:
      "Many enterprise Sitecore installs run multiple sites from a single CM instance. In headless mode, site resolution moves to Next.js middleware. This is actually an improvement — you get hostname-based routing, locale routing, and subdirectory routing all composable in one middleware function.",
    severity: "recommended",
    before: {
      label: "Sitecore: Multisite config (Sitecore.config sites node)",
      language: "xml",
      code: `<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <sites>
      <!-- Corporate site — primary domain -->
      <site name="corporate"
        rootPath="/sitecore/content/Sites/Corporate"
        startItem="/Home"
        language="en"
        hostname="corporate.example.com"
        virtualFolder="/"
        physicalFolder="/"
        enableTracking="true"
        patch:before="site[@name='website']" />

      <!-- EMEA regional site — subdomain -->
      <site name="regional-emea"
        rootPath="/sitecore/content/Sites/Regional-EMEA"
        startItem="/Home"
        language="en-GB"
        hostname="emea.example.com"
        virtualFolder="/"
        physicalFolder="/"
        patch:before="site[@name='website']" />

      <!-- Subdirectory-based site (less common but real) -->
      <site name="microsite"
        rootPath="/sitecore/content/Sites/Microsite"
        startItem="/Home"
        language="en"
        hostname="corporate.example.com"
        virtualFolder="/products"
        physicalFolder="/products"
        patch:before="site[@name='website']" />
    </sites>
  </sitecore>
</configuration>`,
    },
    after: {
      label: "Next.js: Middleware-based multisite routing",
      language: "typescript",
      code: `// src/middleware.ts — runs at the edge, resolves site context
import { NextRequest, NextResponse } from "next/server";

interface SiteConfig {
  name: string;
  language: string;
  rootPath: string;
}

// Mirrors your Sitecore sites config
const SITE_MAP: Record<string, SiteConfig> = {
  "corporate.example.com": {
    name: "corporate",
    language: "en",
    rootPath: "/sites/corporate",
  },
  "emea.example.com": {
    name: "regional-emea",
    language: "en-GB",
    rootPath: "/sites/emea",
  },
};

const SUBDIRECTORY_SITES: Record<string, SiteConfig> = {
  "/products": {
    name: "microsite",
    language: "en",
    rootPath: "/sites/microsite",
  },
};

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host")?.split(":")[0] ?? "";
  const pathname = req.nextUrl.pathname;

  // 1. Check subdirectory-based sites first (more specific)
  const subSite = Object.entries(SUBDIRECTORY_SITES).find(([prefix]) =>
    pathname.startsWith(prefix)
  );
  if (subSite) {
    const [, config] = subSite;
    return applySiteContext(req, config);
  }

  // 2. Hostname-based resolution
  const site = SITE_MAP[hostname];
  if (site) return applySiteContext(req, site);

  // 3. Default fallback
  return applySiteContext(req, SITE_MAP["corporate.example.com"]);
}

function applySiteContext(req: NextRequest, site: SiteConfig): NextResponse {
  const headers = new Headers(req.headers);
  headers.set("x-site-name", site.name);
  headers.set("x-site-language", site.language);
  return NextResponse.rewrite(
    new URL(\`\${site.rootPath}\${req.nextUrl.pathname}\`, req.url),
    { request: { headers } }
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\\\..*).*)"],
};`,
    },
    decisions: [
      {
        id: "middleware-routing",
        title: "Next.js middleware multisite routing",
        description:
          "Handle all site resolution in a single middleware function. Sites are configured as a TypeScript object mirroring Sitecore's sites config.",
        pros: [
          "Runs at the CDN edge — zero latency for site resolution",
          "Composable with personalization, locale, and auth middleware",
          "TypeScript config is version-controlled and reviewable",
          "A/B test new site configs without touching Sitecore",
        ],
        cons: [
          "Site config duplicated between Sitecore and Next.js — must stay in sync",
          "Adding a new site requires a code deploy",
          "Middleware bundle size limit (1MB compressed) — keep it lean",
        ],
        recommended: true,
      },
      {
        id: "next-i18n",
        title: "Next.js built-in i18n routing",
        description:
          "Use Next.js internationalized routing for language-based site separation. Works well when sites differ only by language.",
        pros: [
          "Built-in — no custom middleware needed for language routing",
          "URL structure (/en/, /de/, /ar/) handled automatically",
          "next-intl library provides excellent middleware integration",
        ],
        cons: [
          "Language-based only — can't handle subdomain or subdirectory multisite",
          "Less flexible for Sitecore's site model where sites differ by content root, not just language",
          "Harder to replicate Sitecore's language fallback behaviour",
        ],
      },
    ],
    practicalNote:
      "The multisite middleware pattern above is close to what Sitecore's own JSS starter kit uses internally. One thing the code above doesn't show: you also want to pass the site name to the Layout Service fetch so Sitecore returns the right content tree root. In production, I pipe x-site-name through the request headers chain to the Layout Service call.",
  },

  // ─── PHASE 4: DEVOPS & LAUNCH ─────────────────────────────────────────────

  {
    id: 10,
    phase: 4,
    title: "Set Up the CI/CD Pipeline",
    subtitle:
      "From TDS/Unicorn sync scripts to GitHub Actions + Netlify deploy previews.",
    context:
      "Traditional Sitecore CI/CD is complex — TDS projects, Unicorn serialization, slow build agents, and manual deployment steps are common. Headless Next.js CI/CD is dramatically simpler. GitHub Actions + Netlify gives you branch deploy previews, atomic deploys, rollback, and build caching in a few dozen lines of YAML.",
    severity: "recommended",
    before: {
      label: "Old pipeline: TDS MSBuild deploy to Sitecore (simplified)",
      language: "yaml",
      code: `# TeamCity build configuration (pseudoconfig)
# A real enterprise pipeline often spans 800+ lines across multiple files

steps:
  - name: "Restore NuGet packages"
    command: nuget restore MySite.sln

  - name: "Build solution (includes TDS projects)"
    command: |
      msbuild MySite.sln /p:Configuration=Release
        /p:SitecoreWebUrl=http://cm.corp.internal
        /p:SitecoreDeployFolder=\\\\cm-server\\inetpub\\wwwroot
        /p:SitecoreAccessGuid=%SITECORE_ACCESS_GUID%
        /p:InstallSitecorePackage=True
    # This deploys Sitecore items AND binaries simultaneously

  - name: "Deploy to staging"
    command: |
      robocopy .\\bin\\Release \\\\staging-cm\\inetpub\\wwwroot\\bin
      robocopy .\\website \\\\staging-cm\\inetpub\\wwwroot /E /XD node_modules
    # robocopy on a live IIS server — a prayer in three parameters

  - name: "Warm up IIS after deploy"
    command: |
      curl -s http://staging-cm/ > NUL
      timeout 30
      curl -s http://staging-cd/ > NUL

  - name: "Run smoke tests"
    command: vstest.console.exe MySite.Tests.dll /TestCaseFilter:Category=Smoke

# Rollback: revert TDS item serialization in source control,
# rebuild, and redeploy. Average: 45 minutes.`,
    },
    after: {
      label: "New pipeline: GitHub Actions + Netlify (~40 lines)",
      language: "yaml",
      code: `# .github/workflows/deploy.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          SITECORE_API_HOST: \${{ secrets.SITECORE_API_HOST }}
          SITECORE_API_KEY: \${{ secrets.SITECORE_API_KEY }}
          SITECORE_SITE_NAME: \${{ secrets.SITECORE_SITE_NAME }}

      # Production deploy on main push
      - name: Deploy to production
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: npx netlify-cli deploy --prod --dir=out
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}

      # Preview deploy on pull requests
      - name: Deploy preview
        if: github.event_name == 'pull_request'
        run: |
          DEPLOY_URL=$(npx netlify-cli deploy --dir=out --json | jq -r .deploy_url)
          echo "Preview URL: $DEPLOY_URL"
          gh pr comment \${{ github.event.pull_request.number }} \\
            --body "Deploy preview ready: $DEPLOY_URL"
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

# Rollback: click "Publish deploy" on any previous deploy in Netlify UI.
# Average: 12 seconds.`,
    },
    decisions: [
      {
        id: "netlify",
        title: "Netlify (free tier)",
        description:
          "Static host with atomic deploys, branch previews, and edge functions. Free tier covers most portfolio and mid-scale sites.",
        pros: [
          "Atomic deploys — zero-downtime, instant rollback",
          "Automatic deploy previews for every PR",
          "Free tier: 300 build minutes/month, 100GB bandwidth",
          "Native Next.js static export support",
        ],
        cons: [
          "Next.js server features (SSR, API routes) require Netlify Functions or Edge",
          "Free tier build minutes can run out on CI-heavy workflows",
          "Netlify adapter needed for non-static Next.js features",
        ],
        recommended: true,
      },
      {
        id: "vercel",
        title: "Vercel",
        description:
          "Created by the Next.js team. Best-in-class Next.js support including SSR, ISR, and Edge Runtime.",
        pros: [
          "Zero-config Next.js deployment — all features work natively",
          "Edge network optimized for Next.js ISR and middleware",
          "Best observability tooling for Next.js (built-in analytics, logs)",
        ],
        cons: [
          "Free tier has commercial use restrictions",
          "Team plans can be expensive for enterprise deployments",
          "Some enterprise clients prefer not to use Vercel for compliance reasons",
        ],
      },
      {
        id: "self-hosted",
        title: "Self-hosted (Docker + Nginx)",
        description:
          "Run Next.js in standalone mode on your own infrastructure. Full control, no vendor dependency.",
        pros: [
          "No vendor lock-in — runs on any cloud or on-premise",
          "Required for air-gapped or regulated environments",
          "Full control over infrastructure, scaling, and security",
        ],
        cons: [
          "Significant DevOps overhead compared to managed platforms",
          "Must implement CDN, SSL, and deploy orchestration yourself",
          "ISR and Edge middleware require custom caching layer",
        ],
      },
    ],
    practicalNote:
      "The pipeline above is production-grade — I've used this exact pattern on Sitecore headless migrations at enterprises where the Sitecore pipeline previously required a dedicated build engineer. The most impactful change for the team isn't the deploy speed, it's the PR preview environments. Content editors can see exactly what a component looks like before the PR is merged, which eliminates most back-and-forth on visual QA.",
  },
];
