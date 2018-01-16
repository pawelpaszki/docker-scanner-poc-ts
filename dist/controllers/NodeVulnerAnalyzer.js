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
class NodeVulnerAnalyzer {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    analyzeSourceCode(req, res, next) {
        let path = req.body.path;
        let successMessage, errorMessage = "placeholder - not needed";
        let testRan = false;
        function checkVuln() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // check if package.json exists in directory
                    let output = yield ChildProcessHandler_1.ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && find . -maxdepth 1 -name \"package.json\"", false);
                    if (output.lentgh == 0) {
                        this.throwError(res);
                    }
                    else {
                        // run vuln test
                        testRan = true;
                        output = yield ChildProcessHandler_1.ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && nsp check > vuln.txt", true);
                        if (output != null) {
                            // output results
                            yield ChildProcessHandler_1.ChildProcessHandler.executeFinalChildProcessCommand("cd " + path + " && cat vuln.txt", successMessage, res, errorMessage, true);
                        }
                    }
                }
                catch (error) {
                    // possible to get errors as a result of vuln check
                    if (testRan) {
                        yield ChildProcessHandler_1.ChildProcessHandler.executeFinalChildProcessCommand("cd " + path + " && cat vuln.txt", successMessage, res, errorMessage, true);
                    }
                    else {
                        this.throwError(res, "unable to run tests");
                    }
                }
            });
        }
        checkVuln();
    }
    init() {
        this.router.post('/api/analyzeSourceCode', this.analyzeSourceCode);
    }
    throwError(res, message) {
        return res.status(500)
            .send({
            message: message,
            status: res.status
        });
    }
}
exports.NodeVulnerAnalyzer = NodeVulnerAnalyzer;
//# sourceMappingURL=NodeVulnerAnalyzer.js.map