// 每天00:00:00执行的定时任务，用于清理日志

'use strict';

module.exports = app => ({
  schedule: {
    cron: '0 0 0 * * *',
    // interval: '3s',
    type: 'worker', // 指定单个的 worker 执行
  },

  async task() {
    // 清理过期的缓冲
    await app.service.fileCache.clear();
  },
});
