import HeroSection from "@/components/dashboard/hero-section";
import React from "react";

const page = ({ children }: { children: React.ReactNode }) => {
	return <HeroSection>{children}</HeroSection>;
};

export default page;
