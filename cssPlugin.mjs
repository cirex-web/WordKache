var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import postcss from "postcss";
import * as postcssModules from "postcss-modules";
import * as sass from "sass";
var PLUGIN = 'esbuild-scss-modules-plugin';
var DefaultOptions = {
    inject: true,
    minify: false,
    cache: true,
    localsConvention: "camelCaseOnly",
    generateScopedName: undefined,
    scssOptions: {},
    cssCallback: undefined
};
function buildScss(scssFullPath, sassOptions) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return sass.compileAsync(scssFullPath).then(resolve)["catch"](reject); })];
        });
    });
}
function buildScssModulesJS(scssFullPath, options) {
    return __awaiter(this, void 0, void 0, function () {
        var css, cssModulesJSON, result, classNames, hash, digest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, buildScss(scssFullPath)];
                case 1:
                    css = (_a.sent()).css;
                    cssModulesJSON = {};
                    return [4 /*yield*/, postcss(__spreadArray([
                            postcssModules({
                                localsConvention: options.localsConvention,
                                generateScopedName: options.generateScopedName,
                                getJSON: function (cssSourceFile, json) {
                                    cssModulesJSON = __assign({}, json);
                                    return cssModulesJSON;
                                }
                            })
                        ], (options.minify ? [require("cssnano")({
                                preset: 'default'
                            })] : []), true)).process(css, {
                            from: scssFullPath,
                            map: false
                        })];
                case 2:
                    result = _a.sent();
                    if (!options.cssCallback) return [3 /*break*/, 4];
                    return [4 /*yield*/, options.cssCallback(result.css, cssModulesJSON)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    classNames = JSON.stringify(cssModulesJSON);
                    hash = crypto.createHash('sha256');
                    hash.update(result.css);
                    digest = hash.digest('hex');
                    return [2 /*return*/, "\nconst digest = '".concat(digest, "';\nconst classes = ").concat(classNames, ";\nconst css = `").concat(result.css, "`;\n").concat(options.inject && "\n(function() {\n  if (typeof document !== \"undefined\" && !document.getElementById(digest)) {\n    var ele = document.createElement('style');\n    ele.id = digest;\n    ele.textContent = css;\n    document.head.appendChild(ele);\n  }\n})();\n", "\nexport default classes;\nexport { css, digest, classes };\n  ")];
            }
        });
    });
}
export var ScssModulesPlugin = function (options) {
    if (options === void 0) { options = {}; }
    return ({
        name: PLUGIN,
        setup: function (build) {
            var _this = this;
            var _a = build.initialOptions, outdir = _a.outdir, bundle = _a.bundle;
            var results = new Map();
            var fullOptions = __assign(__assign({}, DefaultOptions), options);
            build.onResolve({ filter: /\.modules?\.s?css$/, namespace: 'file' }, function (args) { return __awaiter(_this, void 0, void 0, function () {
                var sourceFullPath, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sourceFullPath = path.resolve(args.resolveDir, args.path);
                            if (results.has(sourceFullPath))
                                return [2 /*return*/, results.get(sourceFullPath)];
                            return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                    var sourceExt, sourceBaseName, isOutdirAbsolute, absoluteOutdir, isEntryAbsolute, entryRelDir, targetSubpath, target, jsContent;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                sourceExt = path.extname(sourceFullPath);
                                                sourceBaseName = path.basename(sourceFullPath, sourceExt);
                                                if (bundle) {
                                                    return [2 /*return*/, {
                                                            path: args.path,
                                                            namespace: PLUGIN,
                                                            pluginData: {
                                                                sourceFullPath: sourceFullPath
                                                            }
                                                        }];
                                                }
                                                if (!outdir) return [3 /*break*/, 4];
                                                isOutdirAbsolute = path.isAbsolute(outdir);
                                                absoluteOutdir = isOutdirAbsolute ? outdir : path.resolve(args.resolveDir, outdir);
                                                isEntryAbsolute = path.isAbsolute(args.path);
                                                entryRelDir = isEntryAbsolute ? path.dirname(path.relative(args.resolveDir, args.path)) : path.dirname(args.path);
                                                targetSubpath = absoluteOutdir.indexOf(entryRelDir) === -1 ? path.join(entryRelDir, "".concat(sourceBaseName, ".css.js")) : "".concat(sourceBaseName, ".css.js");
                                                target = path.resolve(absoluteOutdir, targetSubpath);
                                                return [4 /*yield*/, buildScssModulesJS(sourceFullPath, fullOptions)];
                                            case 1:
                                                jsContent = _a.sent();
                                                return [4 /*yield*/, fs.mkdir(path.dirname(target), { recursive: true })];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, fs.writeFile(target, jsContent)];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4: return [2 /*return*/, { path: sourceFullPath, namespace: 'file' }];
                                        }
                                    });
                                }); })()];
                        case 1:
                            result = _a.sent();
                            if (fullOptions.cache)
                                results.set(sourceFullPath, result);
                            return [2 /*return*/, result];
                    }
                });
            }); });
            build.onLoad({ filter: /\.modules?\.s?css$/, namespace: PLUGIN }, function (_a) {
                var sourceFullPath = _a.pluginData.sourceFullPath;
                return __awaiter(_this, void 0, void 0, function () {
                    var contents;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, buildScssModulesJS(sourceFullPath, fullOptions)];
                            case 1:
                                contents = _b.sent();
                                return [2 /*return*/, {
                                        contents: contents,
                                        loader: 'js',
                                        watchFiles: [sourceFullPath]
                                    }];
                        }
                    });
                });
            });
        }
    });
};
export default ScssModulesPlugin;
