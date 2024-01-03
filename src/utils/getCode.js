export function getCode(str) {
    /* NN-SR
     * http://code.sanrangas.com?code=26011650004595 旧二维码
     * http://code.sanrangas.com/NN/4002635 新二维码
     * +000000004002964  旧码
     * +SR0000001047369  普通使用码
     * +SR90000001 临时码
     */

    //获取扫码模式 0不限制，1只读取一维码，2只读取二维码
    var mode = 0

    var oldBarcode = /^\+\d{14,15}$/ //旧码规则
    var oldQrcode = /^http:\/\/www.sanrangas.com/ //旧码规则

    var barcode = /^\+SR\d{8,13}$/ //条码规则
    var qrcode = /^http:\/\/srcode.sanrangas.com/ //二维码规则

    var axBarcode = /^\+0{8}\d{7}$/
    var axQrcode = /^http:\/\/code.sanrangas.com/

    var numberCode = /\d+/

    var code = '',
        type = 0

    //主要
    if ((mode == 1 && barcode.test(str)) || (mode == 2 && qrcode.test(str)) || (barcode.test(str) || qrcode
        .test(str))) {
        str.length == 11 ? (code = str.substr(1), type = 4) : (str.indexOf('AR3') > -1 ? (code = str.substr(-10), type = 5) : (code = str.substr(-7), type = 1))
    }

    //部分
    else if ((mode == 1 && oldBarcode.test(str)) || (mode == 2 && oldQrcode.test(str)) || (oldBarcode.test(
        str) || oldQrcode.test(str))) {
        var num = /\d+/.exec(str)[0]
        code = num.substr(8)
        type = 2
    }

    //极少
    else if ((mode == 1 && axBarcode.test(str)) || (mode == 2 && axQrcode.test(str)) || (axBarcode.test(
        str) || axQrcode.test(str))) {
        code = str.substr(-7)
        type = 3
    }
    //纯数字
    else if (numberCode.test(str)) {
        code = str
        type = 5
    }

    var data = {},
        types = ['', '新码', '旧码', '艾信码', '临时码', '数字','新国标']


    if (code) {

        data = {
            msg: 'SUCCESS',
            code,
            type: types[type]
        }
    } else {

        data = {
            msg: '非法码',
            code: '',
            type: types[type]
        }
    }


    return new Promise((resolve, reject) => {
        resolve(data)
    })

}
