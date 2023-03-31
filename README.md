# Koa service for backkit

## Interactive + Autoconf Install

Use this to generate custom configuration post install

```shell
npm install --foreground-scripts --progress false \
            @backkit/kernel \
            @backkit/koa \
            @backkit/config \
            @backkit/winston --save

```

## Non-Interactive Install with Default Autoconf Install

Use this to generate fast default configuration without prompt post install

```shell
npm install @backkit/kernel \
            @backkit/koa \
            @backkit/config \
            @backkit/winston --save

```

## Non-Interactive Non-Autoconf Install

Use this in production and CI

```shell
NO_AUTOCONF=y \
npm install @backkit/kernel \
            @backkit/koa \
            @backkit/config \
            @backkit/winston --save

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

```shell
npm install koa-passport --save
```

Initialize it `res/koa/passport.js`

```js
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

```js
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

## Links

- [NPM Module](https://www.npmjs.com/package/@backkit/koa)
- [Create new release](/backkit/koa/releases/new)