const fs = require('fs');
const Koa = require('koa');
const KoaBody = require('koa-body');
const KoaRouter = require('koa-router');

class KoaService {

  constructor({config}) {
    this.app = new Koa();
  }

  /**
   * Create new router
   */
  get router() {
    return new KoaRouter();
  }

  /**
   * Register new router
   */
  useRouter(router) {
    this.app.use(router.routes());
  }

  /**
   * Start http server
   */
  async run() {
    this.app.listen(3000);
  }

  /**
   * DI for controllers
   */
  register() {
    return require('fs').readdirSync('./res/backkitKoa').map(file => `./res/koa/${file}`);
  }
}

module.exports = KoaService;