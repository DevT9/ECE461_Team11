"use strict";
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
        while (_) try {
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
exports.__esModule = true;
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var NetScore_1 = require("./src/controllers/NetScore");
var ndjson = require('ndjson');
var PackageClassifier = /** @class */ (function () {
    function PackageClassifier(file) {
        console.log("HELOOOO");
        if (!(0, fs_1.existsSync)(file)) {
            throw new Error('ERORR!!');
        }
        this.urls = (0, fs_1.readFileSync)(file, 'utf-8').split('\n').filter(Boolean);
    }
    PackageClassifier.prototype.classifyUrls = function () {
        console.log("CLASSIFY URLS CALLED!");
        var gitUrls = [];
        var npmPackageUrls = [];
        for (var _i = 0, _a = this.urls; _i < _a.length; _i++) {
            var url = _a[_i];
            if (url.startsWith('https://github.com/') ||
                url.startsWith('git+https://github.com/') ||
                url.startsWith('git+ssh://git@github.com/') ||
                url.startsWith('ssh://git@github.com/')) {
                var cleanUrl = url
                    .replace('git+', '')
                    .replace('git+ssh://', '')
                    .replace('ssh://', '');
                gitUrls.push(cleanUrl);
            }
            else if (url.startsWith('https://www.npmjs.com/package/')) {
                npmPackageUrls.push(url);
                var packageName = url.split('/').pop();
                if (packageName) {
                    var repoUrl = this.getNpmPackageRepoUrl(packageName);
                    if (repoUrl) {
                        var cleanRepoUrl = repoUrl
                            .replace('git+', '')
                            .replace('git+ssh://', '')
                            .replace('ssh://', '');
                        gitUrls.push(cleanRepoUrl);
                    }
                }
            }
        }
        return { gitUrls: gitUrls, npmPackageUrls: npmPackageUrls };
    };
    PackageClassifier.prototype.getNpmPackageRepoUrl = function (packageName) {
        try {
            var output = (0, child_process_1.execSync)("npm view ".concat(packageName, " repository.url"), {
                encoding: 'utf-8'
            });
            return output.trim();
        }
        catch (error) {
            console.error("Error getting repository URL for package ".concat(packageName, ": ").concat(error.message));
            return null;
        }
    };
    return PackageClassifier;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var filename, classifier, _a, gitUrls, npmPackageUrls, results, _i, gitUrls_1, url, temp, owner, repo, NScore, scoreResults, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    filename = process.argv[2];
                    console.log("FILENAME!!!", filename);
                    if (!filename) {
                        console.error("No filename provided.");
                        process.exit(1);
                    }
                    classifier = new PackageClassifier(filename);
                    _a = classifier.classifyUrls(), gitUrls = _a.gitUrls, npmPackageUrls = _a.npmPackageUrls;
                    console.log('Git URLs:');
                    results = [];
                    _i = 0, gitUrls_1 = gitUrls;
                    _b.label = 1;
                case 1:
                    if (!(_i < gitUrls_1.length)) return [3 /*break*/, 4];
                    url = gitUrls_1[_i];
                    temp = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
                    if (!temp) return [3 /*break*/, 3];
                    owner = temp[1];
                    repo = temp[2];
                    repo = repo.replace(/\.git$/, '');
                    console.log("URL", url);
                    NScore = new NetScore_1.NetScore(owner, repo);
                    return [4 /*yield*/, NScore.calculate()];
                case 2:
                    scoreResults = _b.sent();
                    results.push(scoreResults);
                    process.stdout.write(ndjson.stringify(scoreResults));
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error('An error occurred:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
main();
