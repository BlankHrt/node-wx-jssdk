// const https = require('https');
const request = require('request');
const WXBizDataCrypt = require('./lib/WXBizDataCrypt')
const md5 = require('./lib/md5');
const randomstring = require("randomstring");
const { parseString } = require('xml2js')
// const Stream = require('stream').Transform;
// const co = require('co');
// const uuidv1 = require('uuid/v1');
// const { client } = require('../utils/oss');

let wx = {}
wx.login = ({ code, appid, secret }) => {
    return new Promise((res, rej) => {
        if (code && appid && secret) {
            var param = "?grant_type=authorization_code" + "&appid=" + appid + "&secret=" + secret + "&js_code=" + code;
            request.get("https://api.weixin.qq.com/sns/jscode2session" + param, (error, response, body) => {
                // console.error('error:', error); // Print the error if one occurred
                // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                // console.log('body:', body); // Print the HTML for the Google homepage.
                if (error) {
                    rej(error)
                }
                res(body)
            })
        } else {
            rej({ error: '请传递正确参数' })
        }
    })
};

wx.decrypt = ({ appid, session_key, encryptedData, iv }) => {
    return new Promise((res, rej) => {
        if (appid && session_key && encryptedData && iv) {
            const pc = new WXBizDataCrypt(appid, session_key)
            const data = pc.decryptData(encryptedData, iv)
            res(data)
        } else {
            rej({ error: '请传递正确参数' })
        }
    })
}


const pad2 = (n) => (n < 10 ? '0' + n : n)
const pad3 = (n) => (n < 10 ? '00' + n : (n < 100 ? '0' + n : n))
const generateNumber = () => {
    var date = new Date();
    var newDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad3(date.getMilliseconds());
    return newDate + Math.round(Math.random() * (2 ** 30)).toString().substr(2, 5)
}

const get_client_ip = (req) => {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    return ip;
};

wx.pay = ({ appid, body, mch_id, notify_url, openid, spbill_create_ip, total_fee, KEY }) => {
    const params = req.body
    const out_trade_no = generateNumber()
    const nonce_str = randomstring.generate({
        charset: 'alphanumeric',
        length: 16
    });

    const postObject = {
        appid,
        body,
        mch_id,
        nonce_str,
        notify_url,
        openid,
        out_trade_no,
        spbill_create_ip,
        total_fee,
        trade_type: 'JSAPI',
    }
    var keys = Object.keys(postObject).sort();
    var signData = '';
    for (var key of keys) {
        if (postObject[key]) {
            signData += "&" + key + "=" + postObject[key];
        }
    }

    signData = signData.slice(1) + "&key=" + KEY;

    var sign_type = params.sign_type || "MD5";
    if (sign_type == "HMAC-SHA256") {
        var sign = hmac_sha256(signData, wkey) + '';
        sign = sign.toUpperCase();
    } else {
        var sign = md5(signData).toUpperCase();
    }

    postObject.sign = sign;
    var postData = '<xml>';
    for (var key in postObject) {
        if (postObject[key]) {
            postData += '<' + key + '>' + postObject[key] + '</' + key + '>';
        }
    }
    postData += '</xml>';

    return new Promise((res, rej) => {
        request.post({
            url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: postData
        }, (error, response, body) => {
            // console.error('error:', error); // Print the error if one occurred
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            parseString(body, { trim: true }, (err, result) => {
                let prepay_id = result.xml.prepay_id[0];

                let timeStamp = Math.ceil((new Date().getTime()) / 1000) + '';

                let stringSignTemp = "appId=" + appid + "&nonceStr=" + nonce_str + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + KEY;
                let paySign = md5(stringSignTemp).toUpperCase()
                let responseData = {
                    nonceStr: nonce_str,
                    package: 'prepay_id=' + prepay_id,
                    timeStamp: timeStamp,
                    paySign: paySign,
                    total_fee: total_fee,
                    signType: 'MD5',
                    number: number
                }
                if (error) {
                    rej(error)
                }
                res(responseData)
            });
        })
    })
};

// GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

wx.getAccessToken = ({ appid, secret }) => {
    return new Promise((res, rej) => {
        if (appid && secret) {
            var param = "?grant_type=client_credential" + "&appid=" + appid + "&secret=" + secret;
            request.get("https://api.weixin.qq.com/cgi-bin/token" + param, (error, response, body) => {
                // console.error('error:', error); // Print the error if one occurred
                // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                // console.log('body:', body); // Print the HTML for the Google homepage.
                if (error) {
                    rej(error)
                }
                res(body)
            })
        } else {
            rej({ error: '请传递正确参数' })
        }
    })
}

generateQrcode = (scene, page, access_token) => {
    var postData = JSON.stringify({
        'scene': scene,
        'page': page,
        "width": 430,
        "auto_color": false,
        "line_color": { "r": "0", "g": "0", "b": "0" },
        "is_hyaline": false
    });

    // POST https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=ACCESS_TOKEN

    return new Promise((res, rej) => {
        request.post({
            url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: postData
        }, (error, response, body) => {
            // console.error('error:', error); // Print the error if one occurred
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('statusCode:', body); // Print the response status code if a response was received
            // co(function* () {
            //     var result = yield client.put('e-commerce/qrCode/' + uuidv1() + '.jpg', data.read());
            //     res.send(result.url)
            // }).catch(function (err) {
            //     console.log(err);
            // });
            if (error) {
                rej(error)
            }
            res(body)
        })
    })
}

module.exports = wx