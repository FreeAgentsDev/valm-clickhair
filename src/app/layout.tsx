import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartToast from "@/components/CartToast";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D62839",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://valm-ecommerce.vercel.app"),
  title: {
    default: "Valm Beauty & Click Hair | Belleza y Cuidado Capilar en Manizales",
    template: "%s | Valm Beauty & Click Hair",
  },
  description:
    "Tienda virtual de belleza en Manizales. Valm Beauty: skincare, perfumes capilares, exfoliantes Walaky, Girly, Olé, Fresa Morada. Click Hair: perfumes para cabello, miel, mantequillas con glitter. Envíos a todo Colombia 🇨🇴",
  keywords: [
    "belleza Manizales",
    "skincare Manizales",
    "perfumes capilares",
    "Click Hair Manizales",
    "Valm Beauty",
    "cuidado capilar Colombia",
    "Walaky",
    "Girly",
    "cosméticos Manizales",
  ],
  authors: [{ name: "Valm Beauty & Click Hair", url: "https://www.instagram.com/valm_beauty_mzl" }],
  creator: "Valm Beauty",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Valm Beauty & Click Hair",
    title: "Valm Beauty & Click Hair | Belleza y Cuidado Capilar en Manizales",
    description:
      "Tienda virtual de belleza en Manizales. Productos de Valm Beauty y Click Hair. Envíos a todo Colombia.",
    images: [{ url: "/logos/valmlogo.png", width: 512, height: 512, alt: "Valm Beauty Logo" }],
  },
  twitter: {
    card: "summary",
    title: "Valm Beauty & Click Hair | Belleza en Manizales",
    description: "Tienda virtual de belleza. Productos Valm Beauty y Click Hair. Envíos a Colombia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Valm Beauty & Click Hair",
    description:
      "Tienda virtual de belleza y cuidado capilar en Manizales. Productos Valm Beauty y Click Hair. Envíos a todo Colombia.",
    url: "https://valm-ecommerce.vercel.app",
    image: "https://valm-ecommerce.vercel.app/logos/valmlogo.png",
    telephone: "+57-310-407-7106",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cra 23A # 60-11 Tienda Virtual",
      addressLocality: "Manizales",
      addressRegion: "Caldas",
      addressCountry: "CO",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:30",
      closes: "18:30",
    },
    sameAs: [
      "https://www.instagram.com/valm_beauty_mzl",
      "https://www.instagram.com/click_hair_manizales",
    ],
  };

  return (
    <html lang="es-CO">
      <body
        className={`${plusJakarta.variable} font-sans antialiased text-gray-900`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <CartToast />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
