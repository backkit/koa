const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const nanoid = require('nanoid');

const skipPrompt = process.env.NO_INTERACTIVE || process.env.NO_PROMPT ? true : false;
const skipAutoconf = process.env.NO_AUTOCONF ? true : false;

const generate = (serviceName, moduleName, config) => {
  const serviceDir = `${__dirname}/../../services`;
  const servicePath = `${__dirname}/../../services/${serviceName}.js`;
  const configDir = `${__dirname}/../../config`;
  const configPath = `${__dirname}/../../config/${serviceName}.yml`;
  const resourceBaseDir = `${__dirname}/../../res`;
  const resourceDir = `${__dirname}/../../res/${serviceName}`;

  console.log("");
  console.log(`${serviceName} service config:`);
  console.log(JSON.stringify(config, null, '  '));
  console.log("");

  // save service config
  console.log(`writing config: ${configPath}`);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, {recursive: true});
  }
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, yaml.safeDump(config, {skipInvalid: true}));
  }

  // enable service
  console.log(`creating service alias: ${servicePath}`);
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, {recursive: true});
  }
  if (!fs.existsSync(servicePath)) {
    fs.writeFileSync(servicePath, `module.exports = require('${moduleName}')`);
  }
  
  // ensure resource dir exist
  console.log(`creating resources folder: ${resourceDir}`);
  if (!fs.existsSync(resourceBaseDir)) {
    fs.mkdirSync(resourceBaseDir, {recursive: true});
  }
  if (!fs.existsSync(resourceDir)) {
    fs.mkdirSync(resourceDir, {recursive: true});
    fs.writeFileSync(`${resourceDir}/.gitkeep`, '');
  }
};

if (!skipAutoconf) {
  const packageJson = require('./package.json');
  const serviceName = 'koa';
  const moduleName = packageJson.name;
  const defaultConf = {
    keys: [nanoid()],
    session: {
      enable: true
    }
  };

  if (!skipPrompt) {
    const questions = [
      {
        type: 'confirm',
        name: 'session_enable',
        message: "enable session ?",
        default: defaultConf.session.enable,
        validate: function(value) {
          return true;
        }
      }
    ];

    inquirer.prompt(questions).then(conf => {
      generate(serviceName, moduleName, {
        keys: defaultConf.keys,
        session: {
          enable: conf.session_enable
        }
      });
    });  
  } else {
    generate(serviceName, moduleName, defaultConf);
  }
}