import os from 'os'
import crypto from 'crypto'
import { join } from 'path'
import fsUtil from 'ginlibs-file-util'
import { isObject, isArray } from 'ginlibs-type-check'
import stringify from 'json-stringify-safe'

const CACHE_FILE_NAME = '.ginlibs.cache'

const HASH = crypto
  .createHash('md5')
  .update('ginlibs_cache_key')
  .digest('base64')

export class Cache {
  dir: string | undefined
  fileName = `${HASH}${CACHE_FILE_NAME}.txt`

  constructor(dir?: string) {
    this.dir = dir
  }

  write(...content: any[]) {
    const cacheFilePath = join(this.dir || os.tmpdir(), this.fileName)
    console.log(cacheFilePath)
    const newCont = content
      .map((it) => {
        if (isObject(it) || isArray(it)) {
          return stringify(it, undefined, 2)
        }
        return `${it}`
      })
      .join(' ')
    const oldContent = fsUtil.read(cacheFilePath)
    const newContent = `${oldContent}\n${newCont}`
    if (newContent.length > Math.pow(1024, 3)) {
      console.log(`cache file size over ${Math.pow(1024, 3)}`)
    }
    fsUtil.write(cacheFilePath, newContent)
  }
}

export default new Cache()
