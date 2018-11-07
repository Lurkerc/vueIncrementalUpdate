'use strict'
const fs = require('fs')

/**
 * 文件是否存在
 * @param filePath
 * @returns {Promise<any>}
 */
function fileExist (filePath) {
  return new Promise((resolve) => {
    fs.stat(filePath, (err, stats) => resolve(err ? false : stats.isFile()))
  })
}

/**
 * 删除文件
 * @param filePath
 * @returns {Promise<any>}
 */
async function removeFile (filePath) {
  return new Promise((resolve) => fs.unlink(filePath, err => resolve({err: !!err, filePath, msg: err})))
}

/**
 * 复制文件
 * @param {string} from 原文件
 * @param {string} to 复制文件
 */
function copyFile (from, to) {
  return new Promise((resolve) => {
    if (!fileExist(from)) {
      resolve({err: true, from, to, msg: `not found ${from}`})
    } else {
      fs.copyFile(from, to, err => resolve({err: !!err, from, to, msg: err}))
    }
  })
}

/**
 * 从数组中提前指定的数据
 * @param reg
 * @param arr
 * @returns {string}
 */
function getPathByArr (reg, arr) {
  let path = ''
  arr.some(item => new RegExp(reg).test(item) && (path = item))
  return path
}

/**
 * 退出进程并提示信息
 * @param msg
 */
function exit (msg) {
  console.log(msg)
  process.exit(1)
}

exports.fileExist = fileExist
exports.removeFile = removeFile
exports.copyFile = copyFile
exports.getPathByArr = getPathByArr
exports.exit = exit
