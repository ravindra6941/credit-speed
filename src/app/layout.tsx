import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Credit Speed — Smartphone EMI Solutions for Bharat",
  description:
    "Credit Speed Microfinance Private Limited partners with mobile retailers across Uttar Pradesh to offer instant smartphone EMI financing. Powered by RBI-registered NBFCs.",
};

// No-flash theme script — runs BEFORE hydration so the page paints in the
// correct theme on first frame. Falls back to system preference if no choice
// has been saved.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('cs-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased grain">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
