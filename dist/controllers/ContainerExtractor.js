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
const DockerodeContainerExtractor_1 = require("./DockerodeContainerExtractor");
const ChildProcessHandler_1 = require("./ChildProcessHandler");
class ContainerExtractor {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    extractContainer(req, res, next) {
        let containerName = req.body.name;
        let successMessage = "container extracted";
        let errorMessage = "unable to extract container";
        let mkdirStarted = false;
        function extractCont() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let output = yield DockerodeContainerExtractor_1.DockerodeContainerExtractor.extractContainer(containerName);
                    mkdirStarted = true;
                    yield ChildProcessHandler_1.ChildProcessHandler.executeIntermediateChildProcCommand("cd .. && mkdir test_dir", true);
                    yield ChildProcessHandler_1.ChildProcessHandler.executeIntermediateChildProcCommand("tar -x -f test.tar --directory ../test_dir", true);
                    yield ChildProcessHandler_1.ChildProcessHandler.executeFinalChildProcessCommand("rm -rf test.tar", successMessage, res, errorMessage, true);
                }
                catch (error) {
                    if (mkdirStarted) {
                        yield ChildProcessHandler_1.ChildProcessHandler.executeIntermediateChildProcCommand("tar -x -f test.tar --directory ../test_dir", true);
                        yield ChildProcessHandler_1.ChildProcessHandler.executeFinalChildProcessCommand("rm -rf test.tar", successMessage, res, errorMessage, true);
                    }
                }
            });
        }
        extractCont();
    }
    init() {
        this.router.post('/api/extractContainer', this.extractContainer);
    }
    throwError(res, message) {
        return res.status(500)
            .send({
            message: message,
            status: res.status
        });
    }
}
exports.ContainerExtractor = ContainerExtractor;
//# sourceMappingURL=ContainerExtractor.js.map