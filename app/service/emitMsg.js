'use strict';

const Service = require('egg').Service;
const JSONbig = require('json-bigint');

class EmitMsgService extends Service {
  // CURL函数
  async emit(tableName, errorMsg) {
    let res;
    const url = this.ctx.app.config.activeMqEmitUrl;
    const { orgId } = await this.app.config.clusterInfo();
    const option = {
      method: 'POST',
      contentType: 'json',
      dataType: 'text',
      data: {
        tableName,
        userId: orgId || 'local',
      },
      timeout: 180000,
    };

    try {
      res = await this.ctx.curl(url, option);
      res.data = JSONbig.parse(res.data);
    } catch (e) {
      this.ctx.logger.error('\n[call activeMq API]\nurl: %s\noption: %j\nerror %s', url, option, e.toString());
      this.error('通知配置变更失败');
    }

    this.ctx.logger.debug('\n[call activeMQ API]\nurl: %s\noption: %j\nstatus: %s\ndata: %j', url, option, res.status, res.data);
    if (res.data.code !== 0) {
      this.error(errorMsg || res.data.desc || 'unknowError');
    }

    return res.data;
  }

  // 发生错误时，用于抛出异常，并终止后续的逻辑
  error(...arg) {
    this.ctx.app.throwErr(...arg);
  }
}

module.exports = EmitMsgService;
