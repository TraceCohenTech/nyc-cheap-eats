import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NYC Cheap Eats — The Definitive Deal Directory",
  description: "Every dollar slice, oyster happy hour, taco deal, wing wednesday, bottomless brunch, luxury loophole, and underpriced gem in New York City.",
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
