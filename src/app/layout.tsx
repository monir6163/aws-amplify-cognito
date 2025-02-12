import { inter } from "@/components/ui/fonts";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import ConfigureAmplifyClientSide from "./amplify-cognito-config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Cognito Authentication",
  description: "Cognito authenticated Next.js app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <>
          <ConfigureAmplifyClientSide />
          {children}
          <Toaster richColors closeButton position="top-center" />
        </>
      </body>
    </html>
  );
}
