const fs = require('fs');
const session = require('koa-session')
const router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const koa = require('koa');

class KoaService {

  /**
   * Ctor
   */
  constructor({config, appdir, logger}) {
    this.appdir = appdir;
    this.logger = logger;
    this.app = new koa();
    this.mw = [];
    this.rr = [];
    this._initDone = false;
    this.koaconf = config.get('koa');
  }

  /**
   * Intialize core middleware
   */
  init() {
    if (!this._initDone) {
      // application secret key (used to encrypt cookies for example)
      if (this.koaconf.keys) {
        this.app.keys = this.koaconf.keys;
      } else {
        throw new Error("Please set koa's app keys as 'keys' array in koa.yml configuration file");
      }

      // may be required by other services (example: some passport strategies)
      if (this.koaconf.session && this.koaconf.session.enable === true) {
        // @see https://github.com/koajs/session
        this.app.use(session({
          key: 'session',
          maxAge: 86400000, // session expires in 24h
          autoCommit: true, // automatically commit headers (default true)
          overwrite: true,  // can overwrite or not (default true)
          httpOnly: true,   // httpOnly or not (default true)
          signed: true,     // signed or not (default true)
          rolling: false,   // Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false)
          renew: false,     // renew session when session is nearly expired, so we can always keep user logged in. (default is false)
        }, this.app));
      }

      // body parser
      this.app.use(bodyParser());
      
      // use 3rd party middleware
      this.mw.forEach(el => {
        this.app.use(el);
      });

      // use routes
      this.rr.forEach(el => {
        this.app.use(el.routes());
      });

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
    return new router();
  }

  /**
   * Register new router
   */
  useRouter(r) {
    this.rr.push(r);
    return this;
  }

  /**
   * Register 3rd party middleware
   */
  useMiddleware(mw) {
    this.mw.push(mw);
    return this;
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