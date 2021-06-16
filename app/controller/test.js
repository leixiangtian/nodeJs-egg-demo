'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async test() {
    console.log('我是test');
    this.ctx.body = '这里是test页面';
    
  }
}

module.exports = TestController;
