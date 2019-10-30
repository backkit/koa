# Koa service for backkit

## Install

```bash
npm install https://github.com/backkit/kernel.git \
            https://github.com/backkit/koa.git \
            https://github.com/backkit/config.git \
            https://github.com/backkit/winston.git --save

```

## Simple controller

res/koa/hello.js

```js
module.exports = ({koa}) => {
  // returns new koa router instance
  const router = koa.router;

  router
  .get('/', (ctx, next) => {
    ctx.body = "test"
  })
  .get('/hello', (ctx, next) => {
    ctx.body = `Hello ${ctx.query.name}`
  })

  koa.useRouter(router);
};

```

## Class based controller (with binding)

res/koa/hello.js

```js
class HelloController {

  constructor({koa}) {
    this.name = 'Koa';
    koa.useRouter(koa.router
      .get('/', this.index.bind(this))
      .get('/hello', this.hello.bind(this)));
  }

  async index(ctx, next) {
    ctx.body = "index"
  }

  async hello(ctx, next) {
    // note the this.name default value
    ctx.body = `hello ${ctx.query.name||this.name}`
  }
}

module.exports = HelloController;

```
