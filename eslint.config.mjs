import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    {
        rules: {
            // Arrow functions only.
            "func-style": ["error", "expression"],
            "prefer-arrow-callback": "error",
            "no-restricted-syntax": [
                "error",
                {
                    selector: "FunctionExpression",
                    message: "Use an arrow function.",
                },
            ],
            // Exports live at the bottom of the file, in one place.
            "import/exports-last": "error",
            "import/group-exports": "error",
            // Default exports only where Next.js needs them (see override below).
            "import/no-default-export": "error",
        },
    },
    {
        files: [
            "src/app/**/{page,layout,not-found,error,global-error,loading,template,default}.tsx",
            "src/app/{sitemap,robots}.ts",
            "src/app/opengraph-image.tsx",
            "*.config.{ts,mjs}",
        ],
        rules: {
            "import/no-default-export": "off",
        },
    },
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
