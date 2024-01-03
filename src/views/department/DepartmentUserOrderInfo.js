import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Popconfirm, Modal as MModal } from "@douyinfe/semi-ui";
import { Button, Modal } from "@mui/material";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import translations from '../../utils/translations.json'
import { set } from 'react-hook-form';

const DepartmentUserOrderInfo = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [formdata, setformdata] = useState();
    const [rowdata, setrowdata] = useState();
    const [rowdata2, setrowdata2] = useState();
    const [changedata, setchangedata] = useState();
    const [open, setopen] = useState(false);
    const [bind, setbind] = useState(false);
    const [open2, setopen2] = useState(false);
    const [remarksmsg, setremarks] = useState('');
    const remarksdata = useRef('');

    const [list, setList] = useState([])
    const [list2, setList2] = useState([])
    // const getlist = async () => {
    //     const rew = await request('post','/api/getInfo',{
    //         url: 'Srapp.Web_Order_Infos.OrderList',
    //         ...formdata,
    //         distributionstore: JSON.stringify(formdata.distributionstore),
    //         department: JSON.stringify(formdata.department),
    //         state: JSON.stringify(formdata.state),
    //     })
    //     setList(rew.data)
    //     // console.log(rew);
    // }
    const api = useRef();
    return (
        <Box p={3} bgcolor="#fff" borderRadius={1}>
            <Box fontSize={18} fontWeight="bold" mb={3}>订单监控</Box>
            <Form getFormApi={e => api.current = e} layout='horizontal' labelPosition='inset' onSubmit={async e => {

                let parans = {
                    url: 'Srapp.Web_Order_Infos.OrderList',
                    ...e,
                    distributionstore: JSON.stringify(e.distributionstore),
                    department: JSON.stringify(e.department),
                    state: JSON.stringify(e.state),
                }

                if (e.conditions) {
                    parans = {
                        url: 'Srapp.Web_Order_Infos.OrderList',
                        department: JSON.stringify(e.department),
                        state: JSON.stringify(e.state),
                        begintime: e.begintime,
                        endtime: e.endtime,
                        conditions: e.conditions
                    }
                }

                const rew = await request('post', '/api/getInfo', parans)
                setList(rew.data)
            }}>

                {
                    (loginuser.login_department === '预约中心' || loginuser.login_department === '信息中心' || loginuser.login_department === '运营监督') ?

                        <Form.Select label="预约部门" multiple maxTagCount={2} filter field='department' style={{ width: 350 }}>
                            {
                                initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            }
                            <Form.Select.Option value="未知">未知</Form.Select.Option>
                        </Form.Select> : ''

                }


                {
                    (loginuser.login_department === '预约中心' || loginuser.login_department === '信息中心' || loginuser.login_department === '运营监督') ?

                        <Form.Select label="配送部门 " multiple maxTagCount={2} filter field='distributionstore' style={{ width: 350 }}>
                            {
                                initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            }
                            <Form.Select.Option value="未知">未知</Form.Select.Option>
                        </Form.Select>
                        :
                        <Form.Select label="配送部门 " multiple maxTagCount={2} initValue={[loginuser.login_department]} field='distributionstore' style={{ width: 350 }}>

                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>)

                        </Form.Select>
                }



                <Form.Input type='date' initValue={moment().format('YYYY-MM-DD')} field='begintime' label='开始时间' />
                <Form.Input type='date' field='endtime' label='结束时间' initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select label="订单状态" initValue={['正常', '已安排', '已接单', '已送达', '已收瓶', '取消']} multiple maxTagCount={2} field='state' style={{ width: 350 }}>
                    <Form.Select.Option value="正常">正常</Form.Select.Option>
                    <Form.Select.Option value="已安排">已安排</Form.Select.Option>
                    <Form.Select.Option value="已接单">已接单</Form.Select.Option>
                    <Form.Select.Option value="已送达">已送达</Form.Select.Option>
                    <Form.Select.Option value="已收瓶">已收瓶</Form.Select.Option>
                    <Form.Select.Option value="取消">取消</Form.Select.Option>
                </Form.Select>

                <Button type='submit' variant={"outlined"} size={"small"}>搜索</Button>
                <Button sx={{ ml: 1 }} type='button' onClick={() => {
                    api.current.setValue('conditions', JSON.stringify(
                        { operator: [loginuser.name] }
                    ))
                    // api.current.setValue('conditions', '')
                    // api.current.setValue('distributionstore', [])
                    api.current.submitForm()
                    setTimeout(() => {
                        api.current.setValue('conditions', '')

                    }, 1000)


                }} variant={"outlined"} size={"small"}>本人预约</Button>

                {
                    (loginuser.login_department === '预约中心' || loginuser.login_department === '信息中心' || loginuser.login_department === '运营监督') &&
                    <>


                        <Button sx={{ ml: 1 }} type='button' onClick={() => {
                            api.current.setValue('distributionstore', initData.DepartmentList.map(item => item.name))
                        }} variant={"outlined"} size={"small"}>部门全选</Button>
                    </>

                }
                {
                    (loginuser.login_department === '信息中心' && list.length > 0) &&
                    <Button sx={{ ml: 1 }} type='button' onClick={() => {
                        // 撤销子订单，仅用于 配送员接单方式安排，且状态为已安排，线上支付方式
                        const arr = list.filter(item => {
                            if (item.suborder[0].state === '已安排' && parseFloat(item.suborder[0].pay_online) > 0 && item.suborder[0].distributionmode == '配送员接单') {
                                return true
                            }
                            return false
                        })
                        setList([...arr])
                    }} variant={"outlined"} size={"small"}>信息中心可取消订单</Button>
                }
            </Form>

            <MModal size="large" title="绑定SNS信息" visible={bind} onCancel={() => setbind(false)} footer={<></>}>
                <Form getFormApi={e => api.current = e} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_Infos.VagueQueryUserInfo',
                        ...e,
                        // row: 1
                    })
                    // setUserInfo({
                    //     telephone: e.keyword,
                    // })
                    setList2(rew.data)
                    console.log(e)
                }} labelPosition="inset" layout='horizontal'>
                    <Form.Select field='keytype' initValue={'电话'} label="查询范围" style={{ width: 300 }}>
                        <Form.Select.Option value="会员号">会员号</Form.Select.Option>
                        <Form.Select.Option value="姓名">姓名</Form.Select.Option>
                        <Form.Select.Option value="电话">电话</Form.Select.Option>
                        <Form.Select.Option value="地址">地址</Form.Select.Option>
                        <Form.Select.Option value="单位">单位</Form.Select.Option>
                    </Form.Select>
                    <Form.Input field="keyword" initValue={rowdata?.telephone} label="关键字" style={{ width: 300 }} />
                    <Button type="submit" variant="outlined" size="small">搜索</Button>
                </Form>


                <Box height={'60vh'} mt={2} overflow={'scroll'}>
                    <AgGridReact
                        className='ag-theme-balham'
                        rowData={list2}
                        onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                        columnDefs={[
                            { field: 'memberid', headerName: '会员号', },
                            { field: 'name', headerName: '姓名', },
                            { field: 'telephone', headerName: '电话', },
                            { field: 'address', headerName: '地址', },
                            { field: 'workplace', headerName: '单位', },
                            {
                                headerName: '绑定', cellRendererFramework: ({ data }) => {
                                    if (data.memberid) {
                                        return <Button onClick={async () => {
                                            console.log(rowdata)
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_User_EditInfo.SNSuserOrderBindingUserInfoOfWeb',
                                                serial: rowdata.serial_main,
                                                userid: data.userid,
                                            })

                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('绑定成功')

                                                setbind(false)
                                                api.current.submitForm()
                                            } else {
                                                toast.error('绑定失败' + rew.data.tips)
                                            }
                                        }} >绑定</Button>
                                    }
                                    return <></>
                                }

                            },
                        ]}
                    />
                </Box>
            </MModal>
            <Box height='60vh' mt={3} overflow='auto'>
                <AgGridReact

                    className='ag-theme-balham'
                    rowData={list}
                    // onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    getRowStyle={params => {
                        if (params.data && params.data.suborder[0].state === '已安排') {
                            return { color: "red" }
                        }
                        if (params.data && params.data.suborder[0].state === '已送达') {
                            return { color: "blue" }
                        }

                        if (params.data && params.data.suborder[0].state === '已接单') {
                            return { color: "orange" }
                        }

                        if (params.data && params.data.suborder[0].state === '取消') {
                            return { color: "pink" }
                        }
                        return { color: "black" }
                    }}

                    columnDefs={[
                        { headerName: '添加时间', field: 'addtime', cellRenderer: 'agGroupCellRenderer',width: 145 },
                        { field: 'appointmenttime', headerName: '上门时间',width: 135 },
                        { headerName: '商品', valueGetter: ({ data }) => data.suborder.map(item => `${item.goodsname} X ${item.num}`) },

                        { headerName: '会员号', field: 'memberid',width: 120 },

                        { headerName: '姓名', field: 'name',width: 80 },
                        { headerName: '电话', field: 'telephone' ,width: 120 },
                        { headerName: '地址', field: 'address' },
                        { headerName: '楼层', field: 'floor',width: 40  },
                        { headerName: '预约部门', field: 'distributionstore',width: 80  },
                        { headerName: '来源', field: 'source' ,width: 50},
                        { headerName: '预约人', field: 'booking_operator',width: 80 },
                        { headerName: '订单备注', field: 'remarks',width: 100 },
                        { headerName: '订单部门', valueGetter: ({ data }) => data.suborder[0].department },
                        {

                            headerName: '操作',
                            pinned: 'left',
                            width: 200,
                            cellRendererFramework: ({ data }) => <Box>
                                <Button size={"small"} onClick={() => {

                                    if (data.department == '未知' && data.memberid == '') {
                                        toast.error('未绑定卡号无法转单')
                                        return false
                                    }
                                    console.log(data);
                                    setrowdata(data)
                                    setopen(true)
                                }}  >更新订单信息</Button>

                                {
                                    data.memberid == '' &&
                                    <Button size={"small"} onClick={() => {


                                        console.log(data);
                                        setrowdata(data)
                                        setbind(true)
                                    }}>绑定SNS</Button>
                                }
                            </Box>
                        }
                    ]}
                    localeText={translations}
                    masterDetail="true"
                    // embedFullWidthRows="true"
                    // detailRowAutoHeight="true"
                    // detailRowHeight={800}
                    detailCellRendererParams={{
                        detailGridOptions: {
                            localeText: { translations },

                            columnDefs: [
                                { field: 'goodsname', headerName: '商品名称', width: 200 },
                                { field: 'num', headerName: '数量', width: 200 },
                                { field: 'price', headerName: '单价', width: 200 },
                                { field: 'deliveryman', headerName: '配送员', width: 200 },
                                { field: 'deliveryman_opeid', headerName: '配送员工号', width: 200 },


                                { field: 'pay_cash', headerName: '现金', width: 200 },
                                { field: 'pay_online', headerName: '在线支付', width: 200 },
                                { field: 'pay_coupon', headerName: '优惠券', width: 200 },
                                { field: 'pay_cashgift', headerName: '专项款', width: 200 },
                                { field: 'pay_balance', headerName: '余额', width: 200 },
                                { field: 'pay_arrears', headerName: '月结支付', width: 200 },
                                { field: 'pay_stock', headerName: '库存提货', width: 200 },
                                { field: 'ope_remarks', headerName: '内部备注', width: 200 },
                                { field: 'remarks', headerName: '临时备注', width: 200 },
                                { field: 'operator', headerName: '安排人', width: 200 },
                                { field: 'arrangetime', headerName: '安排时间', width: 200 },
                                { field: 'cancel_time', headerName: '取消时间', width: 200 },
                                { field: 'cancel_department', headerName: '取消部门', width: 200 },
                                { field: 'cancel_operator', headerName: '取消人', width: 200 },
                                { field: 'cancel_remarks', headerName: '取消原因', width: 200 },


                                { field: 'state', headerName: '状态', width: 200 },
                                {

                                    headerName: '操作',
                                    pinned: 'left',
                                    width: 200,
                                    cellRendererFramework: ({ data }) => <Box>

                                        {
                                            (data.state == '已送达' && parseFloat(data.pay_cash) > 0) &&
                                            <Button size={"small"} onClick={() => {
                                                // console.log(data)
                                                setopen2(true)
                                                setrowdata2(data)
                                            }}>核销</Button>
                                        }

                                        <Popconfirm style={{ width: 300 }} title="提示"


                                                    content={
                                                        <Box>
                                                            <Form onChange={e => {
                                                                // console.log(e.values.remarks)
                                                                // setremarks(e.values.remarks)
                                                                remarksdata.current = e.values.remarks
                                                            }}>
                                                                <Form.Input rules={[{required: true}]} field='remarks' label="取消原因" />
                                                            </Form>

                                                        </Box>
                                                    }
                                                    // content='确认取消？'



                                                    onConfirm={async () => {

                                                        // return false
                                                        const rew = await request('post', '/api/getInfo', {
                                                            url: 'Srapp.Web_Order_Handle.CancelUserOrder',
                                                            ids: JSON.stringify([data.id]),
                                                            remarks: `操作员${loginuser.name}取消 原因${remarksdata.current}`
                                                        })
                                                        if (rew.data.msg === 'SUCCESS') {
                                                            toast.success('取消成功')
                                                            // 修改子订单状态取消
                                                            // data.state = '取消'
                                                            // list.forEach((item,index) => {
                                                            //     if(item.id === data.id){
                                                            //         list[index] = data
                                                            //     }
                                                            // })
                                                        } else {
                                                            toast.error(`操作失败 ${rew.data.tips}`)
                                                        }
                                                    }}>
                                            <Button size="small">取消</Button>
                                        </Popconfirm>
                                        <Button onClick={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_Order_Infos.OrderChangeRecord',
                                                serial: data.serial
                                            })
                                            const list = rew.data
                                                // [
                                                // {
                                                //     "addtime": "2023-09-18 08:59:10.770",
                                                //     "memberid": "842193",
                                                //     "info": "更改配送部门：心圩店=>运输公司,更改预约时间：2023-09-18 08:35:00.000=>2023-09-18 08:35:00,更改备注：45KG过磅气相全天候客户=>45KG过磅气相全天候客户,",
                                                //     "department": "心圩店",
                                                //     "operator": "黄坚"
                                                // },
                                                //     {
                                                //         "addtime": "2023-09-18 09:08:28.017",
                                                //         "memberid": "842193",
                                                //         "info": "更改配送部门：运输公司=>鹧鸪店,更改预约时间：2023-09-18 08:35:00.000=>2023-09-18 08:35:00,更改备注：45KG过磅气相全天候客户=>45KG过磅气相全天候客户,",
                                                //         "department": "运输公司",
                                                //         "operator": "黄小崇"
                                                //     }
                                                // ]
                                            if (!list.length) {
                                                toast.info('暂无转单记录')
                                                return false
                                            }

                                            MModal.info({
                                                title: '转单记录',
                                                content: <Box>
                                                    {
                                                        list.map(item => <Box sx={{ border:  '1px solid #666',p:1, mb:1}} fontSize={15}>
                                                            <Box mb={1}>时间: {item.addtime}</Box>
                                                            <Box mb={1}>会员号: {item.memberid}</Box>
                                                            <Box mb={1}>{item.info}</Box>
                                                            <Box mb={1}>转单部门: {item.department}</Box>
                                                            <Box mb={1}>操作员: {item.operator}</Box>
                                                        </Box>)
                                                    }
                                                </Box>

                                            })
                                        }} size="small">转单记录</Button>
                                        {
                                            (data.state == '已安排' && parseFloat(data.pay_online) > 0 && loginuser.login_department == '信息中心' && data.distributionmode == '配送员接单') &&



                                            <Button size={"small"} onClick={async () => {
                                                // console.log(data)
                                                // setopen2(true)
                                                // setrowdata2(data)
                                                MModal.confirm({
                                                    title: '确认取消?',
                                                    onOk: async () => {
                                                        const rew = await request('post', '/api/getInfo', {
                                                            url: 'Srapp.Web_Order_Handle.RevokeSubOrder',
                                                            ids: JSON.stringify([data.id]),
                                                            remarks: '信息中心撤销'
                                                        })
                                                        if (rew.data.msg == 'SUCCESS') {
                                                            alert('取消成功')
                                                        }
                                                        // alert('123')
                                                    }
                                                })
                                            }}>取消(信息中心)</Button>
                                        }

                                    </Box>
                                }
                            ],
                            defaultColDef: {
                                flex: 1,
                                resizable: true
                            },
                        },
                        getDetailRowData: (params) => {
                            // console.log(gridRef)
                            params.successCallback(params.data.suborder);
                        },

                    }}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                />
            </Box>

            <Modal open={open2} onClose={() => { setopen2(false) }}>
                <Box p={3} bgcolor='#FFF' borderRadius={1} width="50vw" left="25vw" top="10%" position="fixed">
                    <Form initValues={{
                        id: open2 ? rowdata2.id : '',
                        serial: open2 ? rowdata2.serial : ''
                    }} onSubmit={async e => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Other_Handle.WriteOffCommodityVoucher',
                            ...e,
                            codes: JSON.stringify(e.codes)
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('成功')
                        } else {
                            toast.error(rew.data.tips)
                        }
                        setopen2(false)
                        setrowdata2('')
                    }}>
                        <Form.TagInput field={'codes'} label={'实物抵扣单号码 '} />
                        <Button type={"submit"} variant={"contained"}>确认核销</Button>
                    </Form>
                </Box>
            </Modal>


            <Modal open={open} onClose={() => { setopen(false) }}>
                <Box p={3} bgcolor='#FFF' borderRadius={1} width="50vw" left="25vw" top="10%" position="fixed">
                    <Form onChange={e => setchangedata(e.values)}>
                        <Form.CheckboxGroup field='id' label="订单">
                            {
                                rowdata?.suborder.map(item => <Form.Checkbox disabled={item.state == '取消'} value={item.id.toString()}>{item.goodsname} x {item.num}</Form.Checkbox>)
                            }

                        </Form.CheckboxGroup>
                        {
                            rowdata?.suborder[0].state == '正常' && <Form.Select filter initValue={rowdata?.suborder[0].department} field="distributionstore" label="配送部门" zIndex={9999999} style={{ width: '100%' }}>
                                {
                                    initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                                }

                            </Form.Select>
                        }


                        <Form.DatePicker format="yyyy-MM-dd HH:mm:ss" presets={[
                            {
                                text: '此刻',
                                start: moment().format('YYYY-MM-DD HH:mm:ss'),
                                end: moment().format('YYYY-MM-DD HH:mm:ss'),
                            },
                        ]} style={{ width: '100%' }} field='appointmenttime' zIndex={9999999999} type="dateTime" label='预约上门时间' initValue={rowdata?.appointmenttime} />


                        <Form.Input field='remarks' initValue={rowdata?.remarks} label="订单备注" />
                        <Form.Input field='floor' initValue={rowdata?.floor} label="楼层" />


                        <Popconfirm zIndex={9999999} content='确认操作？' title='提示' onConfirm={async () => {

                            if (!changedata.id) {
                                toast.error('请选择订单')
                                return false
                            }

                            for (let i = 0; i < changedata.id.length; i += 1) {
                                let rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Order_Handle.ChangeOrderInfo',
                                    ...changedata,
                                    appointmenttime: moment(changedata.appointmenttime).format('YYYY-MM-DD HH:mm:ss'),
                                    id: changedata.id[i]
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('修改成功')
                                } else {
                                    toast.error('修改失败' + rew.data.tips)
                                }
                            }


                            setopen(false)
                            // getlist(formdata)
                            api.current.submitForm()
                        }}>
                            <Button>确认修改</Button>
                        </Popconfirm>



                    </Form>
                </Box>
            </Modal>
        </Box>
    );
};

export default DepartmentUserOrderInfo;
