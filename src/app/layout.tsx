import { Suspense } from "react";
import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";

import { MotionProvider } from "@/components/site/motion-provider";
import { SidebarNav, SidebarNavList } from "@/components/site/sidebar-nav";
import { SiteHeader } from "@/components/site/site-header";
import { getProfile } from "@/lib/content/content";
import { getPageMetadata } from "@/lib/site-metadata/page-metadata";
import { getNavGroups } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";

import "./globals.css";

const sourceSerif = Source_Serif_4({
    subsets: ["latin"],
    variable: "--font-source-serif",
});

const generateMetadata = async (): Promise<Metadata> => {
    const profile = await getProfile();
    return {
        ...(await getPageMetadata({ description: profile.tagline, path: "/" })),
        metadataBase: new URL(profile.url),
        title: { default: profile.name, template: `%s · ${profile.name}` },
    };
};

const RootLayout = async ({ children }: LayoutProps<"/">) => {
    const navGroups = await getNavGroups();
    return (
        <html
            lang="en-GB"
            suppressHydrationWarning
            className={cn(sourceSerif.variable, "antialiased")}
        >
            <head>
                {/* Blocks rendering on purpose: it applies the theme toggle's
                    choice before the first paint, so it never flashes. That
                    edits <html> before React loads, hence
                    suppressHydrationWarning above. */}
                {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                <script src="/theme.js" />
            </head>
            <body className="min-h-screen">
                <MotionProvider>
                    <SiteHeader />
                    <div className="mx-auto flex max-w-[88rem]">
                        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-foreground/10 px-2 lg:block">
                            <Suspense
                                fallback={<SidebarNavList groups={navGroups} />}
                            >
                                <SidebarNav groups={navGroups} />
                            </Suspense>
                        </aside>
                        {children}
                    </div>
                </MotionProvider>
            </body>
        </html>
    );
};

export { generateMetadata };
export default RootLayout;
