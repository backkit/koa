const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const nanoid = require('nanoid');


const skipPrompt = process.env.NO_INTERACTIVE || process.env.NO_PROMPT || !process.env.npm_config_foreground_scripts || process.env.npm_config_foreground_scripts === 'false' ? true : false;
const skipAutoconf = process.env.NO_AUTOCONF || (__dirname === process.env.INIT_CWD) ? true : false;

const generate = (serviceName, moduleName, config) => {
  const serviceDir = `${process.env.INIT_CWD}${path.sep}services`;
  const servicePath = `${process.env.INIT_CWD}${path.sep}services${path.sep}${serviceName}.js`;
  const configDir = `${process.env.INIT_CWD}${path.sep}config`;
  const configPath = `${process.env.INIT_CWD}${path.sep}config${path.sep}${serviceName}.yml`;
  const resourceBaseDir = `${process.env.INIT_CWD}${path.sep}res`;
  const resourceDir = `${process.env.INIT_CWD}${path.sep}res${path.sep}${serviceName}`;

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
  const packageJson = require(`.${path.sep}package.json`);
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