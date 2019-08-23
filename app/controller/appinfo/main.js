'use strict';

const Controller = require('web_framework_eggjs2/baseClass/controller');

class IndexController extends Controller {
  async appInfo() {
    const { ctx } = this;

    this.error('session.nologin');
    this.success({
      sysinfo: {
        ipsname: ctx.__('ipsName'),
        333: ctx.__('appErr.database.maxInstance'),
      },
    });
  }
}

module.exports = IndexController;
