<h1 align="center">Welcome to repeat-request-minder-webpack-plugin 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> 一个可以帮助你检查项目中是否存在重复请求的webpack插件。使用后会自动监听请求，当发现1秒内有发出多次相同的请求时，会toast提示并在控制台上打印请求信息。

## Usage

```js
const RepeatRequestMinderWebpackPlugin = require('./repeat-request-minder-webpack-plugin');
new RepeatRequestMinderWebpackPlugin({
  chunk: 'index',
}),
```
配置项chunk中填入你希望监听重复请求的entry名字
也可以配置toast是否显示以及toast显示的时长(默认显示toast，时长为3秒)
```js
new RepeatRequestMinderWebpackPlugin({
  chunk: 'index',
  options: {
    isShowToast: true,
    toastTime: 10000
  }
}),
```

## Author

👤 **Brady**

* Github: [@Brady](https://github.com/WadeZhu)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_