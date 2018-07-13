var baseUrl = 'http://wx.xlink.cn' // 云智易微信refustFul地址（如独立部署找相应的地址）
var platformUrl = 'http://api2.xlink.cn' // 云智易平台URL（如独立部署找相应的地址）

var XLINKAPPID = '2e07d2b1f2cdae00' // 云智易平台应用AppId（请修改对应的云智易应用appId）


// 封装请求
function sdkAjax(type, url, cb, errcb) {
  $.ajax({
      url: url,
      type: type,
      beforeSend: function(xhr) { xhr.setRequestHeader('Access-Token', window.localStorage.getItem('accessToken')) }, //这里设置header
      success: function(data) {
          cb(data)
      },
      error: function(err) {
          if (errcb == undefined) {
            console.log('接口失败')
            return
          }
          errcb(err)
      }
  })
}

// 获取url上的code参数
function getSearchCode() {
    let search = location.href
    let searchs = {}
    let strs
    if (search.indexOf('?') !== -1) {
        search = search.substr(search.indexOf('?') + 1)
        strs = search.split('&')
        for (let i = 0; i < strs.length; i++) {
            searchs[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
        }
    }
    window.localStorage.setItem('code', searchs['code'])
    return searchs['code']
}


// 获取虚拟设备的端口
function getVdevice (productId, deviceId, cb, errcb) {
    sdkAjax('get', platformUrl + '/v2/product/' + productId + '/v_device/' + deviceId, cb,errcb)
}

// 获取虚拟设备的端口(封装promise)
function fetchVdevicePromise (productId, deviceId) {
    return new Promise(function(resolve, reject){
        sdkAjax('get', platformUrl + '/v2/product/' + productId + '/v_device/' + deviceId, function(data){
            resolve(data)
        } ,function(err){
            reject(err)
        })
    })
}


// 获取openid
function fetchOpenId (cb, errcb) {
  sdkAjax('get', baseUrl + '/v2/wechat_gateway/' + XLINKAPPID + '/get_open_id?code=' + getSearchCode(), cb,errcb)
}

// 获取管理台的token
function fetchToken (cb, errcb) {
  sdkAjax('get', baseUrl + '/v2/wechat_gateway/' + XLINKAPPID + '/wx_access_token?open_id=' + window.localStorage.getItem('openId') + '&resource=wechat', cb, errcb)
}


// 获取设备的列表
function fetchDeviceList (cb, errcb) {
  sdkAjax('get', baseUrl + '/v2/wechat_gateway/' + XLINKAPPID + '/wx_device_list?access_token=XLINKUserAccessToken&open_id=' + window.localStorage.getItem('openId'), cb, errcb)
}
