import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Named import

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import NavBarComponent from "@/components/navbar";

const metadata: Metadata = {
  title: {
    default: "Rent a car",
    template: `% Rent a car`,
  },
  description: "A car rent app Rent a car",
  icons: {
    icon: "https://cdn4.iconfinder.com/data/icons/airport-elements-1/64/CAR_HIRE-Hire-car-rent-travel-512.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <NavBarComponent />
            <main className="container mx-auto max-w-7xl pt-10 px-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
