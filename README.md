### 安装 
```
cnpm i -S node-wx-jssdk
```

### 引用 
```
const wx = require('node-wx-jssdk')
```
### 返回值全部是promise 请自行await 或 then
### 微信登录
```
wx.login({code, appid, secret}).then(res=>...)
```
### 手机号解析（仅支持企业注册的小程序，且微信认证）
```
wx.decrypt({appid, session_key, encryptedData, iv})
```
### 微信支付 
```
wx.pay({ appid, body, mch_id, notify_url, openid, spbill_create_ip, total_fee, KEY }).then(res=>...)
``` 
### 获取AccessToken
```
wx.getAccessToken({ appid, secret }) .then(res=>...)

```