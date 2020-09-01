"use strict";

var ConcatSource;
try {
  ConcatSource = require("webpack-core/lib/ConcatSource");
} catch (e) {
  ConcatSource = require("webpack-sources").ConcatSource;
}

function MonitorRepeatRequestPlugin(params) {
  this.params = params || {};
  this.chunk = this.params.chunk || "";
  this.options = this.params.options;
}

MonitorRepeatRequestPlugin.prototype.apply = function (compiler) {
  compiler.plugin("emit", (compilation, callback) => {
    let distChunk = this.findAsset(compilation);
    let beforeContent =
      '(function(){var LRUCache=function(capacity){this.map={};this.size=0;this.maxSize=capacity;this.head={prev:null,next:null,};this.tail={prev:this.head,next:null,};this.head.next=this.tail};LRUCache.prototype.get=function(key){if(this.map[key]){var node=this.extractNode(this.map[key]);this.insertNodeToHead(node);return this.map[key].val}else{return -1}};LRUCache.prototype.put=function(key,value){var node;if(this.map[key]){node=this.extractNode(this.map[key]);node.val=value}else{node={prev:null,next:null,val:value,key:key,};this.map[key]=node;this.size++}this.insertNodeToHead(node);if(this.size>this.maxSize){var nodeToDelete=this.tail.prev;var keyToDelete=nodeToDelete.key;this.extractNode(nodeToDelete);this.size--;delete this.map[keyToDelete]}};LRUCache.prototype.insertNodeToHead=function(node){var head=this.head;var lastFirstNode=this.head.next;node.prev=head;head.next=node;node.next=lastFirstNode;lastFirstNode.prev=node;return node};LRUCache.prototype.extractNode=function(node){var beforeNode=node.prev;var afterNode=node.next;beforeNode.next=afterNode;afterNode.prev=beforeNode;node.prev=null;node.next=null;return node};var monitorRepeatRequest=function(options){if(options===void 0){options={isShowToast:true,toastTime:3000}}var isShowToast=options.isShowToast,toastTime=options.toastTime;var requestCache=new LRUCache(30);var requestInfo={};var onXMLOpen=function(params){requestInfo.method=params[0];requestInfo.url=params[1];requestInfo.async=params[2]};var onXMLSend=function(params){requestInfo.body=params[0];checkIsRepeat(requestInfo)};function checkIsRepeat(requestObj){var url=requestObj.url,body=requestObj.body;var curRequest=requestCache.get(url);var times=1;if(curRequest&&Date.now()-curRequest.timestamp<1000){times=curRequest.times+1;if(JSON.stringify(body)===curRequest.body){var errMsg=url+"\u57281s\u5185\u8FDE\u7EED\u8BF7\u6C42"+times+"\u6B21\uFF0C\u4E14\u53C2\u6570\u76F8\u540C\uFF0C\u8BF7\u68C0\u67E5";isShowToast&&toast(errMsg);console.log("【重复请求】",errMsg)}}var cacheValue={url:url,timestamp:Date.now(),body:JSON.stringify(body),times:times,};requestCache.put(url,cacheValue)}function toast(msg){var styles={background:"rgba(51, 51, 51, 0.8)",border:"1px solid rgba(255, 255, 255, 0.2)",boxShadow:"0 0 4px 0 rgba(0, 0, 0, 0.2)",borderRadius:"4px",padding:"12px 16px",color:"white",fontSize:"16px",position:"fixed",top:"10%",left:"50%",transform:"translateX(-50%)",zIndex:"9999",};var tipsDom=document.createElement("div");tipsDom.innerText=msg;Object.keys(styles).forEach(function(key){tipsDom.style[key]=styles[key]});document.body.appendChild(tipsDom);setTimeout(function(){document.body.removeChild(tipsDom)},toastTime)}var originSend=XMLHttpRequest.prototype.send;var originOpen=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(){var args=[];for(var _i=0;_i<arguments.length;_i++){args[_i-0]=arguments[_i]}onXMLOpen(args);return originOpen.apply(this,args)};XMLHttpRequest.prototype.send=function(){var args=[];for(var _i=0;_i<arguments.length;_i++){args[_i-0]=arguments[_i]}onXMLSend(args);return originSend.apply(this,args)}};monitorRepeatRequest(' +
      JSON.stringify(this.options) +
      ")})();";

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
