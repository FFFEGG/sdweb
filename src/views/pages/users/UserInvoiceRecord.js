import {Form, Modal} from "@douyinfe/semi-ui";
import {Box, Button, Typography} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import moment from "moment";
import {useState} from "react";
import request from "utils/request";

const UserInvoiceRecord = ({userinfo}) => {
    const [list, setList] = useState([])
    return (
        <Box bgcolor="#fff">
            <Typography fontSize={15} mb={1}>用户发票记录</Typography>
            <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
                // url Srapp.Web_Invoice_Infos.UserInvoiceRecord
                // 获取用户发票记录信息

                // POST
                // 接口描述：

                // 接口参数
                // 参数名字	类型	是否必须	默认值	其他	说明
                // userid	整型	必须			USERID
                // begintime	日期	必须			起始时间
                // endtime	日期	必须			结束时间
                // row	整型	可选	0		单页行数
                // page	整型	可选	1		页码
                // token	字符串	必须			token
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Invoice_Infos.UserInvoiceRecord',
                    ...e,
                    userid: userinfo.userid
                })
                setList(rew.data)

            }}>
                {/* 开始时间 结束时间 确认按钮 */}
                <Form.Input field='begintime' initValue={'1991-01-01'} type="date" label="开始时间"
                            style={{width: 200}}/>
                <Form.Input field='endtime' initValue={moment().format('YYYY-MM-DD')} type="date" label="结束时间"
                            style={{width: 200}}/>
                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                {/* 表格 */}
                {/* "[#1 - 16.3ms - SQL]/www/wwwroot/suda-2-api/src/srapp/Domain/Invoice/Info.php(50):    Srapp\\Model\\Curd\\QueryAction::QueryTable()    user_invoice_record    SELECT id,addtime,serial,name,taxnumber,addresstelephone,bankaccount,contact,remarks,invoicecode,invoicenumber,total,updatetime,goodsdetails,isp,department,operator,state FROM user_invoice_record WHERE (companyid = '101') AND (userid = 144194) AND (addtime>=?) AND (addtime<?); -- '2000-01-01', '2023-07-25'" */}
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    columnDefs={[
                        {headerName: '发票号', field: 'invoicenumber'},
                        {headerName: '发票代码', field: 'invoicecode'},
                        {headerName: '发票金额', field: 'total'},
                        {headerName: '发票类型', field: 'isp'},
                        {headerName: '开票时间', field: 'addtime'},
                        {headerName: '开票人', field: 'operator'},
                        {headerName: '开票状态', field: 'state'},
                        {
                            headerName: '商品', field: 'goodsdetails', cellRendererFramework: ({data}) => {
                                if (data.goodsdetails) {
                                    const goodsdetails = JSON.parse(data.goodsdetails)
                                    return goodsdetails.map(item => {
                                        return <div>{item.goodsname}</div>
                                    })
                                } else {
                                    return <div></div>
                                }
                            }
                        },
                        {
                            headerName: '订单号', width: 330, field: 'goodsdetails', cellRendererFramework: ({data}) => {
                                if (data.goodsdetails) {
                                    // console.log('订单号',data.goodsdetails)

                                    let goodsdetails_arr = JSON.parse(data.goodsdetails)

                                    return goodsdetails_arr.map(item => {
                                        const str = item.goodsserials.toString()
                                        return <div>
                                            <span>{str.substr(0,6)}</span>
                                            <span style={{fontSize:30,color:'black'}}>{str.substr(6,6)}</span>
                                            <span>{str.substr(12)}</span>
                                        </div>
                                    })

                                } else {
                                    return <div></div>
                                }
                            }
                        },
                        {headerName: '开票状态', field: 'state'},
                        {
                            headerName: '操作',
                            cellRendererFramework: ({data}) => data.state == '已送达' && <>
                                <Button onClick={async () => {
                                    // isp	字符串	必须			发票提供商
                                    // invoicecode	字符串	必须			发票代码
                                    // invoicenumber	字符串	必须			发票号码
                                    // total	字符串	必须			价税合计
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Invoice_Handle.DownloadInvoice',
                                        isp: data.isp,
                                        invoicecode: data.invoicecode,
                                        invoicenumber: data.invoicenumber,
                                        total: data.total
                                    })
                                    if (rew.data.msg == 'SUCCESS') {
                                        window.open(rew.data.info, '_blank')
                                    }
                                }} size="small">下载</Button>

                                <Button onClick={async () => {
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Sns_Invoice_Infos.GetInvoiceInfo',
                                        snsuserid: userinfo.userid,
                                        id: data.id
                                    })
                                    if (rew.data.msg == 'SUCCESS') {
                                        Modal.info({
                                            title: '发票信息',
                                        // {
                                        //     "ddlsh": "1697614412",
                                        //     "status": 2,
                                        //     "_status": "开具成功",
                                        //     "fplxdm": "02",
                                        //     "_fplxdm": "数电普票",
                                        //     "xsfNsrsbh": "91450100MA5LBMG90Y",
                                        //     "xsfMc": "南宁三燃液化气有限公司",
                                        //     "xsfDzdh": "南宁市槎路268号~~0771-2835379",
                                        //     "xsfYhzh": "工行南宁市麻村支行~~2102112409300038265",
                                        //     "gmfNsrsbh": null,
                                        //     "gmfMc": "邓洪武（个人）",
                                        //     "gmfDzdh": "鲤湾路10-6号~~18172031964",
                                        //     "gmfYhzh": null,
                                        //     "gmfMobile": "18172031964",
                                        //     "gmfEmail": "1573553608@qq.com",
                                        //     "gmfDz": "鲤湾路10-6号",
                                        //     "gmfDh": "18172031964",
                                        //     "gmfYh": null,
                                        //     "gmfZh": null,
                                        //     "xsfDz": "南宁市槎路268号",
                                        //     "xsfDh": "0771-2835379",
                                        //     "xsfYh": "工行南宁市麻村支行",
                                        //     "xsfZh": "2102112409300038265",
                                        //     "fpdm": null,
                                        //     "fphm": null,
                                        //     "kprq": "20231019105815",
                                        //     "jshj": 125,
                                        //     "hjje": 110.62,
                                        //     "hjse": 14.38,
                                        //     "pdf": "https://dppt.guangxi.chinatax.gov.cn:8443/kpfw/fpjfzz/v1/exportDzfpwjEwm?Wjgs=PDF&Jym=8546&Fphm=23452000000013653160&Kprq=20231019105815&Czsj=1697684299595",
                                        //     "_zsfs": "普通征税",
                                        //     "qdfphm": "23452000000013653160",


                                        // }
                                            content: <div>
                                                <div>请求流水号: {rew.data.ddlsh}</div>
                                                <div>发票类型: {rew.data._fplxdm}</div>
                                                <div>发票代码: {rew.data.fpdm}</div>
                                                <div>发票号码: {rew.data.fphm}</div>
                                                <div>开票日期: {rew.data.kprq}</div>
                                                <div>价税合计: {rew.data.jshj}</div>
                                                <div>合计金额: {rew.data.hjje}</div>
                                                <div>合计税额: {rew.data.hjse}</div>
                                                <div>发票状态: {rew.data._status}</div>
                                                <div>购买方名称: {rew.data.gmfMc}</div>
                                                <div>购买方纳税人识别号: {rew.data.gmfNsrsbh}</div>
                                                <div>购买方地址电话: {rew.data.gmfDzdh}</div>
                                                <div>购买方银行账号: {rew.data.gmfYhzh}</div>
                                                <div>销售方名称: {rew.data.xsfMc}</div>
                                                <div>销售方纳税人识别号: {rew.data.xsfNsrsbh}</div>
                                                <div>销售方地址电话: {rew.data.xsfDzdh}</div>
                                                <div>销售方银行账号: {rew.data.xsfYhzh}</div>
                                                <div>pdf: {rew.data.pdf}</div>
                                            </div>

                                        })
                                    }
                                }} size="small">查看</Button>
                            </>
                        },
                    ]}

                />
            </Box>
        </Box>
    )

}

export default UserInvoiceRecord;