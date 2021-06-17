'use strict';

const request = require('request');
const Controller = require('egg').Controller;
const COS = require('cos-nodejs-sdk-v5');
const toArray = require('stream-to-array');
const fs = require('fs');

const config = {
  SecretId: 'AKID0pOhjVzC8nCKBl58uQgeLlumMfhSw95k',
  SecretKey: 'QZR2MPAgwwf7JFuIPGq9BwQcXCZhY8RT',
  Bucket: 'test-1252615953',
  Region: 'ap-shenzhen-fsi',
  path: 'manualUploadApks/test',
};

const cos = new COS({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
});

class UploadController extends Controller {
  async cosSdkUpload() {
    const stream = await this.ctx.getFileStream();
    const parts = await toArray(stream);
    const buf = Buffer.concat(parts);
    const appId = stream.fields.appId;
    // 处理文件
    const formData = {
      code: '',
      fileInfo: {
        fileName: stream.filename,
        fileSize: '',
        fileUrl: '',
        sha256: '',
      },
      msg: '',
    };
    return new Promise((resolve, reject) =>{
      // 单片上传
      // cos.putObject({
      //   Bucket: config.Bucket, /* Bucket,名称 必须 */
      //   Region: config.Region,    /* 所属地域 必须 */
      //   Key: `${config.path}/${appId}/${stream.filename}`,            /* 必须 */
      //   Body: buf, // 上传文件对象
      //   // Body: fs.readFileSync(filepath), // 上传文件对象
      // }, function(err, data) {
      //   // console.log(err, data);
      //   if (err) {
      //     reject(err);
      //   } else {
      //     formData.code = 0;
      //     formData.fileInfo.fileUrl = `https://${data.Location}`;
      //     formData.msg = 'success';
      //     resolve(formData);
      //   }
      // });

      // 分片上传
      cos.sliceUploadFile({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: `${config.path}/${appId}/${stream.filename}`,
        FilePath: './',
        Body: stream,
      }, function(err, data) {
        if (err) {
          reject(err);
        } else {
          formData.code = 0;
          formData.fileInfo.fileUrl = `https://${data.Location}`;
          formData.msg = 'success';
          resolve(formData);
        }
      });
    })
  }

  async upload() {
    const result = await this.cosSdkUpload();
    this.ctx.body = result;
  }
}

module.exports = UploadController;
