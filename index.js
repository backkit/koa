const fs = require('fs');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaBodyParser = require('koa-bodyparser');

class KoaService {

  constructor({config, appdir, logger}) {
    this.appdir = appdir;
    this.logger = logger;
    this.app = new Koa();
    this._initDone = false;
  }

  /**
   * Intialize core middleware
   */
  init() {
    if (!this._initDone) {
      // body parser
      this.app.use(KoaBodyParser());

      // error handler
      this.app.use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          ctx.status = err.status || 500;
          ctx.type = 'application/json';
          ctx.body = {err: err.message};
          ctx.app.emit('error', err, ctx);
        }
      });

      this.app.on('error', (err) => {
        this.logger.error(err.message, {stack: err.stack});
      });

      // done
      this._initDone = true;
    }
    return this;
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
    this.init();
    this.app.use(router.routes());
  }

  /**
   * Start http server
   */
  async run() {
    this.init();
    this.app.listen(3000);
  }

  /**
   * DI for controllers
   */
  register() {
    return `${this.appdir}/res/koa/*.js`;
  }
}

module.exports = KoaService;