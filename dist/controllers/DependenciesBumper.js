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
class DependenciesBumper {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    bumpDependencies(req, res, next) {
        let path = req.body.path;
        let successMessage = "components updated";
        let errorMessage = "Could not update components";
        function bumpDeps() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // check if package.json exists in directory
                    let output = yield ChildProcessHandler_1.ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && find . -maxdepth 1 -name \"package.json\"", false);
                    if (output.lentgh == 0) {
                        this.throwError(res);
                    }
                    else {
                        // update components
                        output = yield ChildProcessHandler_1.ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && ncu -a --packageFile package.json", false);
                        if (output != null) {
                            // install updated components
                            yield ChildProcessHandler_1.ChildProcessHandler.executeFinalChildProcessCommand("cd " + path + " && npm install", successMessage, res, errorMessage, false);
                        }
                    }
                }
                catch (error) {
                    this.throwError(res);
                }
            });
        }
        bumpDeps();
    }
    throwError(res) {
        return res.status(500)
            .send({
            message: "Invalid directory",
            status: res.status
        });
    }
    init() {
        this.router.post('/api/bumpDependencies', this.bumpDependencies);
    }
}
exports.DependenciesBumper = DependenciesBumper;
//# sourceMappingURL=DependenciesBumper.js.map