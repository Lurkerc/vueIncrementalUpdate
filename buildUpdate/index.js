const fs = require('fs')
const zlib = require('zlib')
const config = require('../config')
const util = require('./utils')
const log4js = require('log4js')

log4js.configure({
  appenders: {update: {type: 'file', filename: config.update.log}},
  categories: {default: {appenders: ['update'], level: 'info'}}
})

const logger = log4js.getLogger('update')

let DistAssetsPath, DistAssets, UpdateAssets, DistRoot, UpdateRoot, NewManifestFileName, OldManifestFileName, NewAppCssName, OldAppCssName
let UpdateIndex, DistIndex
let AsyncChunkHash = {}
let RemoveFileArr = []
let OutFiles = []

// 获取更新信息
async function loadInfo () {
  DistAssetsPath = config.build.assetsRoot + '\\' + config.build.assets.fileName
  let hasDistAssets = await util.fileExist(DistAssetsPath)
  if (!hasDistAssets) {
    util.exit(`! assets not found, please run: npm run build \n`)
  }

  logger.info('-------------开始获取配置信息-----------------')
  DistAssets = require(DistAssetsPath)
  UpdateAssets = require(config.update.assetsRoot + '\\' + config.build.assets.fileName)
  DistRoot = config.build.assetsRoot + DistAssets.publicPath
  UpdateRoot = config.update.assetsRoot + DistAssets.publicPath

  UpdateIndex = config.update.index
  DistIndex = config.build.index

  NewManifestFileName = util.getPathByArr(/manifest/, UpdateAssets.entryScripts)
  OldManifestFileName = util.getPathByArr(/manifest/, DistAssets.entryScripts)
  NewAppCssName = util.getPathByArr(/app/, UpdateAssets.entryStyles)
  OldAppCssName = util.getPathByArr(/app/, DistAssets.entryStyles)

  UpdateAssets.entryScripts.filter(item => item != NewManifestFileName).map(entry => RemoveFileArr.push(UpdateRoot + entry))
  UpdateAssets.entryStyles.filter(item => item != NewAppCssName).map(entry => RemoveFileArr.push(UpdateRoot + entry))

  return true
}

