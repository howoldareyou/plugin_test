// 每天00:00:00执行的定时任务，用于清理日志

'use strict';

const Subscription = require('egg').Subscription;


class tasksEveryDaySchedule extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 0 * * *',
      // interval: '3s',
      type: 'worker', // 指定单个的 worker 执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // 清理过期的缓冲
    await this.service.fileCache.clear();
  }
}

module.exports = tasksEveryDaySchedule;
