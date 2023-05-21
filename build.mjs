
import esbuild from "esbuild";
import CssModulesPlugin from "esbuild-css-modules-plugin";
import { copy } from "esbuild-plugin-copy";
import inlineImage from "esbuild-plugin-inline-image";
import { ScssModulesPlugin } from "esbuild-scss-modules-plugin";
import eslint from 'esbuild-plugin-eslint';
import { zip } from 'zip-a-folder';
import { rmSync } from 'node:fs';

const removeFile = (path) => {
    console.log(`Removing ${path}`)
    rmSync(path, { recursive: true, force: true });
}
const args = process.argv.slice(2);
const PROD = args.includes("prod");
const WATCH = args.includes("watch");
const esbuildPlugins = [inlineImage(), ScssModulesPlugin({}), CssModulesPlugin(), copy({
    // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
    // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
    resolveFrom: 'cwd',
    assets: {
        from: ['./public/*'],
        to: ['./build'],
    },
})];

if (PROD) esbuildPlugins.push(eslint({ throwOnWarning: true })); //lint production build

const esbuildConfig = {
    entryPoints: ["./src/index.tsx", "./src/chromeServices/background/index.ts", "./src/chromeServices/contentScript/index.ts"],
    outdir: "./build",
    minify: PROD,
    bundle: true,
    plugins: esbuildPlugins,
    logLevel: "info",
    sourcemap: !PROD,
};


removeFile("./build");
if (!WATCH) {
    await esbuild.build(esbuildConfig);
    if (PROD) {
        removeFile("./build.zip");
        await zip("./build", "./build.zip");

    }
} else {
    const ctx = await esbuild.context(esbuildConfig);
    await ctx.watch();
}
