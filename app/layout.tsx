import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata: Metadata = {
  title: "My Wall",
  description: "A little corner of the internet, inspired by the classic social wall.",
};
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
