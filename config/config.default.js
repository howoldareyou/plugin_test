'use strict';


module.exports = () => {
  const config = {};

  config.opeLogIgnore = {
    common: '/dbaudit/appInfo',
  };

  config.activeMqEmitUrl = 'http://localhost:55003/update';

  return config;
};
