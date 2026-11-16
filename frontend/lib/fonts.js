import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

export const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});

export const label = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-label-face",
  display: "swap",
});

export const siteFonts = `${display.variable} ${body.variable} ${label.variable}`;
