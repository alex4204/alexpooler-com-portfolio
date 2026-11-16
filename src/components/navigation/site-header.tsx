import Link from "next/link";

import { MobileNav } from "@/components/navigation/mobile-nav";
import { SiteTools } from "@/components/navigation/site-tools";
import { getProfile } from "@/lib/content/content";
import { getNavGroups, getSearchItems } from "@/lib/navigation";
import { initialsOf } from "@/lib/utils/initials";
import { askAiLimits } from "@/services/ask-ai/ask-ai";

const SiteHeader = async () => {
    const [profile, navGroups, searchItems] = await Promise.all([
        getProfile(),
        getNavGroups(),
        getSearchItems(),
    ]);
    // h-14 includes the border, so the sidebars that stick at top-14 start
    // exactly where they stick and don't shift when scrolling begins.
    return (
        <header className="sticky top-0 z-30 h-14 border-b border-foreground/10 bg-background/85 backdrop-blur">
            <div className="mx-auto flex h-full max-w-[88rem] items-center gap-2 px-4 sm:gap-3">
                <MobileNav groups={navGroups} />
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-2 font-semibold"
                >
                    <span
                        aria-hidden="true"
                        className="flex size-7 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground"
                    >
                        {initialsOf(profile.name)}
                    </span>
                    {/* Phones show only the initials, to leave room for the tools. */}
                    <span className="sr-only sm:not-sr-only">
                        {profile.name}
                    </span>
                </Link>
                <SiteTools
                    searchItems={searchItems}
                    askAiLimits={askAiLimits}
                    askAiSuggestions={profile.askAiSuggestions}
                    cv={profile.cv}
                />
            </div>
        </header>
    );
};

export { SiteHeader };
