'use strict';

const request = require('request');
const Controller = require('egg').Controller;
const COS = require('cos-nodejs-sdk-v5');
const toArray = require('stream-to-array');


const cos = new COS({
  SecretId: 'AKID0pOhjVzC8nCKBl58uQgeLlumMfhSw95k',
  SecretKey: 'QZR2MPAgwwf7JFuIPGq9BwQcXCZhY8RT',
});

class UploadController extends Controller {
  async _uploadFile(cgi, method, form, operator) {
    return new Promise(resolve => {
      const result = {
        cgi,
        method,
        form,
        operator,
      }
      resolve(result);
    })
  }

  async upload() {
    const stream = await this.ctx.getFileStream();
    const parts = await toArray(stream);
    const buf = Buffer.concat(parts);

    // 处理文件
    const formData = {
      file: {
        value: buf,
        options: {
          filename: stream.filename,
          contentType: stream.mimeType,
        },
      },
      appId: this.ctx.get('appId'),
    };

    cos.putObject({
      Bucket: 'test-1252615953', /* Bucket,名称 必须 */
      Region: 'ap-shenzhen-fsi',    /* 所属地域 必须 */
      Key: stream.filename,            /* 必须 */
      Body: buf, // 上传文件对象
      // Body: fs.readFileSync(filepath), // 上传文件对象
      onProgress(info) {
        const percent = Math.floor(info.percent * 10000) / 100;
        const speed = Math.floor(info.speed / 1024 / 1024 * 100) / 100;
        console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
      },
    }, function(err, data) {
      console.log(err || data);
    });

    // 获取操作人信息
    // const operator = this.ctx.user.userName;
    const operator = 'nametest';
    // 上传
    const result = await this._uploadFile('/uploadApkFile', 'POST', formData, operator);
    this.ctx.body = result;

    // cos.sliceUploadFile({
    //   Bucket: 'test-1252615953', /* 必须 */
    //   Region: 'ap-shenzhen-fsi', /* 必须 */
    //   Key: filename, /* 必须 */
    //   FilePath: 'https://test-1252615953.cos.ap-shenzhen-fsi.myqcloud.com/'+filename, /* 必须 */
    //   Body: filename,
    //   // onTaskReady(taskId) { /* 非必须 */
    //   //   console.log(taskId);
    //   //   console.log('taskId');
    //   // },
    //   // onHashProgress(progressData) { /* 非必须 */
    //   //   console.log(JSON.stringify(progressData));
    //   //   console.log('onHashProgress');
    //   // },
    //   // onProgress(progressData) { /* 非必须 */
    //   //   console.log(JSON.stringify(progressData));
    //   //   console.log('onProgress');
    //   // }
    // }, function(err, data) {
    //   console.log(err || data);
    //   console.log('丢');
    // });
  }

  
}

module.exports = UploadController;
