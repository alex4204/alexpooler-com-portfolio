"use client";

import { Children, type ComponentProps } from "react";
import {
    Focusable,
    TooltipTrigger as TooltipTriggerPrimitive,
} from "react-aria-components";

/**
 * Takes two children: the element that triggers it, then the `Tooltip`. The
 * trigger must be a native element that passes on the props it's given, such
 * as an `<a>`; React Aria's own `Link` doesn't.
 */
const TooltipTrigger = ({
    delay = 300,
    children,
    ...props
}: ComponentProps<typeof TooltipTriggerPrimitive>) => {
    const [trigger, tooltip] = Children.toArray(children);
    return (
        <TooltipTriggerPrimitive
            data-slot="tooltip-trigger"
            delay={delay}
            {...props}
        >
            <Focusable>
                {trigger as ComponentProps<typeof Focusable>["children"]}
            </Focusable>
            {tooltip}
        </TooltipTriggerPrimitive>
    );
};

export { TooltipTrigger };
