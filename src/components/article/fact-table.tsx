import type { ReactNode } from "react";

type Fact = [label: string, value: ReactNode];

/** A plain two-column table of facts. Static, so it stays a server component. */
const FactTable = ({ facts }: { facts: Fact[] }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-foreground/10">
        <table className="w-full text-left text-sm">
            <tbody>
                {facts.map(([label, value]) => (
                    <tr
                        key={label}
                        className="border-t border-foreground/10 align-top first:border-t-0 hover:bg-foreground/[0.02]"
                    >
                        <th
                            scope="row"
                            className="w-36 px-4 py-2.5 font-medium whitespace-nowrap text-foreground/90"
                        >
                            {label}
                        </th>
                        <td className="px-4 py-2.5 text-foreground/70">
                            {value}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export { FactTable, type Fact };
