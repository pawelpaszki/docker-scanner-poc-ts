"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChildProcessHandler_1 = require("./ChildProcessHandler");
const get = require("simple-get");
const lodash = require("lodash");
class OSChecker {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    checkOS(req, response) {
        let path = req.body.path;
        function checkImagesOS() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // check if package.json exists in directory
                    let output = yield ChildProcessHandler_1.ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && cat etc/os-release", false);
                    if (output.length == 0) {
                        this.throwError(response, "invalid directory");
                    }
                    else {
                        let idIndex = output.indexOf('ID') + 3;
                        let endOSnameIndex = idIndex + output.substring(idIndex).indexOf('\n');
                        let osName = output.substr(idIndex, endOSnameIndex - idIndex);
                        //console.log(output);
                        let prettyNameStartIndex = output.indexOf('PRETTY_NAME');
                        let endOfPrettyNameLineIndex = prettyNameStartIndex + output.substring(prettyNameStartIndex).indexOf('\n');
                        let prettyNameString = output.substring(prettyNameStartIndex, endOfPrettyNameLineIndex);
                        let start = 0;
                        let end = prettyNameString.length;
                        let startSet = false;
                        for (let i = 0; i < prettyNameString.length; i++) {
                            if (!isNaN(parseInt(prettyNameString.charAt(i))) && !startSet) {
                                start = i;
                                startSet = true;
                            }
                            if (startSet) {
                                if (!(!isNaN(parseInt(prettyNameString.charAt(i))) || prettyNameString.charAt(i) === '.')) {
                                    end = i;
                                    break;
                                }
                            }
                        }
                        let osVersion = prettyNameString.substring(start, end);
                        //console.log('version: ', prettyNameString.substring(start, end));
                        let url = 'https://registry.hub.docker.com/v2/repositories/library/' + osName + '/tags/';
                        let jsonResponse = null;
                        get.concat(url, function (err, res, data) {
                            if (err) {
                                return response.status(500)
                                    .send({
                                    message: 'unable to get OS version',
                                    status: res.status
                                });
                            }
                            jsonResponse = JSON.parse(data.toString());
                            let results = lodash.map(jsonResponse.results, 'name');
                            //console.log(results);
                            let osVersions = results.filter(function (el) {
                                return el.length && el == +el;
                            });
                            osVersions.sort();
                            let versionIndex = osVersions.indexOf(osVersion);
                            let message;
                            if (osVersion !== osVersions[osVersions.length - 1]) {
                                message = 'OS version in your docker image is not the latest. you use: ' + osName + ' ' + osVersion + ', the latest is: ' + osVersions[osVersions.length - 1];
                                return response.status(200)
                                    .send({
                                    message: message,
                                    status: response.status
                                });
                            }
                            else {
                                message = 'OS version in your docker image is the latest: ' + osVersion;
                                return response.status(200)
                                    .send({
                                    message: message,
                                    status: response.status
                                });
                            }
                        });
                    }
                }
                catch (error) {
                    this.throwError(response, "unable to get OS version");
                }
            });
        }
        checkImagesOS();
    }
    init() {
        this.router.post('/api/checkOS', this.checkOS);
    }
}
exports.OSChecker = OSChecker;
//# sourceMappingURL=OSChecker.js.map