// 更新chunk文件
function updateChunkJs () {
  let allChunkUpdate = []
  let updateChunk = Object.keys(UpdateAssets.asyncChunks)
  updateChunk.map(chunkName => {
    let newAsyncChunks = UpdateAssets.asyncChunks[chunkName]
    let oldAsyncChunks = DistAssets.asyncChunks[chunkName]
    let newChunkFile = config.update.assetsRoot + '/' + newAsyncChunks.file
    let outChunkFile = config.build.assetsRoot + '/' + newAsyncChunks.file
    let oldChunkFile = config.build.assetsRoot + '/' + oldAsyncChunks.file
    allChunkUpdate.push(new Promise((resolve) => {
        fs.readFile(newChunkFile, 'utf8', (err, files) => {
          let result = files.replace(/webpackJsonp\(\[(.+)\]/, str => str.replace(newAsyncChunks.id, oldAsyncChunks.id))
          logger[!!err ? 'error' : 'info'](`replace chunk id err: ${!!err}, chunkName: ${chunkName}, newId: ${newAsyncChunks.id}, oldId: ${oldAsyncChunks.id}, msg: ${(err || 'none').toString()}`)
          if (err) {
            resolve(!err)
          } else {
            fs.writeFile(newChunkFile, result, 'utf8', wErr => {
              logger[!!wErr ? 'error' : 'info'](`write chunk id err: ${!!wErr}, chunkName: ${chunkName}, newId: ${newAsyncChunks.id}, oldId: ${oldAsyncChunks.id}, msg: ${(wErr || 'none').toString()}`)
              if (!wErr) {
                util.copyFile(newChunkFile, outChunkFile).then(res => {
                  logger[res.err ? 'error' : 'info'](`copy chunk err: ${res.err}: ${res.from} --> ${res.to} , msg: ${(res.msg || 'none').toString()}`)
                  AsyncChunkHash[chunkName] = {newChunkHash: newAsyncChunks.hash, oldChunkHash: oldAsyncChunks.hash};
                  (newAsyncChunks.file != oldAsyncChunks.file) && RemoveFileArr.push(oldChunkFile, oldChunkFile + '.gz')
                  OutFiles.push(newAsyncChunks.file)
                  resolve(res.err)
                })
              } else {
                resolve(!wErr)
              }
            })
          }
        })
      }).then(err => err)
    )
  })
  return Promise.all(allChunkUpdate).then(resArr => !resArr.some(err => err))
}

// 更新manifest
function updateManifest () {
  let srcManifest = DistRoot + OldManifestFileName
  let outManifest = UpdateRoot + NewManifestFileName
  return new Promise((resolve) => {
    util.copyFile(srcManifest, outManifest).then(res => {
      logger[res.err ? 'error' : 'info'](`copy manifest err: ${res.err}: ${res.from} --> ${res.to} , msg: ${(res.msg || 'none').toString()}`)
      if (res.err) {
        resolve(!res.err)
      } else {
        fs.readFile(outManifest, 'utf8', (err, files) => {
          let result = files
          logger[err ? 'error' : 'info'](`read manifest err: ${!!err}, msg: ${(err || 'none').toString()}`)
          if (err) {
            resolve(false)
          } else {
            Object.keys(AsyncChunkHash).map(chunkName => {
              logger['info'](`replace manifest err: false, ${AsyncChunkHash[chunkName].oldChunkHash} --> ${AsyncChunkHash[chunkName].newChunkHash} , msg: none`)
              result = result.replace(new RegExp(AsyncChunkHash[chunkName].oldChunkHash), AsyncChunkHash[chunkName].newChunkHash)
            })
            fs.writeFile(outManifest, result, 'utf8', function (wErr) {
              logger[wErr ? 'error' : 'info'](`write manifest err: ${!!wErr}: ${outManifest}, msg: ${(wErr || 'none').toString()}`)
              if (wErr) {
                resolve(false)
              } else {
                util.copyFile(outManifest, DistRoot + NewManifestFileName).then(res => {
                  logger[res.err ? 'error' : 'info'](`copy manifest err: ${res.err}: ${res.from} --> ${res.to} , msg: ${(res.msg || 'none').toString()}`)
                  OldManifestFileName != NewManifestFileName && RemoveFileArr.push(srcManifest, srcManifest + '.gz')
                  OutFiles.push(NewManifestFileName)
                  resolve(!res.err)
                })
              }
            })
          }
        })
      }
    })
  })
}

// 复制index
function copyIndex (from, to) {
  return util.copyFile(from, to).then(res => {
    logger[res.err ? 'error' : 'info'](`copy index err: ${res.err}: ${res.from} --> ${res.to} , msg: ${(res.msg || 'none').toString()}`)
    return res.err
  })
}

// 更新应用css
function copyCssToDist () {
  return util.copyFile(UpdateRoot + NewAppCssName, DistRoot + NewAppCssName).then(res => {
    logger[res.err ? 'error' : 'info'](`copy css err: ${res.err}: ${res.from} --> ${res.to} , msg: ${(res.msg || 'none').toString()}`)
    NewAppCssName != OldAppCssName && RemoveFileArr.push(DistRoot + OldAppCssName, DistRoot + OldAppCssName + '.gz')
    OutFiles.push(NewAppCssName)
    return res.err
  })
}

// 更新html内容
function replaceHtmlContent () {
  return new Promise(resolve => {
    fs.readFile(UpdateIndex, 'utf8', (err, files) => {
      let result = files
      logger[err ? 'error' : 'info'](`read index err: ${!!err}, msg: ${(err || 'none').toString()}`)
      if (err) {
        resolve(false)
      } else {
        [
          {old: OldAppCssName, new: NewAppCssName},
          {old: OldManifestFileName, new: NewManifestFileName}
        ].map(item => {
          logger['info'](`replace index err: false, ${item.old} --> ${item.new} , msg: none`)
          result = result.replace(item.old, item.new)
        })
        fs.writeFile(UpdateIndex, result, 'utf8', function (wErr) {
          logger[wErr ? 'error' : 'info'](`write index err: ${!!wErr}: ${UpdateIndex}, msg: ${(wErr || 'none').toString()}`)
          resolve(!wErr)
        })
      }
    })
  })
}

// 更新html
async function updateHtml () {
  let copyHtmlToUpdate = await copyIndex(DistIndex, UpdateIndex)
  let copyCssToDistRes = !copyHtmlToUpdate && await copyCssToDist()
  let replaceHtmlContentRes = !copyCssToDistRes && await replaceHtmlContent()
  let replaceDistHtml = replaceHtmlContentRes && await copyIndex(UpdateIndex, DistIndex)
  return !replaceDistHtml
}

// 更新assets
function updateAssets () {
  return new Promise(resolve => {
    fs.readFile(DistAssetsPath, 'utf8', (err, files) => {
      let result = files
      let replace = []
      logger[err ? 'error' : 'info'](`read assets err: ${!!err}, msg: ${(err || 'none').toString()}`)
      if (err) {
        resolve(false)
      } else {
        replace = [{old: OldAppCssName, new: NewAppCssName}, {old: OldManifestFileName, new: NewManifestFileName}]
        Object.keys(AsyncChunkHash).map(chunkName => replace.push({old: AsyncChunkHash[chunkName].oldChunkHash, new: AsyncChunkHash[chunkName].newChunkHash}))
        replace.map(item => {
          logger['info'](`replace assets err: false, ${item.old} --> ${item.new} , msg: none`)
          result = result.replace(new RegExp(item.old, 'g'), item.new)
        })
        fs.writeFile(DistAssetsPath, result, 'utf8', function (wErr) {
          logger[wErr ? 'error' : 'info'](`write assets err: ${!!wErr}: ${DistAssetsPath}, msg: ${(wErr || 'none').toString()}`)
          resolve(!wErr)
        })
      }
    })
  })
}

// 删除无用文件
function removeFile () {
  let allRemove = []
  RemoveFileArr.map(file => allRemove.push(
    util.removeFile(file).then(res => {
      logger[res.err ? 'warn' : 'info'](`delete file err ${res.err}: ${res.filePath} , msg: ${(res.msg || 'none').toString()}`)
      return res.err
    })
  ))
  return Promise.all(allRemove).then(() => true)
}

// 压缩输出文件
function gzip () {
  let allFile = []
  OutFiles.map(file => allFile.push(new Promise(resolve => {
    logger['info'](`gzip file err false: ${UpdateRoot + file} --> ${UpdateRoot + file}.gz, msg: none`)
    fs.createReadStream(UpdateRoot + file).pipe(zlib.createGzip()).pipe(fs.createWriteStream(UpdateRoot + file + '.gz'))
    resolve()
  })))
  return Promise.all(allFile).then(() => true)
}

// 复制压缩文件
function copyGzip () {
  let allFile = []
  OutFiles.map(file => allFile.push(util.copyFile(UpdateRoot + file + '.gz', DistRoot + file + '.gz').then(res => {
    logger[res.err ? 'error' : 'info'](`copy gzip err: ${res.err}: ${res.from} --> ${res.to} , msg: ${(res.msg || 'none').toString()}`)
    return res.err
  })))
  return Promise.all(allFile).then(() => true)
}

/**
 * 更新操作
 * @returns {Promise<any>}
 */
async function update () {
  await loadInfo()
  let updateChunkJsRes = await updateChunkJs()
  let updateManifestRes = updateChunkJsRes && await updateManifest()
  let updateHtmlRes = updateManifestRes && await updateHtml()
  let updateAssetsRes = updateHtmlRes && await updateAssets()
  let removeFileRes = updateAssetsRes && await removeFile()
  removeFileRes && await gzip() && await copyGzip()
  return new Promise(resolve => resolve({success: removeFileRes, chunk: Object.keys(AsyncChunkHash)}))
}

module.exports = update
