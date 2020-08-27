'use strict';

var ConcatSource;
try {
  ConcatSource = require('webpack-core/lib/ConcatSource');
} catch (e) {
  ConcatSource = require('webpack-sources').ConcatSource;
}

function MonitorRepeatRequestPlugin(options) {
  this.options = options || {};
  this.chunk = this.options.chunk || '';
}

MonitorRepeatRequestPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    let distChunk = this.findAsset(compilation);
    let beforeContent = '(function(){var monitorRepeatRequest=function(){var requestCache={};var requestInfo={};var onXMLOpen=function(params){requestInfo.method=params[0];requestInfo.url=params[1];requestInfo.async=params[2]};var onXMLSend=function(params){requestInfo.body=params[0];checkIsRepeat(requestInfo)};var checkIsRepeat=function(requestObj){var url=requestObj.url,body=requestObj.body;var curRequest=requestCache[url];var times=1;if(curRequest&&Date.now()-curRequest.timestamp<1000){times=curRequest.times+1;var errMsg="";if(JSON.stringify(body)===curRequest.body){errMsg=url+"\u57281s\u5185\u8FDE\u7EED\u8BF7\u6C42"+times+"\u6B21\uFF0C\u4E14\u53C2\u6570\u76F8\u540C\uFF0C\u8BF7\u68C0\u67E5";toast(errMsg)}else{errMsg=url+"\u57281s\u5185\u8FDE\u7EED\u8BF7\u6C42"+times+"\u6B21\uFF0C\u4E0D\u8FC7\u8BF7\u6C42\u53C2\u6570\u4E0D\u540C\uFF0C\u8BF7\u68C0\u67E5";toast(errMsg)}console.log("【重复请求】",errMsg)}requestCache[url]={url:url,timestamp:Date.now(),body:JSON.stringify(body),times:times}};var toast=function(msg){var styles={background:"rgba(51, 51, 51, 0.8)",border:"1px solid rgba(255, 255, 255, 0.2)",boxShadow:"0 0 4px 0 rgba(0, 0, 0, 0.2)",borderRadius:"4px",padding:"12px 16px",color:"white",fontSize:"16px",position:"fixed",top:"10%",left:"50%",transform:"translateX(-50%)",zIndex:"9999"};var tipsDom=document.createElement("div");tipsDom.innerText=msg;Object.keys(styles).forEach(function(key){tipsDom.style[key]=styles[key]});document.body.appendChild(tipsDom);setTimeout(function(){document.body.removeChild(tipsDom)},10000)};var originSend=XMLHttpRequest.prototype.send;var originOpen=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(){var args=[];for(var _i=0;_i<arguments.length;_i++){args[_i-0]=arguments[_i]}onXMLOpen(args);return originOpen.apply(this,args)};XMLHttpRequest.prototype.send=function(){var args=[];for(var _i=0;_i<arguments.length;_i++){args[_i-0]=arguments[_i]}onXMLSend(args);return originSend.apply(this,args)}};monitorRepeatRequest()})();';

    let source = compilation.assets[distChunk].source();

    compilation.assets[distChunk].source = () => {
      return source;
    };

    compilation.assets[distChunk] = new ConcatSource(beforeContent, compilation.assets[distChunk]);
    callback();
  });
};

MonitorRepeatRequestPlugin.prototype.findAsset = function (compilation) {
  let chunks = compilation.chunks;
  for (let i = 0, len = chunks.length; i < len; i++) {
    if (chunks[i].name === this.chunk) {
      return chunks[i].files[0];
    }
  }

  return null;
};

module.exports = MonitorRepeatRequestPlugin;
