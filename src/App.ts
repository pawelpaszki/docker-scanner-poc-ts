import * as express from 'express';
import * as bodyParser from 'body-parser';
import {ImageFetcher} from './controllers/ImageFetcher';
import {ContainerExtractor} from './controllers/ContainerExtractor';
import {NodeVulnerAnalyzer} from './controllers/NodeVulnerAnalyzer';
import {DependenciesBumper} from './controllers/DependenciesBumper';
import {TestRunner} from './controllers/TestRunner';
import {OSChecker} from './controllers/OSChecker';

class App {
    public express;
    private imageFetcher: ImageFetcher;
    private containerExtractor:ContainerExtractor;
    private nodeVulnAnalyzer: NodeVulnerAnalyzer;
    private dependenciesBumper: DependenciesBumper;
    private testRunner: TestRunner;
    private osChecker: OSChecker;

    constructor() {
        this.express = express();
        this.middleware();
        this.imageFetcher = new ImageFetcher();
        this.containerExtractor = new ContainerExtractor();
        this.nodeVulnAnalyzer = new NodeVulnerAnalyzer();
        this.dependenciesBumper = new DependenciesBumper();
        this.testRunner = new TestRunner();
        this.osChecker = new OSChecker();
        this.mountRoutes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    private mountRoutes(): void {
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

export default new App().express;
