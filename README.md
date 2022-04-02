# Koa service for backkit

## Install

```bash
npm install @backkit/kernel.git \
            @backkit/koa.git \
            @backkit/config.git \
            @backkit/winston.git --save

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

## Use Passport.js

First install `koa-passport`

```
npm install koa-passport --save
```

Initialize it `res/koa/passport.js`

```
const passport = require('koa-passport');

module.exports = ({koa}) => {
  ...
  // initialize passport
  koa.useMiddleware(passport.initialize())
  koa.useMiddleware(passport.session())
  ...
}
```

then use it in your controller: `res/koa/hello.js`

```
class HelloController {

  constructor({koa}) {
    koa.useRouter(koa.router
      .get('/', this.index.bind(this)));
  }

  async index(ctx, next) {
    if (ctx.isAuthenticated()) {
      ctx.body = "I am logged in";
    } else {
      ctx.body = "I am logged out";
    }
  }
}

module.exports = HelloController;
```
