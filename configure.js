const nanoid = require('nanoid').nanoid;
const autoconf = require("@backkit/autoconf");

autoconf('koa')
.generator(self => ([
  {
    putFileOnce: self.serviceConfigMainYML,
    contentYml: self.config
  },
  {
    putFileOnce: self.serviceCodeMainJS,
    content: `module.exports = require('${self.npmModuleName}')`
  },
  {
    putFileOnce: `${self.serviceResourceDir}/.gitkeep`
  }
]))
.default(self => ({
  keys: [nanoid()],
  session: {
    enable: true
  }
}))
.prompt(self => ([
  {
    if: {
      fileNotFound: self.serviceConfigMainYML
    },
    type: 'confirm',
    name: 'session.enable',
    message: "enable session ?",
    default: self.defaultConfig.session.enable,
    validate: function(value) {
      return true;
    }
  }
]))
.run()
