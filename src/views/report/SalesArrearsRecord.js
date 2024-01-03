import React, {useCallback, useRef, useState} from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import translations from '../../utils/translations.json'
import { AgGridReact } from "ag-grid-react";

const SalesArrearsRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))
    const [list, setList] = useState([])
    const [xzlist, setxzlist] = useState([])
    const [show, setShow] = useState(false)
    const [record, setRecord] = useState(false)
    const api = useRef(null);
    const gridRef = useRef(null);

    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        // console.log(selectedRows);
        setxzlist(selectedRows)
    }, []);


    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>销售欠款记录</Typography>
            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.SalesArrearsRecord',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    department: JSON.stringify(e.department),
                    goodsids: JSON.stringify(e.goodsids),
                    salesman: JSON.stringify(e.salesman),
                    memberids: e.memberids != null ? JSON.stringify([e.memberids]) : '',
                })

                setxzlist([])
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                {
                    (loginuser.login_department == '运输公司' || loginuser.login_department.includes('商用')) &&
                    <>
                        <Form.Select field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                            {

                                (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.login_department.includes('商用')) ?

                                    initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                                    :
                                    <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                            }

                        </Form.Select>

                        <Form.Select field='attributiondepartment' maxTagCount={1} multiple label="用户归属部门" style={{ width: 200 }}>
                            {
                                initData.DepartmentList.filter(item => item.name.includes('商用')).map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                            }

                        </Form.Select>
                        <Form.Select field='salesman' maxTagCount={1} filter multiple label="维护业务员" style={{ width: 200 }}>
                            {
                                initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>
                    </>

                }


                <Form.Select field='settlementmethod' rules={[{
                    required: true,
                }]} label="欠款方式" style={{ width: 200 }}>
                    <Form.Select.Option value="月结">月结</Form.Select.Option>
                    <Form.Select.Option value="现结">现结</Form.Select.Option>
                </Form.Select>

                <Form.Select rules={[{
                    required: true,
                }]} field='type' label="属性" style={{ width: 200 }}>
                    <Form.Select.Option value="全部">全部</Form.Select.Option>
                    <Form.Select.Option value="已回款">已回款</Form.Select.Option>
                    <Form.Select.Option value="未回款">未回款</Form.Select.Option>
                </Form.Select>

                <Form.Input field='begintime' type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='memberids' type="text" label="会员号" style={{ width: 200 }} />

                {/* <Form.Select field='goodsids' maxTagCount={1} multiple label="商品" style={{ width: 200 }}>
                    {
                        initData.GoodsList.filter(item => item.canuse === true).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select> */}


                <Form.TreeSelect field='goodsids' leafOnly maxTagCount={1} multiple label="商品" style={{ width: 300 }} treeData={new_goodslist} />


                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>
            {
                xzlist.length ? <Box display={'flex'}  sx={{mt:2}} alignItems={'center'}>


                    <Button variant="outlined" size="small" onClick={async () => {

                        Modal.confirm({
                            title: '确认批量汇总',
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
                                            residualgastreatment: '退现金',
                                            remarks: ''
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            // setShow(false);
                                            // setRecord({});
                                            // console.log('回款成功');
                                            // api.current.submitForm();
                                        } else {
                                            alert(rew.msg);

                                        }
                                    }, 500 * i)
                                    if (i == xzlist.length - 1) {
                                        alert('批量回款成功');
                                        api.current.submitForm();
                                        setxzlist([])
                                        // 取消选择
                                        gridRef.current.api.deselectAll();
                                    }
                                }

                            }
                        })

                    }} >批量汇总</Button>
                    <Box ml={2} fontSize={18} color={'black'}>共{xzlist.length}条,合计: {
                        xzlist.reduce((a, b) => {
                            let sum = 0
                            if (b.payment == '月结支付') {
                                sum =  (parseFloat(b.pay_arrears) - parseFloat(b.residual_air_total)).toFixed(2);
                            } else {
                                sum =  (parseFloat(b.pay_cash) - parseFloat(b.residual_air_total)).toFixed(2);
                            }


                            return a + parseFloat(sum)
                        }, 0).toFixed(2)

                    }</Box>
                </Box>:""
            }
            <Box mt={3} overflow="scroll" height="60vh">

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    ref={gridRef}
                    localeText={translations}
                    //多选
                    rowSelection="multiple"
                    columnDefs={[
                        { headerName: "订单号", field: "serial", hide: true },
                        { headerName: "送达时间", field: "addtime",checkboxSelection: true ,
                            headerCheckboxSelection: true, width: 130, valueGetter: ({ data }) => moment(data.addtime).format('YYYY-MM-DD') },
                        { headerName: "属性", field: "attribute", hide: true },

                        { headerName: "商品名称", field: "goodsname" },
                        { headerName: "市场价", field: "marketprice", hide: true },
                        { headerName: "销售价", field: "price" },
                        { headerName: "数量", field: "num" },
                        { headerName: "总价", field: "total" },
                        { headerName: "欠款方式", field: "payment" },
                        { headerName: "欠款单号", field: "iouid", hide: true },
                        { headerName: "月结支付", field: "pay_arrears" , hide: true },
                        { headerName: "现金支付", field: "pay_cash", hide: true  },
                        { headerName: "余额支付", field: "pay_balance", hide: true },
                        { headerName: "在线支付", field: "pay_online", hide: true },
                        { headerName: "库存支付", field: "pay_stock", hide: true },
                        { headerName: "专项款支付", field: "pay_cashgift", hide: true },
                        { headerName: "优惠券支付", field: "pay_coupon" , hide: true },
                        { headerName: "会员号", field: "memberid" },
                        { headerName: "用户名称", field: "username" , hide: true },
                        { headerName: "用户单位", field: "workplace" },
                        { headerName: "省", field: "province", hide: true },
                        { headerName: "市", field: "city", hide: true },
                        { headerName: "区", field: "area", hide: true },
                        { headerName: "街道", field: "town", hide: true },
                        { headerName: "详细地址", field: "address", hide: true  },
                        { headerName: "归属部门", field: "attributiondepartment" },
                        { headerName: "客户类型", field: "customertype" },
                        { headerName: "业务员", field: "salesman" },
                        { headerName: "开发业务员", field: "developsalesman", hide: true },
                        { headerName: "部门", field: "department",  },
                        { headerName: "配送员", field: "deliveryman",  },
                        { headerName: "余气单价", field: "residual_air_price" },
                        { headerName: "余气重量", field: "residual_air_weight" },
                        { headerName: "余气合计", field: "residual_air_total" },
                        { headerName: "回款日期", field: "collection_date" },
                        { headerName: "回款部门", field: "collection_department" },
                        { headerName: "回款人", field: "collection_ope" },
                        { headerName: "回款单号", field: "collection_serial" },
                        {
                            headerName: "操作",
                            pinned: 'left',
                            width: 80,
                            // 如果 params.data.collection_serial != '' 则不显示按钮
                            cellRendererFramework: (params) =>
                                params.data.collection_serial === '' && <Button variant="text" size="small" onClick={async () => {
                                    console.log(params);

                                    setShow(true);
                                    setRecord(params.data);


                                }}>确认回款</Button>
                        },
                        {
                            headerName: "实欠金额",
                            pinned: 'left',
                            valueGetter: ({ data }) => {
                                if (data.payment == '月结支付') {
                                    return (parseFloat(data.pay_arrears) - parseFloat(data.residual_air_total)).toFixed(2);
                                }
                                return (parseFloat(data.pay_cash) - parseFloat(data.residual_air_total)).toFixed(2);
                            }
                        }

                    ]}
                    onSelectionChanged={onSelectionChanged}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                        width: 100,

                    }}
                />
                {/* 展示回款弹窗 */}
                <Modal visible={show} onCancel={() => setShow(false)} title="确认回款" footer={<></>} style={{ top: '10%' }}>
                    <Form onSubmit={async e => {


                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_BusinessProcessing_Handle.ConfirmSaleOrderRecord',
                            id: record.id,
                            serial: record.serial,
                            userid: record.userid,
                            residualgastreatment: e.residualgastreatment,
                            remarks: e.remarks
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            setShow(false);
                            setRecord({});
                            alert('回款成功');
                            api.current.submitForm();
                        } else {
                            alert(rew.msg);

                        }
                    }}>
                        <Form.Select field='residualgastreatment' initValue={'退现金'} label="余气款处理" style={{ width: 200 }}>
                            {/* <Form.Select.Option value="存入用户帐户">存入用户帐户</Form.Select.Option> */}
                            <Form.Select.Option value="退现金">退现金</Form.Select.Option>
                        </Form.Select>
                        <Form.Input field='remarks' label="备注" style={{ width: 200 }} />
                        <Button type="submit" variant="contained" size="small" >确认回款</Button>
                    </Form>
                </Modal>
            </Box>
        </Box>
    );
};

export default SalesArrearsRecord;
