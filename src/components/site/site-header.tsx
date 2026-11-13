import Link from "next/link";

import { MobileNav } from "@/components/site/mobile-nav";
import { SiteTools } from "@/components/site/site-tools";
import { getProfile } from "@/lib/content/content";
import { getNavGroups, getSearchItems } from "@/lib/navigation";
import { askAiLimits } from "@/services/ask-ai/ask-ai";

const SiteHeader = async () => {
    const [profile, navGroups, searchItems] = await Promise.all([
        getProfile(),
        getNavGroups(),
        getSearchItems(),
    ]);
    return (
        <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/85 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-3 px-4">
                <MobileNav groups={navGroups} />
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                >
                    <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
                        {profile.name[0]}
                    </span>
                    {profile.name}
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
