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


export function getTokenData() {
  // Get the token from cookies
  const token = Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || 'f34bdb07-355f-477d-92d8-78041ac31f57');

  if (!token) {
    console.error('No token found in cookies');
    return null;
  }

  try {
    // Decode the token (no secret needed)
    const decodedData = jwtDecode(token);
    console.log('Decoded token data:', decodedData);
    return decodedData as any;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}


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
