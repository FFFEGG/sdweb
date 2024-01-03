import moment from "moment";
import { get } from "./request";





export default function myprint(info) {
     // console.log(JSON.parse(JSON.parse(data.info)));

     const getremarks = (str) => {
          // 如果str 包含 气 或者费用 或者  超高 或者 检查费 或者租金或者补差
          if (str.indexOf('水') > -1) {
               return '温馨提示:1、桶装水开封后建议两周内饮用完为宜。2、饮水机2-6个月因清洗消毒一次（可有偿上门服务）。'
          }
          if (str.indexOf('气') > -1 || str.indexOf('费用') > -1 || str.indexOf('超高') > -1 || str.indexOf('检查费') > -1 || str.indexOf('租金') > -1 || str.indexOf('补差') > -1) {
               return '注1:钢瓶按国家规定定期检测，请按期缴纳检测费。' +
                    '2、办理退钢瓶押金时，须凭押金发票原件、会员号对应的登记钢瓶。' +
                    '3、押金方式，钢瓶租金按月结算，换气时缴纳。' +
                    '用户须知:每次换气时，请核对本公司送到的钢瓶号是否与单据上相符，不符有权拒绝换气。'
          }
          return '温馨提示:1、桶装水开封后建议两周内饮用完为宜。2、饮水机2-6个月因清洗消毒一次（可有偿上门服务）。'
     }
     const openAndCloseURL = (url) => {

          // 打开新的窗口
          let win = window.open(url, '_blank');
          console.log('打印win窗口', win)

          // 设定一个延时，然后关闭窗口
          setTimeout(() => {
               if (win && !win.closed) {
                    win.close();
               }
          }, 800);  // 例如，这里我们在5秒后关闭窗口
     };
     const superagent = require('superagent');
     info.type = info.type.split('-')[0]
     console.log(info)
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const data = info.info
     data.zcode = data.grantmaterial ? data.grantmaterial.toString() : ''
     data.kcode = data.recoverymaterial ? data.recoverymaterial.toString() : ''
     data.operator = loginuser.name
     data.pay_weixin = data.pay_online ? data.pay_online : 0
     if (info.type == '预约销售订单(液化气)' && loginuser.login_department != '运输公司') {
          let paystr = '';
          if (data.pay_balance > 0) {
               paystr += '余额支付:' + data.pay_balance + '元，';
          }
          if (data.pay_weixin > 0) {
               paystr += '微信支付:' + data.pay_weixin + '元，';
          }
          if (data.pay_alipay > 0) {
               paystr += '支付宝支付:' + data.pay_alipay + '元，';
          }
          if (data.pay_arrears > 0) {
               paystr += '月结支付:' + data.pay_arrears + '元，';
          }
          if (data.pay_coupon > 0) {
               paystr += '优惠券:' + data.pay_coupon + '元，';
          }
          paystr += "账户余额:" + parseFloat(data.balance).toFixed(2) + "元"
          let goodsdata = data.goodslist
          // console.log('goodsdata', goodsdata)


          // for (const i in goodsdata) {
          //      if (Object.hasOwnProperty.call(goodsdata, i)) {
          //           const element = goodsdata[i];
          //           console.log('goodsdata[i]', element)
          //      }
          // }
          if (data.pay_coupon > 0) {
               goodsdata.push({
                    goodsname: data.pay_coupon + '元优惠券',
                    mode: '',
                    price: data.pay_coupon,
                    num: '',
                    discount: '',
                    total: '-' + data.pay_coupon
               })
          }
          var json = {
               time: data.printtime + ' ' + data.bookdepartment,
               memeberid: data.memberid,
               name: data.name,
               department: data.department,
               tel: data.telephone,
               delivery: data.deliveryman == '自提' ? '' : data.deliveryman,
               address: ((data.address).replace(/#/g, "")).replace(/\[/g, ""),
               work: ((data.workplace).replace(/#/g, "")).replace(/\[/g, ""),
               goodsname1: goodsdata[0] ? goodsdata[0]['goodsname'] : '',
               goodsname2: goodsdata[1] ? goodsdata[1]['goodsname'] : '',
               goodsname3: goodsdata[2] ? goodsdata[2]['goodsname'] : '',
               goodstype1: goodsdata[0] ? goodsdata[0]['mode'] : '',
               goodstype2: goodsdata[1] ? goodsdata[1]['mode'] : '',
               goodstype3: goodsdata[2] ? goodsdata[2]['mode'] : '',
               goodsprice1: goodsdata[0] ? goodsdata[0]['price'] : '',
               goodsprice2: goodsdata[1] ? goodsdata[1]['price'] : '',
               goodsprice3: goodsdata[2] ? goodsdata[2]['price'] : '',
               goodsnum1: goodsdata[0] ? goodsdata[0]['num'] : '',
               goodsnum2: goodsdata[1] ? goodsdata[1]['num'] : '',
               goodsnum3: goodsdata[2] ? goodsdata[2]['num'] : '',
               goodsyh1: '',
               goodsyh2: '',
               goodsyh3: '',
               goodstotle1: goodsdata[0] ? goodsdata[0]['total'] : '',
               goodstotle2: goodsdata[1] ? goodsdata[1]['total'] : '',
               goodstotle3: goodsdata[2] ? goodsdata[2]['total'] : '',
               info: paystr,
               zprice: parseFloat(data.pay_cash.toString()).toFixed(2),
               zcode: (((data.zcode.replace(/@/g, ""))).replace(/&/g, "")).replace(/#/g, "井"),
               kcode: (((data.kcode.replace(/@/g, ""))).replace(/&/g, "")).replace(/#/g, "井"),
               rmarks: data.remarks.replace(/#/g, "井") + (data.salesman ? ('业务员:' + data.salesman) : '') + (data.salesmantelephone ? (',业务员电话:' + data.salesmantelephone) : ''),
               // bottominfo: data.other,
               bottominfo: '已装热水器未装排烟管          已装热水器已装排烟管',
               // bottominfo: '﻿春节营业时间:1、年三十（2023年1月21日）7:30—14:00。2、年初一至初三（1月22日—1月24日）9:30—16:00。3、年初四至初五（1月25日—1月26日）8:30—18:00。4、年初六（1月27日）起恢复正常营业时间。\n',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          console.log(json)
          var data_info = {
               PrintData: json,
               Print: true
          }
          // superagent
          //      .get('http://127.0.0.1:8000/api/print/order/1/')
          //      .query({ data: JSON.stringify(data_info) })
          //      .use(require('superagent-jsonp')({ timeout: 1000 }))  // 使用 superagent-jsonp 插件
          //      .end((err, response) => {
          //           if (err) console.error(err);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/1/?data=' + JSON.stringify(data_info))
          // superagent.get('http://127.0.0.1:8000/api/print/order/1/?data=' + JSON.stringify(data_info))
          //      .set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*')
          //      .end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });

          // axios.get('http://127.0.0.1:8000/api/print/order/1/?data=' + JSON.stringify(data_info), {
          //      headers: {
          //           'ContentType': 'application/json',
          //           // 其他可能需要的头
          //      }
          // }).then(rew => {
          //      console.log(rew)
          // })
     }

     if (info.type == '预约销售订单(普通)' && loginuser.login_department == '运输公司') {
          let goodsdata = data.goodslist
          let other_remarks = JSON.parse(data.other_remarks)
          console.log('预约销售订单(普通)', other_remarks)
          let str = ''
          let num = 0
          for (let i = 0; i < other_remarks.goods_warehouse.length; i++) {
               if (other_remarks.goods_warehouse[i].paymentstatus == '已支付') {
                    num += (other_remarks.goods_warehouse[i].num * 1)
               }
          }
          if (num > 0) {
               str += '仓库商品剩余:' + num + '个'
          }
          console.log(str)
          var jsonp = {
               title: data.pay_arrears > 0 ? "三燃燃气商品销售单(定期付款)" : "三燃燃气商品销售单",
               time: data.topinfo,
               memberid: "卡号 " + data.memberid,
               name: "姓名 " + data.name,
               tel: "电话 " + data.telephone.substr(0, 11),
               address: "地址:" + data.address.replace(/#/g, "井"),
               department: data.department,
               type1: goodsdata[0] ? goodsdata[0]['mode'] : '',
               type2: goodsdata[1] ? goodsdata[1]['mode'] : '',
               type3: goodsdata[2] ? goodsdata[2]['mode'] : '',
               band1: goodsdata[0] ? goodsdata[0]['goodsname'] : '',
               band2: goodsdata[1] ? goodsdata[1]['goodsname'] : '',
               band3: goodsdata[2] ? goodsdata[2]['goodsname'] : '',
               num1: goodsdata[0] ? goodsdata[0]['num'] : '',
               num2: goodsdata[1] ? goodsdata[1]['num'] : '',
               num3: goodsdata[2] ? goodsdata[2]['num'] : '',
               price1: data.printshowprice == '是' ? (goodsdata[0] ? '单价 ' + parseFloat(goodsdata[0]['price']).toFixed(2) : '') : '',
               price2: data.printshowprice == '是' ? (goodsdata[1] ? '单价 ' + parseFloat(goodsdata[1]['price']).toFixed(2) : '') : '',
               price3: data.printshowprice == '是' ? (goodsdata[2] ? '单价 ' + parseFloat(goodsdata[2]['price']).toFixed(2) : '') : '',
               jfcate: "",
               residualindex: parseFloat(data.pay_online) > 0 ? '微信付款:' + data.pay_online + '元' : str,
               yck: data.printshowbalance == '是' ? "预存款" : '',
               price: data.printshowbalance == '是' ? parseFloat(data.balance).toFixed(2) : '',
               cash: data.printshowprice == '是' ? ("合计收现 " + parseFloat(data.pay_cash).toFixed(2)) : '',
               delivery: "配送员:" + data.deliveryman,
               operator: "操作员:" + data.operator,
               tsinfo: data.remarks ? data.remarks.replace(/#/g, "井") + ' 业务员:' + data.salesman + ' 电话:' + data.salesmantelephone  : getremarks(goodsdata[0]['goodsname']),
               Memo18: "戴一次性手套安装",
               Memo19: "使用镊子安装",
               Memo20: "用户意见",
               Memo21: "【】是  【】 否",
               Memo22: "【】是  【】 否",
               Memo23: "【】满意【】 一般【】差",
               Memo24: "用户签字",
               Memo12: "---------------------------------------------------------------------------",
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/3/?data=' + JSON.stringify(data_infop))
          // superagent.get('http://127.0.0.1:8000/api/print/order/3/?data=' + JSON.stringify(data_infop))
          //      .set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*')
          //      .end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          return

     }


     if (info.type == '预约销售订单(普通)') {
          let goodsdata = data.goodslist
          let other_remarks = JSON.parse(data.other_remarks)
          console.log('预约销售订单(普通)', other_remarks)
          let str = ''
          let num = 0
          for (let i = 0; i < other_remarks.goods_warehouse.length; i++) {
               if (other_remarks.goods_warehouse[i].paymentstatus == '已支付') {
                    num += (other_remarks.goods_warehouse[i].num * 1)
               }
          }
          if (num > 0) {
               str += '仓库商品剩余:' + num + '个'
          }
          console.log(str)
          var jsonp = {
               title: data.pay_arrears > 0 ? "三燃燃气商品销售单(定期付款)" : "三燃燃气商品销售单",
               time: data.topinfo,
               memberid: "卡号 " + data.memberid,
               name: "姓名 " + data.name,
               tel: "电话 " + data.telephone.substr(0, 11),
               address: "地址:" + data.address.replace(/#/g, "井"),
               department: data.department,
               type1: goodsdata[0] ? goodsdata[0]['mode'] : '',
               type2: goodsdata[1] ? goodsdata[1]['mode'] : '',
               type3: goodsdata[2] ? goodsdata[2]['mode'] : '',
               band1: goodsdata[0] ? goodsdata[0]['goodsname'] : '',
               band2: goodsdata[1] ? goodsdata[1]['goodsname'] : '',
               band3: goodsdata[2] ? goodsdata[2]['goodsname'] : '',
               num1: goodsdata[0] ? goodsdata[0]['num'] : '',
               num2: goodsdata[1] ? goodsdata[1]['num'] : '',
               num3: goodsdata[2] ? goodsdata[2]['num'] : '',
               price1: data.printshowprice == '是' ? (goodsdata[0] ? '单价 ' + parseFloat(goodsdata[0]['price']).toFixed(2) : '') : '',
               price2: data.printshowprice == '是' ? (goodsdata[1] ? '单价 ' + parseFloat(goodsdata[1]['price']).toFixed(2) : '') : '',
               price3: data.printshowprice == '是' ? (goodsdata[2] ? '单价 ' + parseFloat(goodsdata[2]['price']).toFixed(2) : '') : '',
               jfcate: "",
               residualindex: parseFloat(data.pay_online) > 0 ? '微信付款:' + data.pay_online + '元' : str,
               yck: data.printshowbalance == '是' ? "预存款" : '',
               price: data.printshowbalance == '是' ? parseFloat(data.balance).toFixed(2) : '',
               cash: data.printshowprice == '是' ? ("合计收现 " + parseFloat(data.pay_cash).toFixed(2)) : '',
               delivery: "配送员:" + data.deliveryman,
               operator: "操作员:" + data.operator,
               tsinfo: data.remarks ? data.remarks.replace(/#/g, "井") : getremarks(goodsdata[0]['goodsname']),
               Memo18: "戴一次性手套安装",
               Memo19: "使用镊子安装",
               Memo20: "用户意见",
               Memo21: "【】是  【】 否",
               Memo22: "【】是  【】 否",
               Memo23: "【】满意【】 一般【】差",
               Memo24: "用户签字",
               Memo12: "---------------------------------------------------------------------------",
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/3/?data=' + JSON.stringify(data_infop))
          // superagent.get('http://127.0.0.1:8000/api/print/order/3/?data=' + JSON.stringify(data_infop))
          //      .set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*')
          //      .end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });

     }

     if (info.type == '办理包装物业务' && loginuser.login_department != '发卡室') {
          data.goods = '办理' + data.content.packingtype.toString() + ' ' + data.content.name + '数量' + data.num + '个' + '票据号:' + data.billno

          console.log('办理包装物业务', data)
          var str = ''
          // var other = JSON.parse(data.other)
          // let other = data.other
          // for (let i = 0; i < other.length; i++) {
          //      str += other[i] + '\n'
          // }
          console.log(str)
          var jsonp = {
               title: "南宁三燃燃气有限责任公司钢瓶办理单据",
               time: data.topinfo,
               memberid: "卡号 " + data.memberid,
               name: "姓名 " + data.name,
               tel: "电话 " + data.telephone,
               address: data.remarks,
               department: data.department,
               Memo2: '钢瓶资料',
               Memo1: data.goods + '  ' + data.zcode + '实付款' + data.pay_cash + '元',
               Memo3: '收款员:' + data.operator,
               Memo4: '用户签名:_______________________________',
               Memo5: str,
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/4/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/4/?data=' + JSON.stringify(data_infop))
     }

     if (info.type == '办理包装物业务' && loginuser.login_department == '发卡室') {
          data.goods = data.content.mode + '  ' + data.content.name + ' ' + '数量' + data.num + '个' + '票据号:' + data.billno
          var jsonp = {
               Memo1: "南宁三燃燃气有限责任公司钢瓶办理单据",
               Memo2: data.topinfo,
               Memo4: "卡号 " + data.memberid,
               Memo5: "姓名 " + data.name,
               Memo6: "电话 " + data.telephone,
               Memo7: "站点名称  发卡室",
               Memo8: data.goods + data.zcode + '  实付款' + data.pay_cash,
               Memo9: "",
               Memo10: "注:本单据自填制日起两个月内有效.",
               Memo11: "经办人:" + data.operator,
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          // superagent.get('http://127.0.0.1:8000/api/print/order/18/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/18/?data=' + JSON.stringify(data_infop))
     }

     if (info.type == '费用订单') {
          console.log(11)
          let goodsdata = JSON.parse(data.chargelist)
          console.log(goodsdata)
          var str = '注:1、钢瓶按国家规定定期检测，请按期缴纳检测费。' +
               '2、办理退钢瓶押金时，须凭押金发票原件、服务卡（IC卡  对应登记钢瓶。' +
               '3、押金方式，钢瓶租金按月（或按年）结算,换气时缴纳。' +
               '用户须知:每次换气时,请核对本公司发送到钢瓶号是否与单据上相符，不符有权拒绝换气。'
          var goodsdatastr = ''

          for (let i = 0; i < goodsdata.length; i++) {
               goodsdatastr += goodsdata[i].project + 'X' + goodsdata[i].num + '小计' + goodsdata[i].total + '元,'
          }
          console.log(str)
          var jsonp = {
               title: "费用单据",
               time: data.topinfo,
               memberid: "卡号 " + data.memberid,
               name: "姓名 " + data.name,
               tel: "电话 " + data.telephone,
               address: "单位  " + data.workplace,
               department: data.department,
               Memo2: '费用明细',
               Memo1: goodsdatastr + ' 合计收款' + data.total + '元;(收现' + data.pay_cash + '元)' + '配送员: ' + data.deliveryman,
               Memo3: '收款员:' + data.operator,
               Memo4: '用户签名:_______________________________',
               Memo5: str,
               allinfo: ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/4/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/4/?data=' + JSON.stringify(data_infop))
     }

     if (info.type == '办理退包装物物资业务' && loginuser.login_department != '运输公司') {
          data.zcode = '  办理方式:' + data.content.mode + '-' + data.content.name + ',数量' + data.content.num
          var jsonp = {
               title: "南宁三燃液化气有限公司退抵押物物资单",
               time: data.topinfo,
               memberid: "卡号 " + data.memberid,
               name: "姓名 " + data.name,
               tel: "电话 " + data.telephone,
               address: "地址 " + data.address.replace('#','井'),
               department: data.department,
               Memo1: '空瓶号:' + data.other + data.zcode.replace(/\u0000/g, ""),
               Memo2: '注，本单据自填制日起两个月内有效。',
               Memo3: '经办人: ' + data.operator,
               Memo4: '',
               Memo5: '',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/5/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/5/?data=' + JSON.stringify(data_infop))
     }



     if (info.type == '办理退包装物押金业务' && loginuser.login_department != '发卡室') {

          var jsonp = {
               title: "南宁三燃液化气有限公司退抵押物退款单",
               time: data.topinfo,
               memberid: "卡号 " + data.memberid,
               name: "姓名 " + data.name,
               tel: "电话 " + data.telephone,
               address: "地址 " + data.address.replace('#','井'),
               department: data.department,
               Memo1: '退' + data.content.name + '数量:' + data.content.num,
               Memo2: '合计退款: ' + data.pay_cash,
               Memo4: '操作员: ' + data.operator,
               Memo5: '用户签名:',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/6/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/6/?data=' + JSON.stringify(data_infop))
     }


     if (info.type == '办理退包装物押金业务' && loginuser.login_department == '发卡室') {

          var jsonp = {
               Memo1: "南宁三燃燃气有限责任公司退款单",
               Memo2: data.topinfo,
               Memo4: "卡号 " + data.memberid,
               Memo5: "姓名 " + data.name,
               Memo6: "电话 " + data.telephone,
               Memo7: "部门 发卡室",
               Memo8: '退' + data.content.name + '数量:' + data.content.num + '  合计退款: ' + data.pay_cash,
               Memo9: "",
               Memo10: "用户签名:",
               Memo11: '',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/20/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/20/?data=' + JSON.stringify(data_infop))
     }


     if (info.type == '办理普通充值业务') {
          var jsonp = {
               title: '南宁三燃液化气有限公司会员充值订单',
               time: data.topinfo,
               memberid: '卡号 ' + data.memberid,
               name: '姓名 ' + data.name,
               Memo1: '原存款:' + (parseFloat(data.balance) - parseFloat(data.pay_cash)).toFixed(2),
               Memo2: '充值:' + parseFloat(data.pay_cash).toFixed(2),
               Memo3: '账户余额:' + parseFloat(data.balance).toFixed(2),
               Memo4: '操作员: ' + data.operator,
               Memo5: '用户签名:',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/7/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/7/?data=' + JSON.stringify(data_infop))
     }


     if (info.type == '办理余额退款业务') {
          var jsonp = {
               title: '南宁三燃液化气有限公司会员退预存款订单',
               time: data.topinfo,
               memberid: '卡号 ' + data.memberid,
               name: '姓名 ' + data.name,
               Memo1: '原存款:' + (parseFloat(data.balance) + parseFloat(data.pay_cash)).toFixed(2),
               Memo2: '退款:' + parseFloat(data.pay_cash).toFixed(2),
               Memo3: '账户余额:' + parseFloat(data.balance).toFixed(2),
               Memo4: '操作员: ' + data.operator,
               Memo5: '用户签名:',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/7/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/7/?data=' + JSON.stringify(data_infop))
     }

     if (info.type == '办理收购包装物业务') {

          var jsonp = {
               title: "南宁三燃液化气有限公司收购钢瓶单",
               time: data.topinfo,
               memberid: "来源 用户",
               name: data.department + "办理",
               Memo1: '',
               Memo2: '',
               Memo3: data.goods,
               Memo4: '收购价格: ' + data.pay_cash + "元",
               Memo5: '营业员: ' + data.operator,
               Memo6: '配送员签字:',
               Memo7: '用户签字:',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          // superagent.get('http://127.0.0.1:8000/api/print/order/9/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/9/?data=' + JSON.stringify(data_infop))
     }


     if (info.type == '办理收购包装物业务' && loginuser.login_department == '运输公司') {

          var jsonp = {
               title: "南宁三燃液化气有限公司收购钢瓶单",
               time: data.topinfo,
               memberid: "来源 用户",
               name: data.department + "办理",
               Memo1: '',
               Memo2: '',
               Memo3: data.goods,
               Memo4: '收购价格: ' + data.pay_cash + "元",
               Memo5: '营业员: ' + data.operator,
               Memo6: '司机签字:',
               Memo7: '钢瓶管理部签字:',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          // superagent.get('http://127.0.0.1:8000/api/print/order/9/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/9/?data=' + JSON.stringify(data_infop))
          return false

     }


     if (info.type == '部门上门服务业务' && loginuser.login_department == '客服中心') {

          var jsonp = {
               Memo1: "三燃公司安检安装回执单",
               Memo2: data.topinfo,
               Memo3: "服务人员:" + data.serviceope,
               Memo4: "卡号:" + data.memberid,
               Memo5: "单位:" + data.workplace,
               Memo6: "业务:" + data.servicetype,
               Memo7: "业务员:" + data.salesman,
               Memo8: "备注:" + data.remarks,
               Memo9: "业务员电话:" + data.salesmantelephone,
               Memo10: "地址:" + data.address.replace('#','井'),
               Memo11: "电话:" + data.telephone,
               Memo12: "用户意见:1，满意 2，一般 3，差",
               Memo13: "用户签字:",
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/17/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/17/?data=' + JSON.stringify(data_infop))
     }


     if (info.type == '部门上门服务业务' && loginuser.login_department != '客服中心' && loginuser.login_department != '运输公司') {
          // console.log(data.address.replace('/', ""))
          try {
               let codes = JSON.parse(data.codes) || []
               var jsonp = {
                    title: "南宁三燃液化气有限公司门店业务",
                    time: data.topinfo,
                    Memo1: '姓名:' + data.name,
                    Memo2: data.telephone,
                    Memo3: '会员号: ' + data.memberid,
                    Memo4: '地址: ' + data.address.replace(/#/g, "井"),
                    Memo5: data.remarks + '空瓶号:' + codes.map(item => item.code).join(','),
                    Memo6: '处理人:' + data.serviceope,
                    Memo7: '用户签字:',
                    Memo8: data.department,
                    allinfo: data.recordinfo ? data.recordinfo : ''
               }
               var data_infop = {
                    PrintData: jsonp,
                    Print: true
               }
               console.log(data_infop)

               openAndCloseURL('http://127.0.0.1:8000/api/print/order/10/?data=' + JSON.stringify(data_infop))
          } catch (e) {

               var jsonp = {
                    title: "南宁三燃液化气有限公司门店业务",
                    time: data.topinfo,
                    Memo1: '姓名:' + data.name,
                    Memo2: data.telephone,
                    Memo3: '会员号: ' + data.memberid,
                    Memo4: '地址: ' + data.address.replace(/#/g, "井"),
                    Memo5: data.remarks,
                    Memo6: '处理人:' + data.serviceope,
                    Memo7: '用户签字:',
                    Memo8: data.department,
                    allinfo: data.recordinfo ? data.recordinfo : ''
               }
               var data_infop = {
                    PrintData: jsonp,
                    Print: true
               }
               console.log(data_infop)

               openAndCloseURL('http://127.0.0.1:8000/api/print/order/10/?data=' + JSON.stringify(data_infop))
          }

     }


     if (info.type == '部门上门服务业务' && loginuser.login_department == '运输公司') {
          console.log(data)
          var jsonp = {
               title: "南宁三燃液化气有限公司门店业务",
               time: data.topinfo,
               Memo1: '姓名:' + data.name,
               Memo2: data.telephone,
               Memo3: '会员号: ' + data.memberid,
               Memo4: '地址: ' + data.address.replace('#','井'),
               Memo5: data.remarks,
               Memo6: '司机:' + data.serviceope,
               Memo7: '用户签字:',
               Memo8: data.department,
               Memo9: '单位: ' + data.workplace,
               Memo10: '业务员: ' + data.salesman,
               Memo11: '业务员电话: ' + data.salesmantelephone,
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }

          openAndCloseURL('http://127.0.0.1:8000/api/print/order/ys10/?data=' + JSON.stringify(data_infop))
          return false
     }


     if (info.type == '预约销售订单(工业气)') {
          let goodsdata = data.goodslist;
          let str = ''

          for (let i = 0; i < goodsdata.length; i++) {
               str += '规格:' + goodsdata[i].goodsname + '   数量:' + goodsdata[i].num + '     '
          }

          if (parseFloat(data.pay_coupon) > 0) {
               str += '(使用优惠券)' + parseFloat(data.pay_coupon) + '元'
          }

          // let orderinfo = data.orderinfo ? JSON.parse(data.orderinfo) : '';
          var json = {
               Memo1: '司机:    ' + data.deliveryman,
               Memo2: '付款方式（' + (parseFloat(data.pay_arrears) > 0 ? '月结' : '现金/微信') + '）',
               Memo3: parseFloat(data.pay_weixin) > 0 ? '微信付款' + parseFloat(data.pay_weixin) : '',
               Memo4: '运输公司 NO:' + data.printserial,
               Memo5: '南宁三燃液化气有限公司IC卡送气单（大户气，请及时送气）-预',
               Memo6: '日期:' + data.appointmenttime.substr(0, 10),
               Memo7: '送气时间:' + data.appointmenttime.substr(11, 5),
               Memo8: '卡号:' + data.memberid,
               Memo9: '姓名:' + data.name,
               Memo10: '电话:' + data.telephone,
               Memo11: '打印时间:' + moment().format('HH:mm'),
               Memo13: str,
               Memo12: '地址:' + data.address.replace('#','井'),

               Memo16: goodsdata[0].price ? ('气价:' + (parseFloat(goodsdata[0].price)).toFixed(2) + (goodsdata[0].residual_air_price ? ('单价:' + goodsdata[0].residual_air_price) : '')) : '',
               Memo18: data.pay_arrears ? ('扣卡:' + (parseFloat(data.pay_balance) + parseFloat(data.pay_arrears)).toFixed(2)) : '',
               Memo19: data.pay_cash ? ('应收金额:' + parseFloat(data.pay_cash).toFixed(2)) : '',
               Memo20: '单位:' + data.workplace,
               Memo21: data.printshowbalance == '是' ? ('卡剩余额:' + parseFloat(data.balance).toFixed(2)) : '',
               Memo22: '回空数量:',
               Memo23: '退重数量:',
               Memo24: '备注:' + data.remarks,

               Memo25: '移动支付:________',
               Memo26: '   实收现金:__________',
               Memo27: '',
               Memo28: '评价:□ 满意  □ 不满意',

               Memo30: '复核:',
               Memo31: '操作员' + data.operator,
               Memo32: '工业气:' + data.salesman,
               Memo33: data.salesmantelephone,
               Memo34: '',
               Memo35: '客户安装',
               Memo36: '',
               Memo37: '配送员安装:本次安装重瓶数为________瓶，已进行试漏，无漏气。',
               Memo38: '用户签字:_________________',
               Memo39: '',
               Memo40: '出厂重瓶（kg）',
               Memo41: '回空瓶（kg）',
               Memo42: '瓶号',
               Memo43: '钢瓶自重',
               Memo44: '发出重量',
               Memo45: '司机安装（√）',
               Memo46: '客户安装（√）',
               Memo47: '瓶号',
               Memo48: '钢瓶自重',
               Memo49: '发出重量',
               Memo50: '余气量',
               Memo51: '',
               Memo52: '',
               Memo53: '',
               Memo54: '',
               Memo55: '',
               Memo56: '',
               Memo57: '',
               Memo58: '',
               Memo59: '',

          };

          if (goodsdata[0].num == 1) {

               for (let i = 60; i < 69; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] += '      《南宁市瓶装气用户入户安全检查通知书》' +
                    '尊敬的客户:' +
                    '经现场检查，我们慎重地通知您，您家存在下列检查项目中第_____项不符合安全用气的规定，为了您和家人的生命财产安全，请务必重视，立即整改。1、钢瓶安装位置不合格或违规使用钢瓶。（倒置、倾斜、卧倒；存放在密封的厨柜内；离炉具净距离小于0.5米；离其它火源或热源太近；钢瓶放卫生间）2、减压阀口的密封胶圈老化、破损、漏气。3、胶管不合格。（使用期超过2年，老化开裂、破损，长度超过2米，穿墙使用，贴近炉口，使用非燃气专用胶管）4、胶管与减压阀、灶具连接处未加喉码固定。5、灶具不合格。（无熄火保护装置，破损、老化、打不着火，不能正常使用，使用超过8年）6、瓶装气、管道气混合使用。7.建议安装燃气泄漏报警装置。特别说明:1、本次提出的安全用气指导，是检查人员依据当时现场检查的情况做出的判断，敬请用户严格按照《城市燃气安全使用手册》正确使用燃气，避免事故发生。2、以上隐患限5日内完成整改'
               json['Memo15'] = '钢瓶结冰'
               json['Memo17'] = ''
               json['Memo29'] = '不出气,气压不足'
               json['Memo61'] = '换别用瓶'
               json['Memo63'] = '无备用瓶'
               json['Memo65'] = '正常'
               json['Memo67'] = '其他原因:______________________________________________________'
               var data_info = {
                    PrintData: json,
                    Print: true
               };

               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 1 && goodsdata[0].num <= 5) {

               for (let i = 60; i < 106; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''

               json['Memo92'] = '      《南宁市瓶装气用户入户安全检查通知书》' +
                    '尊敬的客户:' +
                    '经现场检查，我们慎重地通知您，您家存在下列检查项目中第_____项不符合安全用气的规定，为了您和家人的生命财产安全，请务必重视，立即整改。1、钢瓶安装位置不合格或违规使用钢瓶。（倒置、倾斜、卧倒；存放在密封的厨柜内；离炉具净距离小于0.5米；离其它火源或热源太近；钢瓶放卫生间）2、减压阀口的密封胶圈老化、破损、漏气。3、胶管不合格。（使用期超过2年，老化开裂、破损，长度超过2米，穿墙使用，贴近炉口，使用非燃气专用胶管）4、胶管与减压阀、灶具连接处未加喉码固定。5、灶具不合格。（无熄火保护装置，破损、老化、打不着火，不能正常使用，使用超过8年）6、瓶装气、管道气混合使用。7.建议安装燃气泄漏报警装置。特别说明:1、本次提出的安全用气指导，是检查人员依据当时现场检查的情况做出的判断，敬请用户严格按照《城市燃气安全使用手册》正确使用燃气，避免事故发生。2、以上隐患限5日内完成整改'

               json['Memo93'] = '钢瓶结冰'

               json['Memo95'] = '不出气,气压不足'
               json['Memo97'] = '换别用瓶'
               json['Memo98'] = '无备用瓶'
               json['Memo99'] = '正常'
               json['Memo101'] = '其他原因:______________________________________________________'
               var data_info = {
                    PrintData: json,
                    Print: true
               };

               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_5/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 5 && goodsdata[0].num <= 10) {

               for (let i = 60; i < 148; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               json['Memo34'] = '                                                                 南宁市瓶装气用户入户安全检查通知书' +
                    '尊敬的客户:' +
                    '经现场检查，我们慎重地通知您，您家存在下列检查项目中第_____项不符合安全用气的规定，为了您和家人的生命财产安全，请务必生重视，立即整改。' +
                    '1、钢瓶安装位置不合格或违规使用钢瓶。（倒置、倾斜、卧倒；存放在密封的厨柜内；离炉具净距离小于0.5米；离其它火源或热源太近；钢瓶放卫生间）' +
                    '2、减压阀口的密封胶圈老化、破损、漏气。' +
                    '3、胶管不合格。（使用期超过2年，老化开裂、破损，长度超过2米，穿墙使用，贴近炉口，使用非燃气专用胶管）' +
                    '4、胶管与减压阀、灶具连接处未加喉码固定。' +
                    '5、灶具不合格。（无熄火保护装置，破损、老化、打不着火，不能正常使用，使用超过8年）' +
                    '6、瓶装气、管道气混合使用。7、建议安装燃气泄漏报警装置。' +
                    '特别说明:' +
                    '1、本次提出的安全用气指导，是检查人员依据当时现场检查的情况做出的判断，敬请用户严格按照《城市燃气安全使用手册》正确使用燃气，避免事故发生。' +
                    '2、以上隐患限5日内完成整改。:'
               var data_info = {
                    PrintData: json,
                    Print: true
               };

               console.log('data_info',data_info)

               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_10/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 10 && goodsdata[0].num <= 20) {

               for (let i = 60; i < 247; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };

               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_20/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 20 && goodsdata[0].num <= 30) {

               for (let i = 60; i < 337; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };



               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_30/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 30 && goodsdata[0].num <= 40) {

               for (let i = 60; i < 427; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };


               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_40/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 40 && goodsdata[0].num <= 50) {


               for (let i = 60; i < 517; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };



               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_50/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 50) {


               for (let i = 60; i < 607; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };

               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_60/?data=' + JSON.stringify(data_info))
          }

     }


     if (info.type == '预约销售订单(拓展)' && data.department == '运输公司') {
          var str = '';
          console.log(data)
          var goods = data.goodslist


          var jsonp = {
               Memo2: "发货单据",
               Memo1: data.topinfo,
               Memo11: "收货人:  " + data.name,
               Memo12: data.memberid + '   ' + data.name + '     ' + data.telephone,
               Memo13: '司机:' + data.deliveryman,
               Memo14: '拉瓶:',
               Memo15: '规格',
               Memo16: '重瓶发货数',
               Memo17: '重瓶实收数',
               Memo18: '总金额',
               Memo19: '空瓶实收数',
               Memo20: '退重数量',
               Memo21: '返重原因',
               Memo22: '返重实收数',
               Memo4: '',
               Memo5: '',
               Memo6: '',
               Memo7: '',
               Memo8: '',
               Memo10: '',
               Memo23: goods[0] ? goods[0].goodsname : '',
               Memo24: goods[0] ? goods[0].num : '',
               Memo25: '',
               Memo26: goods[0] ? goods[0].total : '',
               Memo27: '',
               Memo28: '',
               Memo29: '',
               Memo30: '',
               Memo31: goods[1] ? goods[1].goodsname : '',
               Memo32: goods[1] ? goods[1].num : '',
               Memo33: '',
               Memo34: goods[1] ? goods[1].total : '',
               Memo35: '',
               Memo36: '',
               Memo37: '',
               Memo38: '',
               Memo39: goods[2] ? goods[2].goodsname : '',
               Memo40: goods[2] ? goods[2].num : '',
               Memo41: '',
               Memo42: goods[2] ? goods[2].total : '',
               Memo43: '',
               Memo44: '',
               Memo45: '',
               Memo46: '',
               Memo47: '',
               Memo48: '气款:' + data.pay_cash,
               Memo49: '合计总金额:' + data.pay_cash,
               Memo50: '发货人:' + data.operator,
               Memo51: '收货人签名:',
               Memo52: '',
               Memo53: '用户备注:' + data.remarks,
               Memo54: data.salesman + '/' + data.salesmantelephone,
               Memo55: '打单时间:' + moment().format('YYYY-MM-DD HH:mm:ss'),
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }

          openAndCloseURL('http://127.0.0.1:8000/api/print/order/12/?data=' + JSON.stringify(data_infop))
          return false
     }


     if (info.type == '预约销售订单(拓展)' && data.department != '运输公司') {
          var str = '';

          var goods = data.goodslist


          var jsonp = {
               title: "商品直售单据",
               time: data.topinfo,
               Memo3: "会员号 " + data.memberid,
               Memo1: "姓名 " + data.name,
               Memo2: data.telephone,
               Memo8: data.department,
               Memo5: str,
               Memo4: data.remarks + (data.deliveryman ? ('配送员' + data.deliveryman) : ''),
               Memo6: '收款员:' + data.operator,
               Memo7: '用户签名:_______________________________',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }

          openAndCloseURL('http://127.0.0.1:8000/api/print/order/11/?data=' + JSON.stringify(data_infop))
     }

     if (info.type == '预约销售订单(液化气)' && loginuser.login_department == '运输公司') {

          let goodsdata = (data.goodslist);
          let str = ''

          for (let i = 0; i < goodsdata.length; i++) {
               str += '规格:' + goodsdata[i].goodsname + '   数量:' + goodsdata[i].num + '     '
          }

          if (parseFloat(data.pay_coupon) > 0) {
               str += '(使用优惠券)' + parseFloat(data.pay_coupon) + '元'
          }
          // let orderinfo = JSON.parse(data.orderinfo);
          var json = {
               Memo1: '司机:    ' + data.deliveryman,
               Memo2: '付款方式（' + (parseFloat(data.pay_arrears) > 0 ? '月结' : '现金/微信') + '）',
               Memo3: parseFloat(data.pay_weixin) > 0 ? '微信付款' + parseFloat(data.pay_weixin) : '',
               Memo4: '运输公司 NO:' + data.printserial,
               Memo5: '南宁三燃液化气有限公司IC卡送气单（大户气，请及时送气）-预',
               Memo6: '日期:' + data.appointmenttime.substr(0, 10),
               Memo7: '送气时间:' + data.appointmenttime.substr(11, 5),
               Memo8: '卡号:' + data.memberid,
               Memo9: '姓名:' + data.name,
               Memo10: '电话:' + data.telephone,
               Memo11: '打印时间' + moment().format('HH:mm'),
               Memo13: str,
               Memo12: '地址:' + data.address.replace(/#/g, ""),
               Memo16: goodsdata[0].price ? ('气价:' + (parseFloat(goodsdata[0].price)).toFixed(2) + (goodsdata[0].residual_air_price ? ('单价:' + goodsdata[0].residual_air_price) : '')) : '',
               Memo18: '扣卡:' + (parseFloat(data.pay_balance) + parseFloat(data.pay_arrears)).toFixed(2),
               Memo19: '应收金额:' + parseFloat(data.pay_cash).toFixed(2),
               Memo20: '单位:' + data.workplace,
               Memo21: data.printshowbalance == '是' ? ('卡剩余额:' + parseFloat(data.balance).toFixed(2)) : '',
               Memo22: '回空数量:',
               Memo23: '退重数量:',
               Memo24: '备注:' + (data.remarks.toString()).replace(/\\/g, ""),

               Memo25: '移动支付:________',
               Memo26: '   实收现金:__________',
               Memo27: '',
               Memo28: '评价:□ 满意  □ 不满意',

               Memo30: '复核:',
               Memo31: '操作员' + data.operator,
               Memo32: '商用气:' + data.salesman,
               Memo33: data.salesmantelephone,
               Memo34: '',
               Memo35: '客户安装',
               Memo36: '',
               Memo37: '配送员安装:本次安装重瓶数为________瓶，已进行试漏，无漏气。',
               Memo38: '用户签字:_________________',
               Memo39: '',
               Memo40: '出厂重瓶（kg）',
               Memo41: '回空瓶（kg）',
               Memo42: '瓶号',
               Memo43: '钢瓶自重',
               Memo44: '发出重量',
               Memo45: '司机安装（√）',
               Memo46: '客户安装（√）',
               Memo47: '瓶号',
               Memo48: '钢瓶自重',
               Memo49: '发出重量',
               Memo50: '余气量',
               Memo51: '',
               Memo52: '',
               Memo53: '',
               Memo54: '',
               Memo55: '',
               Memo56: '',
               Memo57: '',
               Memo58: '',
               Memo59: '',
          };


          if (goodsdata[0].num >= 1 && goodsdata[0].num <= 5) {
               let strs = ''
               for (let i = 0; i < goodsdata.length; i++) {
                    strs += goodsdata[i].goodsname + '   数量:' + goodsdata[i].num + '     '
               }

               if (parseFloat(data.pay_coupon) > 0) {
                    strs += '(使用优惠券)' + parseFloat(data.pay_coupon) + '元'
               }

               var jsons = {
                    Memo2: data.deliveryman,
                    Memo3: data.appointmenttime.substr(0, 10),
                    Memo4: data.memberid,
                    Memo5: data.operator,
                    Memo6: moment().format('HH:mm'),
                    Memo1: data.name,
                    Memo7: data.telephone,
                    Memo8: (parseFloat(data.pay_arrears) > 0 ? '月结' : '现金/微信'),
                    Memo9: strs,
                    Memo10: data.address.replace(/#/g, ""),
                    Memo11: (data.remarks.toString()).replace(/\\/g, ""),
                    Memo12: data.workplace,
                    Memo13: (parseFloat(goodsdata[0].price)).toFixed(2),
                    Memo14: (goodsdata[0].residual_air_price ? (goodsdata[0].residual_air_price) : ''),
                    Memo15: parseFloat(data.pay_cash).toFixed(2),
                    Memo16: (parseFloat(data.pay_balance) + parseFloat(data.pay_arrears)).toFixed(2),
                    Memo17: data.printshowbalance == '是' ? (parseFloat(data.balance).toFixed(2)) : '',
                    Memo18: data.salesman + '  ' + data.salesmantelephone,

               }

               var data_info = {
                    PrintData: jsons,
                    Print: true
               };
               console.log(data_info)
               openAndCloseURL('http://127.0.0.1:8000/api/print/order/99/?data=' + JSON.stringify(data_info))
          }

          if (goodsdata[0].num > 5 && goodsdata[0].num <= 10) {

               for (let i = 60; i < 148; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''

               json['Memo34'] = '                                                                 南宁市瓶装气用户入户安全检查通知书' +
                    '尊敬的客户:' +
                    '经现场检查，我们慎重地通知您，您家存在下列检查项目中第_____项不符合安全用气的规定，为了您和家人的生命财产安全，请务必生重视，立即整改。' +
                    '1、钢瓶安装位置不合格或违规使用钢瓶。（倒置、倾斜、卧倒；存放在密封的厨柜内；离炉具净距离小于0.5米；离其它火源或热源太近；钢瓶放卫生间）' +
                    '2、减压阀口的密封胶圈老化、破损、漏气。' +
                    '3、胶管不合格。（使用期超过2年，老化开裂、破损，长度超过2米，穿墙使用，贴近炉口，使用非燃气专用胶管）' +
                    '4、胶管与减压阀、灶具连接处未加喉码固定。' +
                    '5、灶具不合格。（无熄火保护装置，破损、老化、打不着火，不能正常使用，使用超过8年）' +
                    '6、瓶装气、管道气混合使用。7、建议安装燃气泄漏报警装置。' +
                    '特别说明:' +
                    '1、本次提出的安全用气指导，是检查人员依据当时现场检查的情况做出的判断，敬请用户严格按照《城市燃气安全使用手册》正确使用燃气，避免事故发生。' +
                    '2、以上隐患限5日内完成整改。:'
               var data_info = {
                    PrintData: json,
                    Print: true
               };
               console.log(data_info)


               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_10/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 10 && goodsdata[0].num <= 20) {

               for (let i = 60; i < 247; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };


               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_20/?data=' + JSON.stringify(data_info))

          }
          if (goodsdata[0].num > 20 && goodsdata[0].num <= 30) {

               for (let i = 60; i < 337; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };

               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_30/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 30 && goodsdata[0].num <= 40) {

               for (let i = 60; i < 427; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };


               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_40/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 40 && goodsdata[0].num <= 50) {


               for (let i = 60; i < 517; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };


               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_50/?data=' + JSON.stringify(data_info))
          }
          if (goodsdata[0].num > 50) {


               for (let i = 60; i < 607; i++) {
                    json[('Memo' + i)] = ''
               }
               json['Memo14'] = ''
               json['Memo15'] = ''
               json['Memo17'] = ''
               json['Memo29'] = ''
               var data_info = {
                    PrintData: json,
                    Print: true
               };


               openAndCloseURL('http://127.0.0.1:8000/api/print/order/14_60/?data=' + JSON.stringify(data_info))
          }

     }


     if (info.type == '商品直售订单') {
          var str = '';

          var goods = (data.content)


          for (let i = 0; i < goods.length; i++) {
               str += goods[i].goodsname + '                       ' + goods[i].num + '      ' + goods[i].total + '\r\n'
          }

          var remarks = data.remarks
          if (data.pay_balance) {
               remarks += ',余额支付:' + data.pay_balance + '元'
          }

          if (data.pay_cash) {
               remarks += ',现金支付:' + data.pay_cash + '元'
          }

          var jsonp = {
               title: "南宁三燃液化气有限公司商品直售单据",
               time: data.topinfo,
               Memo3: "会员号 " + data.memberid,
               Memo1: "姓名 " + data.name,
               Memo2: data.telephone,
               Memo8: data.department,
               Memo5: str,
               Memo4: remarks + (data.deliveryman ? ('配送员' + data.deliveryman) : ''),
               Memo6: '收款员:' + data.operator,
               Memo7: '用户签名:_______________________________',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }

          openAndCloseURL('http://127.0.0.1:8000/api/print/order/11/?data=' + JSON.stringify(data_infop))
     }


     if (info.type == '钢瓶调拨发货单据') {
          let goods = JSON.parse(data.dispatchinfo)
          var jsonp = {
               Memo2: "南宁三燃液化气有限公司钢瓶收发货单据",
               Memo1: data.topinfo,
               Memo4: '发货地:   ' + data.handledepartment,
               Memo5: '收货地:   ' + data.department,
               Memo6: '司机:   ' + data.deliveryman,
               Memo7: ' ',
               Memo27: goods[0] ? goods[0].goodsname : '',
               Memo28: goods[1] ? goods[1].goodsname : '',
               Memo29: goods[2] ? goods[2].goodsname : '',
               Memo30: goods[0] ? goods[0].confirm_num : '',
               Memo31: goods[1] ? goods[1].confirm_num : '',
               Memo32: goods[2] ? goods[2].confirm_num : '',
               Memo69: '重瓶发货人:' + data.operator,
               Memo74: '打印时间:' + moment().format('YYYY-MM-DD HH:mm:ss'),
               Memo8: '铅封编号',
               Memo9: '出厂（后门）',
               Memo10: '（边门）',
               Memo11: '门店（后门）',
               Memo12: '（边门）',
               Memo13: '规格',
               Memo17: '重瓶发货',
               Memo21: '本年原',
               Memo14: '本年检',
               Memo15: '混装',
               Memo16: '重瓶实收',
               Memo18: '本司空',
               Memo19: '非本司空',
               Memo20: '收购',
               Memo22: '补差',
               Memo23: '带瓶',
               Memo24: '其他',
               Memo25: '返空总数',
               Memo26: '退重数量',
               Memo33: '',
               Memo34: '',
               Memo35: '',
               Memo36: '',
               Memo37: '',
               Memo38: '',
               Memo39: '',
               Memo40: '',
               Memo41: '',
               Memo42: '',
               Memo43: '',
               Memo44: '',
               Memo45: '',
               Memo46: '',
               Memo47: '',
               Memo48: '',
               Memo49: '',
               Memo50: '',
               Memo51: '',
               Memo52: '',
               Memo53: '',
               Memo54: '',
               Memo55: '',
               Memo56: '',
               Memo57: '',
               Memo58: '',
               Memo59: '',
               Memo60: '',
               Memo61: '',
               Memo62: '',
               Memo63: '',
               Memo64: '',
               Memo65: '',
               Memo66: '',
               Memo67: '',
               Memo68: '',
               Memo70: '    重瓶收货人:',
               Memo71: '   返空发货人:',
               Memo72: '   返空收货人:',
               Memo73: '',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }

          openAndCloseURL('http://127.0.0.1:8000/api/print/order/13/?data=' + JSON.stringify(data_infop))

     }

     if (info.type == '办理商品捆绑销售方案业务') {

          let goodsdata = (data.content.detailed)

          var jsonp = {
               title: "三燃商品混搭方案办理单",
               time: data.topinfo.substring(0,13) + ' 办理套餐' + data.GSMname + 'X' + data.num,
               memberid: "卡号 " + data.memberid,
               name: "姓名 " + data.name,
               tel: "电话 " + data.telephone,
               address: "地址 " + data.address.replace('#','井'),
               department: data.department,
               type1: '规格1',
               type2: '规格2',
               type3: '规格3',
               band1: goodsdata[0] ? goodsdata[0]['goodsname'] : '',
               band2: goodsdata[1] ? goodsdata[1]['goodsname'] : '',
               band3: goodsdata[2] ? goodsdata[2]['goodsname'] : '',
               num1: goodsdata[0] ? '数量' + goodsdata[0]['num'] * data.num : '',
               num2: goodsdata[1] ? '数量' + goodsdata[1]['num'] * data.num : '',
               num3: goodsdata[2] ? '数量' + goodsdata[2]['num'] * data.num : '',
               price1: goodsdata[0] ? '单价 ' + parseFloat((goodsdata[0]['price'])).toFixed(2) : '',
               price2: goodsdata[1] ? '单价 ' + parseFloat((goodsdata[1]['price'])).toFixed(2) : '',
               price3: goodsdata[2] ? '单价 ' + parseFloat((goodsdata[2]['price'])).toFixed(2) : '',
               jfcate: "",
               residualindex: '',
               yck: "预存款",
               price: (data.balance),
               cash: "合计收现 " + parseFloat(data.pay_cash).toFixed(2),
               // 判断 data.deliveryman 是否存在
               delivery: data.deliveryman ? "配送员:" + data.deliveryman : '',
               // delivery: "配送员:" + data.deliveryman !== undefined ? data.deliveryman : '',
               operator: "操作员:" + data.operator,
               tsinfo: "温馨提示:1，桶装水开封后建议两周内饮用完为宜\n" +
                    "2，饮水机2-6个月应清洗消毒一次（可有偿上门服务）",
               Memo18: "戴一次性手套安装",
               Memo19: "使用镊子安装",
               Memo20: "用户意见",
               Memo21: "【】是  【】 否",
               Memo22: "【】是  【】 否",
               Memo23: "【】满意【】 一般【】差",
               Memo24: "用户签字",
               Memo12: "---------------------------------------------------------------------------",
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          console.log(data_infop)
          // superagent.get('http://127.0.0.1:8000/api/print/order/3/?data=' + JSON.stringify(data_infop)).set('Content-Type', 'application/json')
          //      .set('Accept', 'application/json , text/plain, */*').end((err, res) => {
          //           // Calling the end function will send the request
          //           console.log(res);
          //      });
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/3/?data=' + JSON.stringify(data_infop))
     }

     if (info.type == '办理退商品库存业务') {
          let str = ''
          for (let i = 0; i < data.content.length; i++) {
               const element = data.content[i];
               str += element.goodsname + '   ' + element.num + '   ' + parseFloat(element.price).toFixed(2) + '\r\n'
          }
          var jsonp = {
               title: '南宁三燃液化气有限公司会员退指标订单',
               time: data.topinfo,
               memberid: '卡号 ' + data.memberid,
               name: '姓名 ' + data.name,
               Memo1: '退指标款:' + parseFloat(data.pay_cash),
               Memo2: str,
               Memo3: '账户余额:' + parseFloat(data.balance),
               Memo4: '操作员: ' + data.operator,
               Memo5: '用户签名:',
               allinfo: data.recordinfo ? data.recordinfo : ''
          }
          var data_infop = {
               PrintData: jsonp,
               Print: true
          }
          // axios.get('http://127.0.0.1:8000/api/print/order/8/?data=' + JSON.stringify(data_infop)).then(rew => {
          //      console.log(rew)
          // })
          console.log(data_infop)
          openAndCloseURL('http://127.0.0.1:8000/api/print/order/8/?data=' + JSON.stringify(data_infop))
     }
}