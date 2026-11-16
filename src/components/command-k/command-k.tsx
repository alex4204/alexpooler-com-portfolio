"use client";

import { Autocomplete, type AutocompleteProps } from "react-aria-components";

import { matchesAllWords } from "@/lib/utils/matches-all-words";

const CommandK = ({
    filter = matchesAllWords,
    ...props
}: AutocompleteProps) => <Autocomplete filter={filter} {...props} />;

export { CommandK };
