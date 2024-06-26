import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Home from './page'; // Adjust the path according to your file structure


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zinc",
  description: "website status viewer", // this shouldnt be shown because this is an application, not browser site
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        </ThemeProvider>
        </body>
    </html>
  );
}
