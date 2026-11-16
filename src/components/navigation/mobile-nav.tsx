"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel/panel";
import { PanelHeader } from "@/components/ui/panel/panel-header";
import { PanelTitle } from "@/components/ui/panel/panel-title";
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
            <Panel side="left" isOpen={isOpen} onOpenChange={setIsOpen}>
                <PanelHeader>
                    <PanelTitle>Menu</PanelTitle>
                </PanelHeader>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2">
                    <SidebarNav
                        groups={groups}
                        layoutId="mobile-sidebar"
                        onNavigate={() => setIsOpen(false)}
                    />
                </div>
            </Panel>
        </>
    );
};

export { MobileNav };
