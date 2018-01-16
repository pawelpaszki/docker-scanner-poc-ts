"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const ImageFetcher_1 = require("./controllers/ImageFetcher");
const ContainerExtractor_1 = require("./controllers/ContainerExtractor");
const NodeVulnerAnalyzer_1 = require("./controllers/NodeVulnerAnalyzer");
const DependenciesBumper_1 = require("./controllers/DependenciesBumper");
const TestRunner_1 = require("./controllers/TestRunner");
const OSChecker_1 = require("./controllers/OSChecker");
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.imageFetcher = new ImageFetcher_1.ImageFetcher();
        this.containerExtractor = new ContainerExtractor_1.ContainerExtractor();
        this.nodeVulnAnalyzer = new NodeVulnerAnalyzer_1.NodeVulnerAnalyzer();
        this.dependenciesBumper = new DependenciesBumper_1.DependenciesBumper();
        this.testRunner = new TestRunner_1.TestRunner();
        this.osChecker = new OSChecker_1.OSChecker();
        this.mountRoutes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    mountRoutes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Server running!'
            });
        });
        this.express.use('/api/fetchImage', this.imageFetcher.fetchImage);
        this.express.use('/api/extractContainer', this.containerExtractor.extractContainer);
        this.express.use('/api/analyzeSourceCode', this.nodeVulnAnalyzer.analyzeSourceCode);
        this.express.use('/api/bumpDependencies', this.dependenciesBumper.bumpDependencies);
        this.express.use('/api/runTests', this.testRunner.runTests);
        this.express.use('/api/checkos', this.osChecker.checkOS);
        this.express.use('/', router);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map