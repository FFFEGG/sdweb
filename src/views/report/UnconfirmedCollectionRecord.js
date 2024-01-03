import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { Popconfirm } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import translations from '../../utils/translations.json'
import TableFooter from 'views/comments/TableFooter';

const UnconfirmedCollectionRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [open, setopen] = useState(false)

    const [maindata, setmaindata] = useState(false)
    const [residualgastreatment, setresidualgastreatment] = useState('退现金')
    const [remarks, setremarks] = useState('')
    const api = useRef();

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
    };
    const [xzlist, setxzlist] = useState([])


    const gridapi = useRef();
    const tkapi = useRef(null);
    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridapi.current.api.getSelectedRows();
        // console.log(selectedRows);
        setxzlist(selectedRows)
    }, []);
    const [isWater, setIsWater] = useState(false)
    useEffect(()=>{
        //找到登录门店的父级门店
        const parentDepartment = initData.DepartmentList.find(item => item.name == loginuser.login_department)
        console.log('parentDepartment',parentDepartment)
        if (parentDepartment.fid == 24) {
            setIsWater(true)
        } else {
            setIsWater(false)
        }
    },[])

    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>未确认回款记录(不含月结欠款\现结欠款)</Typography>
            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.UnconfirmedCollectionRecord',
                    ...e,
                    department: JSON.stringify(e.department),
                    endtime: moment(e.endtime).format('YYYY-MM-DD HH:mm'),
                    deliveryman: JSON.stringify(e.deliveryman),
                })
                let arr = rew.data.info
                arr.map(item => {
                    if (item.inandout == '支') {
                        item.price = -item.price
                        item.pay_cash = -item.pay_cash
                        item.total = -item.total
                    }
                    return item
                })
                // arr新增一行合计 
                // { headerName: '时间', field: 'addtime' },
                //         { headerName: '商品', field: 'goodsname' },
                //         { headerName: '会员号', field: 'memberid' },
                //         { headerName: '市场价格', field: 'marketprice' },
                //         { headerName: '数量', field: 'num' },
                //         { headerName: '交易现金', field: 'pay_cash' },
                //         { headerName: '收支', field: 'inandout' },
                //         { headerName: '操作员', field: 'operator' },
                //         { headerName: '单价', field: 'price' },
                //         { headerName: '部门', field: 'department' },
                //         { headerName: '配送员', field: 'deliveryman' },
                //         { headerName: '来源', field: 'source' },

                //         { headerName: '合计', field: 'total' },

                //         { headerName: '余气重量', field: 'residual_air_weight', },
                //         { headerName: '余气单价', field: 'residual_air_price', },
                //         { headerName: '余气合计', field: 'residual_air_total', },
                arr.push({
                    addtime: '合计',
                    // marketprice: arr.reduce((a, b) => a + Number(b.marketprice), 0),
                    num: arr.reduce((a, b) => a + Number(b.num), 0),
                    pay_cash: arr.reduce((a, b) => a + Number(b.pay_cash), 0).toFixed(2),
                    //price: arr.reduce((a, b) => a + Number(b.price), 0),
                    total: arr.reduce((a, b) => a + Number(b.total), 0).toFixed(2),
                    residual_air_weight: arr.reduce((a, b) => a + Number(b.residual_air_weight), 0).toFixed(3),
                    residual_air_price: arr.reduce((a, b) => a + Number(b.residual_air_price), 0).toFixed(2),
                    residual_air_total: arr.reduce((a, b) => {
                        if (b.inandout == '收' && (parseFloat(b.pay_cash) - parseFloat(b.residual_air_total) < 0)) {
                            return a
                        }
                        return a + Number(b.residual_air_total)
                    }, 0).toFixed(2)
                })





                setxzlist([])

                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset" onChange={e => {
                let keywords = e.values?.keywords
                gridapi.current.api.setQuickFilter(keywords)
            }}>
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>


                <Form.Input field='begintime' type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="datetime-local" label="结束时间" initValue={moment().format('YYYY-MM-DD HH:mm')} style={{ width: 300 }} />
                <Form.Select field='deliveryman' label="配送员" multiple filter style={{ width: 200 }}>
                    {
                        initData.OperatorList
                            //本门店员工排在前面
                            .sort((a, b) => {
                                // item.department == loginuser.login_department
                                if (a.department == loginuser.login_department) {
                                    return -1
                                }
                                return 1
                            })

                            .map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>
                {/* 回款状态 未确认回款 已确认回款 */}
                {/* <Form.Select field='status' label="回款状态" initValue="未确认回款" style={{ width: 200 }}>
                    <Form.Select.Option value="未确认回款">未确认回款</Form.Select.Option>
                    <Form.Select.Option value="已确认回款">已确认回款</Form.Select.Option>
                </Form.Select> */}
                <Form.Input field='keywords' noLabel placeholder="任意关键词搜索" />
                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>
            {
                xzlist.length ? <Box display={'flex'}  sx={{mt:2}} alignItems={'center'}>


                    <Button variant="outlined" size="small" onClick={async () => {

                        Modal.confirm({
                            title: '确认批量回款',
                            onOk: async () => {

                                //循环提交
                                for (let i = 0; i < xzlist.length; i++) {
                                    setTimeout(async () => {
                                        const item = xzlist[i];
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_BusinessProcessing_Handle.ConfirmSaleOrderRecord',
                                            id: item.id,
                                            serial: item.serial,
                                            userid: item.userid,
                                            residualgastreatment: item.inandout == '支' ? '退现金' : '存入用户帐户',
                                            remarks: `${loginuser.login_name} 批量确认回款 ${item.total}元`
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            // toast.success('操作成功')
                                        } else {
                                            toast.error(`操作失败 ${rew.data.tips}`)
                                        }
                                    }, 500 * i)
                                    if (i == xzlist.length - 1) {
                                        alert('批量回款成功');
                                        api.current.submitForm()
                                        setxzlist([])
                                        // 取消选择
                                        gridapi.current.api.deselectAll();
                                    }
                                }



                            }
                        })

                    }} >批量回款</Button>
                    <Box ml={2} fontSize={18} color={'black'}>共{xzlist.length}条,

                        {/*{ headerName: '实际应收', valueGetter: ({ data }) => (data.total - data.residual_air_total).toFixed(2), width: 100 },*/}
                        {/*{ headerName: '实际收现', valueGetter: ({ data }) => (data.pay_cash - data.residual_air_total).toFixed(2), width: 100 },*/}
                        实际应收:{xzlist.reduce((a, b) => a + parseFloat(b.total - b.residual_air_total), 0).toFixed(2)},
                        实际收现:{xzlist.reduce((a, b) => a + parseFloat(b.pay_cash - b.residual_air_total), 0).toFixed(2)}

                    </Box>
                </Box>:""
            }
            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    getRowStyle={params => {
                        if (params.data && params.data.inandout === '支') {
                            return { color: "red" }
                        }
                        return { color: "black" }
                    }}
                    localeText={translations}
                    ref={gridapi}
                    //多选
                    rowSelection="multiple"
                    isRowSelectable={data => data.data.addtime != '合计'}

                    onSelectionChanged={onSelectionChanged}
                    columnDefs={[

                        { headerName: '时间', field: 'addtime',checkboxSelection: true,
                            //全选
                            headerCheckboxSelection: true,
                        },
                        { headerName: '会员号', field: 'memberid' },
                        isWater?  { headerName: '地址', field: 'address' } :  { headerName: '单位', field: 'workplace' },
                        { headerName: '商品', field: 'goodsname' },

                        // { headerName: '市场价格', field: 'marketprice' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '单价', field: 'price' },
                        { headerName: '交易现金', field: 'pay_cash' },
                        { headerName: '合计', field: 'total' },
                        { headerName: '余气重量', field: 'residual_air_weight', valueGetter: ({ data }) => parseFloat(data.residual_air_weight).toFixed(3) },
                        { headerName: '余气单价', field: 'residual_air_price', },
                        { headerName: '余气合计', field: 'residual_air_total', valueGetter: ({ data }) => parseFloat(data.residual_air_total).toFixed(3) },
                        { headerName: '实际应收', valueGetter: ({ data }) => (data.total - data.residual_air_total).toFixed(2), width: 100 },
                        { headerName: '实际收现', valueGetter: ({ data }) => (data.pay_cash - data.residual_air_total).toFixed(2), width: 100 },


                        { headerName: '配送员', field: 'deliveryman' },
                        { headerName: '收支', field: 'inandout' },
                        { headerName: '操作员', field: 'operator' },

                        { headerName: '部门', field: 'department' },

                        // { headerName: '来源', field: 'source' },




                        {
                            headerName: '操作', pinned: 'left', width: '100', cellRendererFramework: ({ data }) =>

                                data.addtime != '合计' &&
                                <Button size="small" onClick={async () => {


                                    if (parseFloat(data.residual_air_weight) <= 0) {
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_BusinessProcessing_Handle.ConfirmSaleOrderRecord',
                                            id: data.id,
                                            serial: data.serial,
                                            userid: data.userid,
                                            residualgastreatment: data.inandout == '支' ? '退现金' : '存入用户帐户',
                                            remarks: `${loginuser.login_name} 确认回款 ${data.total}元`
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast.success('操作成功')
                                        } else {
                                            toast.error(`操作失败 ${rew.data.tips}`)
                                        }
                                        api.current.submitForm()
                                        return false
                                    }
                                    // setresidualgastreatment('存入用户帐户')
                                    setopen(true)
                                    setmaindata(data)
                                    console.log('订单', data)
                                    setTimeout(() => {


                                        if (parseFloat(data.pay_cash) <= 0) {
                                            // setresidualgastreatment('存入用户帐户')
                                            tkapi.current.setValue('residualgastreatment', '存入用户帐户')
                                        }
                                        if (parseFloat(data.pay_cash) > 0) {
                                            // setresidualgastreatment('退现金')
                                            tkapi.current.setValue('residualgastreatment', '退现金')
                                        }

                                    }, 300)

                                }}>确认回款</Button>
                            // :
                            // <Button size="small" onClick={() => {
                            //     setopen(true)
                            //     setmaindata(data)
                            // }}>批量确认回款</Button>


                        },
                    ]}


                    onGridReady={onGridReady}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                    }}
                />

            </Box>


            <Modal visible={open} onCancel={() => setopen(false)} onOk={async (e) => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_BusinessProcessing_Handle.ConfirmSaleOrderRecord',
                    id: maindata.id,
                    serial: maindata.serial,
                    userid: maindata.userid,
                    residualgastreatment,
                    remarks
                })
                if (rew.data.msg === 'SUCCESS') {
                    toast.success('操作成功')
                } else {
                    toast.error(`操作失败 ${rew.data.tips}`)
                }

                setopen(false)
                setmaindata('')
                setresidualgastreatment('')
                setremarks('')
                api.current.submitForm()
            }}>
                <Box fontSize={20} mb={3}>确认回款222？</Box>
                <Form getFormApi={e => tkapi.current = e} onChange={e => {
                    console.log('e', e)
                    setresidualgastreatment(e.values.residualgastreatment)
                    setremarks(e.values.remarks)
                }}>
                    <Form.Select style={{ width: '100%' }} label={'余气款操作'} field={'residualgastreatment'}>
                        <Form.Select.Option value={'存入用户帐户'}>存入用户帐户</Form.Select.Option>
                        <Form.Select.Option value={'退现金'}>退现金</Form.Select.Option>
                    </Form.Select>
                    {/* 备注 */}
                    <Form.Input style={{ width: '100%' }} label={'备注'} field={'remarks'} />
                    {/* <div>订单备注:{maindata.remarks}</div> */}

                </Form>
            </Modal>

        </Box >
    );
};

export default UnconfirmedCollectionRecord;
