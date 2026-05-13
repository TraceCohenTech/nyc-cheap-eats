import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NYC Cheap Eats — The Definitive Deal Directory",
  description: "Every dollar slice, oyster happy hour, taco deal, wing wednesday, bottomless brunch, luxury loophole, and underpriced gem in New York City.",
  openGraph: {
    title: "NYC Cheap Eats — The Definitive Deal Directory",
    description: "170+ dollar slices, oyster hours, taco deals, bottomless brunches, and hidden gems in New York City. Filter by price, neighborhood, or what's open right now.",
    url: "https://valueaddvc.com/nyc-cheap-eats",
    siteName: "NYC Cheap Eats",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "NYC Cheap Eats — Street food and deals in New York City",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYC Cheap Eats — The Definitive Deal Directory",
    description: "170+ dollar slices, oyster hours, taco deals, bottomless brunches, and hidden gems in New York City.",
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=630&fit=crop&q=80"],
    creator: "@Trace_Cohen",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
