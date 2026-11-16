"use client";

import {
    Disclosure as CollapsiblePrimitive,
    type DisclosureProps,
} from "react-aria-components";

const Collapsible = (props: DisclosureProps) => (
    <CollapsiblePrimitive data-slot="collapsible" {...props} />
);

export { Collapsible };
