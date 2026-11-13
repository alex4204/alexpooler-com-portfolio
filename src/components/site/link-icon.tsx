import { CodeXmlIcon, ExternalLinkIcon } from "lucide-react";

import { GitHubIcon } from "@/components/icons/github-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import type { LinkIcon as LinkIconName } from "@/lib/types/navigation";

const ICONS = {
    github: GitHubIcon,
    linkedin: LinkedInIcon,
    code: CodeXmlIcon,
    external: ExternalLinkIcon,
};

const LinkIcon = ({ name }: { name: LinkIconName }) => {
    const Icon = ICONS[name];
    return <Icon aria-hidden="true" />;
};

export { LinkIcon };
