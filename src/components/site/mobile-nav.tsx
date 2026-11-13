"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { SidebarNav } from "@/components/site/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { NavGroup } from "@/lib/types/navigation";

const MobileNav = ({ groups }: { groups: NavGroup[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="lg:hidden"
                onPress={() => setIsOpen(true)}
            >
                <MenuIcon />
            </Button>
            <Sheet side="left" isOpen={isOpen} onOpenChange={setIsOpen}>
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2">
                    <SidebarNav
                        groups={groups}
                        layoutId="mobile-sidebar"
                        onNavigate={() => setIsOpen(false)}
                    />
                </div>
            </Sheet>
        </>
    );
};

export { MobileNav };
