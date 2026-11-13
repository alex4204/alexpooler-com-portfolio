import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { CodeXmlIcon, ExternalLinkIcon } from "lucide-react";

import type { LinkIcon as LinkIconName } from "@/lib/types/navigation";

/** Lucide has no brand logos, so those two come from Tabler, which matches its style. */
const ICONS = {
    github: IconBrandGithub,
    linkedin: IconBrandLinkedin,
    code: CodeXmlIcon,
    external: ExternalLinkIcon,
};

const LinkIcon = ({ name }: { name: LinkIconName }) => {
    const Icon = ICONS[name];
    return <Icon aria-hidden="true" />;
};

export { LinkIcon };
