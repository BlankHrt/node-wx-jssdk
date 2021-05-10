### 安装 
```
cnpm i -S node-wx-jssdk
```

### 引用 
```
const WX = require('node-wx-jssdk')
```
### 返回值全部是promise 请自行await 或 then
### 微信登录[参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)
```
WX.login({code, appid, secret}).then(res=>...)
```
### 手机号解析[参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html)
```
WX.decrypt({appid, session_key, encryptedData, iv})
```
### 微信支付 [参考文档](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_1.shtml)
```
WX.pay({ appid, body, mch_id, notify_url, openid, spbill_create_ip, total_fee, KEY }).then(res=>...)
``` 
### 获取AccessToken[参考文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html)
```
WX.getAccessToken({ appid, secret }) .then(res=>...)

```
### 获取小程序码[参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/qr-code.html)
```
WX.generateQrcode({ scene, page, access_token }).then(res=>...)

```
### 联系我升级更新
![微信二维码](lqh.jpg)