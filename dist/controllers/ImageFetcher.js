"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChildProcessHandler_1 = require("./ChildProcessHandler");
class ImageFetcher {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    fetchImage(req, res) {
        let imageName = req.body.name;
        let successMessage = "image successfully pulled";
        ChildProcessHandler_1.ChildProcessHandler.executeFinalChildProcessCommand("docker pull " + imageName, successMessage, res, "could not pull the image: " + imageName, false);
    }
    init() {
        this.router.post('/api/fetchImage', this.fetchImage);
    }
}
exports.ImageFetcher = ImageFetcher;
//# sourceMappingURL=ImageFetcher.js.map