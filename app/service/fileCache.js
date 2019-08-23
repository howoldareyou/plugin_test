'use strict';

const Service = require('web_framework_eggjs2').Service;
const path = require('path');
const { md5, readJson, writeJson, findFiles, removeFile } = require('web_framework_eggjs2/utils');

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
        await removeFile(file);
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
      await removeFile(path.resolve(this.cacheDir, filename));
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
          await removeFile(it.path);
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
}

module.exports = fileCacheService;
