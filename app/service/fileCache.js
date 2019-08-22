'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs-extra');

const { md5, readJson, writeJson, findFiles } = require('web_framework_eggjs/utils');

const extName = '.cacheJson';

class fileCacheService extends Service {
  constructor(item) {
    super(item);
    this.cacheDir = path.resolve(this.app.config.dbone.cachePath, 'cache');
  }

  // 写缓存
  async set(name, key, data, timeout = 86400000) {
    const filename = this.getFilename(name, key);
    const file = path.resolve(this.cacheDir, filename);
    if (data === null) {
      try {
        await fs.remove(file);
      } catch (e) {
        return;
      }
    } else {
      const expireTime = new Date().getTime() + timeout;
      await writeJson(file, { expireTime, data });
      return filename;
    }
  }

  // 读缓存
  async get(name, key, ignoreExpire = false) {
    try {
      const filename = this.getFilename(name, key);
      const cache = await readJson(path.resolve(this.cacheDir, filename));
      if (ignoreExpire || cache.expireTime >= new Date().getTime()) return cache.data;
      await fs.remove(path.resolve(this.cacheDir, filename));
      return null;
    } catch (error) {
      return null;
    }
  }

  getFilename(name, key) {
    return `${name}_${md5(key)}${extName}`;
  }

  async clear() {
    const now = new Date().getTime();
    const cacheFiles = await findFiles(this.cacheDir, false, it => !it.isdir && path.extname(it.name) === extName);
    for (const it of cacheFiles) {
      try {
        const cache = await readJson(it.path);
        if (cache.expireTime < now) {
          await fs.remove(it.path);
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
}

module.exports = fileCacheService;
