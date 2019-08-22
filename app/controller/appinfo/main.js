'use strict';

const Controller = require('web_framework_eggjs/baseClass/controller');

class IndexController extends Controller {
  async appInfo() {
    const { ctx } = this;

    const userSecurity = await this.service.user.userSecurity.getConfig();
    this.success({
      sysinfo: {
        ipsname: ctx.__('ipsName'),
        333: ctx.__('appErr.database.maxInstance'),
      },
      userSecurity,
    });
  }
}

module.exports = IndexController;
