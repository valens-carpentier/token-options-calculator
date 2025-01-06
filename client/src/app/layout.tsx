import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Token Vesting Calculator",
  description: "Calculate the value of your vested tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
