import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import ResponsiveAppBar from "@/components/ui/app-bar";
import Layout from "@/components/dashboard/layout";

import "./globals.css";

const dmSans = DM_Sans({
	variable: "--font-family",
	subsets: ["latin"],
	weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
	title: "Nova",
	description: "AI Builder",
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${dmSans.variable} antialiased`}>
				<ResponsiveAppBar />
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
