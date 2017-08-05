const path = require('path');
const Controller = require('../../src/engine/Tasker/Controller');

const dirname = __dirname;

module.exports = class TestController extends Controller {
  constructor(props) {
    super(props);
    this.script = path.resolve(dirname, 'TestWorker.js');
  }
}
