
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

import postcss from "postcss"
import * as postcssModules from "postcss-modules"
import * as sass from "sass";
// sass = sass.default;
import type * as esbuild from "esbuild";

const PLUGIN = 'esbuild-scss-modules-plugin'

type CssModulesOptions = Parameters<postcssModules>[0];
export type PluginOptions = {
    inject: boolean,
    minify: boolean,
    cache: boolean,

    localsConvention: CssModulesOptions["localsConvention"],
    generateScopedName: CssModulesOptions["generateScopedName"],

    scssOptions: sass.Options<"sync">,
    cssCallback?: (css: string, map: { [className: string]: string }) => void
};
const DefaultOptions: PluginOptions = {
    inject: true,
    minify: false,
    cache: true,

    localsConvention: "camelCaseOnly",
    generateScopedName: undefined,

    scssOptions: {},
    cssCallback: undefined
}

async function buildScss(scssFullPath: string, sassOptions?: sass.Options<"async">): Promise<sass.CompileResult> {
    return new Promise((resolve, reject) => sass.compileAsync(scssFullPath).then(resolve).catch(reject));
}

async function buildScssModulesJS(scssFullPath: string, options: PluginOptions): Promise<string> {
    const css = (await buildScss(scssFullPath)).css;

    let cssModulesJSON = {};
    const result = await postcss([
        postcssModules({
            localsConvention: options.localsConvention,
            generateScopedName: options.generateScopedName,
            getJSON(cssSourceFile, json) {
                cssModulesJSON = { ...json };
                return cssModulesJSON;
            }
        }),
        ...(options.minify ? [require("cssnano")({
            preset: 'default'
        })] : [])
    ]).process(css, {
        from: scssFullPath,
        map: false
    });

    if (options.cssCallback) await options.cssCallback(result.css, cssModulesJSON);

    const classNames = JSON.stringify(cssModulesJSON);

    const hash = crypto.createHash('sha256');
    hash.update(result.css);
    const digest = hash.digest('hex');

    return `
const digest = '${digest}';
const classes = ${classNames};
const css = \`${result.css}\`;
${options.inject && `
(function() {
  if (typeof document !== "undefined" && !document.getElementById(digest)) {
    var ele = document.createElement('style');
    ele.id = digest;
    ele.textContent = css;
    document.head.appendChild(ele);
  }
})();
`}
export default classes;
export { css, digest, classes };
  `;
}

export const ScssModulesPlugin = (options: Partial<PluginOptions> = {}) => ({
    name: PLUGIN,
    setup(build) {
        const { outdir, bundle } = build.initialOptions;
        const results = new Map();
        const fullOptions = { ...DefaultOptions, ...options };

        build.onResolve(
            { filter: /\.modules?\.s?css$/, namespace: 'file' },
            async (args) => {
                const sourceFullPath = path.resolve(args.resolveDir, args.path);
                if (results.has(sourceFullPath)) return results.get(sourceFullPath);

                const result = await (async () => {
                    const sourceExt = path.extname(sourceFullPath);
                    const sourceBaseName = path.basename(sourceFullPath, sourceExt);

                    if (bundle) {
                        return {
                            path: args.path,
                            namespace: PLUGIN,
                            pluginData: {
                                sourceFullPath
                            }
                        };
                    }

                    if (outdir) {
                        const isOutdirAbsolute = path.isAbsolute(outdir);
                        const absoluteOutdir = isOutdirAbsolute ? outdir : path.resolve(args.resolveDir, outdir);
                        const isEntryAbsolute = path.isAbsolute(args.path);
                        const entryRelDir = isEntryAbsolute ? path.dirname(path.relative(args.resolveDir, args.path)) : path.dirname(args.path);

                        const targetSubpath = absoluteOutdir.indexOf(entryRelDir) === -1 ? path.join(entryRelDir, `${sourceBaseName}.css.js`) : `${sourceBaseName}.css.js`;
                        const target = path.resolve(absoluteOutdir, targetSubpath);

                        const jsContent = await buildScssModulesJS(sourceFullPath, fullOptions);
                        await fs.mkdir(path.dirname(target), { recursive: true });
                        await fs.writeFile(target, jsContent);
                    }

                    return { path: sourceFullPath, namespace: 'file' };
                })();

                if (fullOptions.cache) results.set(sourceFullPath, result);
                return result;
            }
        );

        build.onLoad({ filter: /\.modules?\.s?css$/, namespace: PLUGIN }, async ({ pluginData: { sourceFullPath } }) => {
            const contents = await buildScssModulesJS(sourceFullPath, fullOptions);
            return {
                contents,
                loader: 'js',
                watchFiles: [sourceFullPath],
            };
        });
    }
} as esbuild.Plugin);

export default ScssModulesPlugin;

//@ts-expect-error
declare module '*.modules.scss' {
    interface IClassNames {
        [className: string]: string
    }
    const classes: IClassNames;
    const digest: string;
    const css: string;

    export default classes;
    export { classes, digest, css };
}