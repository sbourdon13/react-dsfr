import { getRulesByBreakpoint } from "./breakpoints";
import memoize from "memoizee";
import { objectKeys } from "tsafe/objectKeys";

export const parseClassNames = memoize((rawCssCode: string): string[] => {
    const rulesByBreakpoint = getRulesByBreakpoint(rawCssCode);

    const classes = new Set<string>();

    objectKeys(rulesByBreakpoint).forEach(breakpoint => {
        const rules = rulesByBreakpoint[breakpoint];

        rules.forEach(({ selectors }) => {
            selectors.forEach(selector => {
                const matchArr = selector.match(/^\.(fr-[a-zA-Z0-9_-]+)/);

                if (matchArr === null) {
                    return;
                }

                classes.add(matchArr[1]);
            });
        });
    });

    return Array.from(classes);
});

export function generateClassNamesTsCode(params: {
    rawCssCode: string;
    dsfrIconClassNames: string[];
    remixiconClassNames: string[];
}): string {
    const { rawCssCode, dsfrIconClassNames, remixiconClassNames } = params;

    const classNames = parseClassNames(rawCssCode);

    return [
        `export const frCoreClassNames= ${JSON.stringify(classNames, null, 4)} as const;`,
        ``,
        `export type FrCoreClassName = typeof frCoreClassNames[number];`,
        ``,
        `export const frIconClassNames= ${JSON.stringify(dsfrIconClassNames, null, 4)} as const;`,
        ``,
        `export type FrIconClassName = typeof frIconClassNames[number];`,
        ``,
        `export const riIconClassNames= ${JSON.stringify(remixiconClassNames, null, 4)} as const;`,
        ``,
        `export type RiIconClassName = typeof riIconClassNames[number];`,
        ``,
        `export type FrClassName = FrCoreClassName | FrIconClassName | RiIconClassName;`,
        ``
    ].join("\n");
}
