import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartToast from "@/components/CartToast";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import DataInitializer from "@/components/admin/DataInitializer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E93B3C",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://valm-ecommerce.vercel.app"),
  title: {
    default: "Valm Beauty | Belleza y Cuidado Personal en Manizales",
    template: "%s | Valm Beauty",
  },
  description:
    "Tienda virtual de belleza en Manizales. Skincare, perfumes capilares, exfoliantes, cuidado corporal. Marcas: Walaky, Girly, Olé, Fresa Morada. +100 productos originales. Envíos a todo Colombia.",
  applicationName: "Valm Beauty",
  keywords: [
    "belleza Manizales",
    "skincare Manizales",
    "perfumes capilares",
    "Valm Beauty",
    "Click Hair Manizales",
    "cuidado capilar Colombia",
    "Walaky",
    "Girly",
    "cosméticos Manizales",
    "productos de belleza Colombia",
    "tienda de belleza online",
    "envío nacional belleza",
  ],
  authors: [{ name: "Valm Beauty", url: "https://www.instagram.com/valm_beauty_mzl" }],
  creator: "Valm Beauty",
  publisher: "Valm Beauty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Valm Beauty",
    title: "Valm Beauty | Belleza y Cuidado Personal en Manizales",
    description:
      "Tienda virtual de belleza en Manizales. +100 productos originales. Envíos a todo Colombia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Valm Beauty - Belleza y Cuidado Personal en Manizales",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valm Beauty | Belleza en Manizales",
    description:
      "Tienda virtual de belleza. +100 productos originales con envíos a todo Colombia.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
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
    name: "Valm Beauty",
    description:
      "Tienda virtual de belleza y cuidado personal en Manizales. +100 productos originales. Envíos a todo Colombia.",
    url: "https://valm-ecommerce.vercel.app",
    image: "https://valm-ecommerce.vercel.app/logos/logo.png",
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
          <DataInitializer />
          <PopupAnnouncement />
          <CartToast />
          {children}
          <WhatsAppFloatingButton />
        </CartProvider>
      </body>
    </html>
  );
}
