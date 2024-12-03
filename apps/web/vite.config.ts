import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";

function stubNextAssetImport() {
  return {
    name: "stub-next-asset-import",
    transform(_code: string, id: string) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id);
        return {
          code: `export default { src: '${imgSrc}', height: 1, width: 1 }`,
        };
      }
    },
  };
}

export default defineConfig({
  test: {
    environment: "jsdom",
    passWithNoTests: true,
    coverage: {
      include: ["src/**/*.tsx", "!src/pages/_*.tsx"],
      provider: "v8",
      thresholds: {
        branches: 0,
        lines: 0,
        statements: 0,
        functions: 0,
      },
    },
  },
  plugins: [react(), stubNextAssetImport()],
  resolve: { alias: { "@maybank": resolve(__dirname, "./src") } },
});

