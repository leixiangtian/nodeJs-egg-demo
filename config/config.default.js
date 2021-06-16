/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1623748298132_1998';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };
  config.cors = {
    origin: '*', // 匹配规则  域名+端口  *则为全匹配
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.multipart = {
    mode: 'stream',
    fileSize: '520mb',
    // 文件头的长度
    bufLength: 4,
    // 最大头像的宽度大小
    maxIconWidth: 100,
    // 最大头像的高度大小
    maxIconHeight: 100,
    // 最大头像的字节大小
    maxIconImgSize: 2097152,
    // 最大功能图片的字节大小
    maxFunImgSize: 5242880,
    // 最大小场景的字节大小
    maxProgramFileSize: 4194304,
    // 最大EXCEL的字节大小
    maxExcelFileSize: 10485760,
    // product业务：最大apk/sdk大小 500m
    maxProductSdkApkFileSize: 500*1024*1024,
    // product业务：最大文件大小 50m
    maxProductDocFileSize: 50*1024*1024,
    // 增加可上传文件类型
    fileExtensions: [
      '.xls', 'xlsx', '.md',
      '.png', '.jpg', '.jpeg',
      '.pdf', '.doc', '.docx', '.apk', 'ppt', 'pptx',
      '.csv', '.txt', '.json',
    ],
  };

  return {
    ...config,
    ...userConfig,
  };
};
