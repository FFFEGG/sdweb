import React, {useState, useRef, useCallback, useEffect} from 'react';
import { Box } from "@mui/system";
import { Button, TextField, Typography } from "@mui/material";
import { Form, Select, Popconfirm, TreeSelect } from '@douyinfe/semi-ui';
import request from "../../utils/request";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import translations from '../../utils/translations.json'
const AddDistributionSubsidyOfCompanyRecord = () => {

    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_arr_goods = JSON.parse(localStorage.getItem('new_goodslist'))
    const [list, setlist] = useState([])
    const api = useRef();
    const [serial, setserial] = useState([])
    const [formdata, setformdata] = useState({
        begintime: moment().format('YYYY-MM-DD'),
        endtime: moment().format('YYYY-MM-DD'),
        goodsids: ['2', '3'],
        deliveryman: [],
        attributiondepartment: [],
    })
    const getlist = async (url) => {


        const rew = await request('post', '/api/getInfo', {
            url,
            ...formdata,
            // begintime: formdata.begintime,
            // endtime: formdata.endtime,
            // goodsids: JSON.stringify([2,3,4])
            goodsids: JSON.stringify(formdata.goodsids),
            deliveryman: JSON.stringify(formdata.deliveryman),
            department: JSON.stringify([loginuser.login_department]),
            attributiondepartment: JSON.stringify(formdata.attributiondepartment),
            salesman: JSON.stringify(formdata.salesman),
        })
        setlist(rew.data)
        // console.log(rew);
    }
    useEffect(()=>{
        const arr = JSON.parse(localStorage.getItem('serial'))
        //判断是否存在
        if(arr){
            // api.current.setValue('serial',arr)
            setserial(arr)
        } else {
            localStorage.setItem('serial',JSON.stringify([]))
        }

    },[])

    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        console.log(selectedRows);
        // setInvoice(selectedRows)
        api.current.setValue('serial', selectedRows.map(item => item.serial))
    }, []);

    const gridRef = useRef();

    const [index, setindex] = useState(2)

    return (
        <Box p={3} borderRadius={3} bgcolor="#fff">
            <Button onClick={() => {
                setindex(2)
                setlist([])
            }} variant={index === 2 ? 'contained' : 'outlined'} >添加商品补贴记录</Button>

            <Button onClick={() => {
                setindex(1)
                setlist([])
            }} variant={index === 1 ? 'contained' : 'outlined'} style={{ marginLeft: 10 }}>获取商品补贴记录</Button>


            {
                index === 1 ?
                    <Box mt={3}>
                        <Box display="flex" flexWrap="wrap" mt={3}>
                            <TextField size="small" onChange={e => setformdata({
                                ...formdata,
                                begintime: e.target.value
                            })} value={formdata.begintime} type="date" label="开始时间" />
                            <TextField size="small" onChange={e => setformdata({
                                ...formdata,
                                endtime: e.target.value
                            })} value={formdata.endtime} type="date" label="结束时间" />
                            {/* <Select onChange={e => setformdata({
                                ...formdata,
                                goodsids: e
                            })} maxTagCount={1} value={formdata.goodsids} multiple
                                style={{ border: '1px solid #ccc', width: 150 }}>
                                <Select.Option value="">请选择商品</Select.Option>
                                {
                                    initData.GoodsList.filter(item => item.canuse === true).map(item => <Select.Option
                                        value={item.id}>{item.name}</Select.Option>)
                                }
                            </Select> */}
                            <TextField size="small" onChange={e => setformdata({
                                ...formdata,
                                memberid: e.target.value
                            })} value={formdata.memberid} label="会员号" placeholder='会员号' />
                            <TreeSelect onChange={e => setformdata({
                                ...formdata,
                                goodsids: e
                            })} style={{ border: '1px solid #ccc', width: 230 }} leafOnly filterTreeNode maxTagCount={1} placeholder='请选择商品' field="goodsids" multiple treeData={new_arr_goods} />

                            <Select onChange={e => setformdata({
                                ...formdata,
                                deliveryman: e
                            })} maxTagCount={1} value={formdata.deliveryman} multiple
                                style={{ border: '1px solid #ccc', width: 150 }}>
                                <Select.Option value="">请选择配送员</Select.Option>
                                {
                                    initData.OperatorList.filter(item => item.department === loginuser.login_department && item.quarters === '配送员').map(item =>
                                        <Select.Option value={item.name}>{item.name}</Select.Option>)
                                }
                            </Select>

                            <Select onChange={e => setformdata({
                                ...formdata,
                                attributiondepartment: e
                            })} maxTagCount={1} filter value={formdata.attributiondepartment} multiple
                                style={{ border: '1px solid #ccc', width: 150 }}>
                                <Select.Option value="">用户归属部门</Select.Option>
                                {
                                    initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Select.Option
                                        value={item.name}>{item.label}</Select.Option>)
                                }
                            </Select>

                            <Button
                                onClick={() => getlist('Srapp.Web_Other_Infos.GetDistributionSubsidyOfCompanyRecord')}
                                variant="contained">搜索记录信息</Button>
                        </Box>
                        <Box height="40vh" overflow="scroll" mt={3}>
                            <AgGridReact
                                rowStyle={e => {
                                    if (e.data.state == '取消') {
                                        return {
                                            color: 'pink'
                                        }
                                    }
                                    if (e.data.state == '已完成') {
                                        return {
                                            color: 'red'
                                        }
                                    }
                                }}
                                localeText={translations}
                                className="ag-theme-balham"
                                columnDefs={[
                                    {
                                        headerName: '添加时间', field: 'addtime',

                                    },
                                    { headerName: '部门', field: 'department' },
                                    { headerName: '补贴日期', field: 'date' },
                                    { headerName: '会员号', field: 'memberid' },
                                    { headerName: '商品', field: 'goodsname' },
                                    { headerName: '数量', field: 'num' },
                                    { headerName: '订单号', field: 'serial' },
                                    { headerName: '配送员', field: 'deliveryman' },
                                    { headerName: '工作单位', field: 'workplace' },
                                    { headerName: '地址', field: 'address' },
                                    { headerName: '业务员', field: 'salesman' },
                                    { headerName: '方式', field: 'mode' },
                                    { headerName: '合计', field: 'total' },
                                    { headerName: '类型', field: 'type' },
                                    { headerName: '状态', field: 'state' },
                                    {
                                        headerName: '操作', width: 150, pinned: 'right', cellRendererFramework: ({ data }) => {

                                            if (data?.state == '正常') {
                                                return <Box>
                                                    <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                                        const rew = await request('post', '/api/getInfo', {
                                                            url: 'Sra   pp.Web_Other_Handle.ConfirmationDistributionSubsidyOfCompanyRecord',
                                                            id: data.id
                                                        })
                                                        if (rew.data.msg === 'SUCCESS') {
                                                            toast.success('操作成功')
                                                        } else {
                                                            toast.error(`操作失败 ${rew.data.tips}`)
                                                        }
                                                    }}>
                                                        <Button size="small">确认</Button>
                                                    </Popconfirm>
                                                    <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                                        const rew = await request('post', '/api/getInfo', {
                                                            url: 'Srapp.Web_Other_Handle.CancelDistributionSubsidyOfCompanyRecord',
                                                            id: data.id
                                                        })
                                                        if (rew.data.msg === 'SUCCESS') {
                                                            toast.success('操作成功')
                                                        } else {
                                                            toast.error(`操作失败 ${rew.data.tips}`)
                                                        }
                                                    }}>
                                                        <Button size="small">取消</Button>
                                                    </Popconfirm>
                                                </Box>
                                            }

                                            if (data?.state == '已完成') {
                                                return <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                                    const rew = await request('post', '/api/getInfo', {
                                                        url: 'Srapp.Web_Other_Handle.CancelDistributionSubsidyOfCompanyRecord',
                                                        id: data.id
                                                    })
                                                    if (rew.data.msg === 'SUCCESS') {
                                                        toast.success('操作成功')
                                                    } else {
                                                        toast.error(`操作失败 ${rew.data.tips}`)
                                                    }
                                                }}>
                                                    <Button size="small">取消</Button>
                                                </Popconfirm>
                                            }
                                            return <></>

                                        }
                                    },
                                ]}
                                // onRowClicked={({data})=> {
                                //     console.log(data.serial)
                                //     api.current.setValue('serial',data.serial)
                                // }}

                                rowData={list}
                                defaultColDef={{
                                    resizable: true,
                                    sortable: true,
                                    filter: 'agTextColumnFilter',
                                    floatingFilter: true,

                                }}
                            />
                        </Box>
                    </Box>
                    :
                    <Box mt={3}>
                        <Box display="flex" flexWrap="wrap" mt={3}>
                            <TextField size="small" onChange={e => setformdata({
                                ...formdata,
                                begintime: e.target.value
                            })} value={formdata.begintime} type="date" label="开始时间" />
                            <TextField size="small" onChange={e => setformdata({
                                ...formdata,
                                endtime: e.target.value
                            })} value={formdata.endtime} type="date" label="结束时间" />
                            {/* <Select onChange={e => setformdata({
                                ...formdata,
                                goodsids: e
                            })} maxTagCount={1} value={formdata.goodsids} multiple
                                style={{ border: '1px solid #ccc', width: 150 }}>
                                <Select.Option value="">请选择商品</Select.Option>
                                {
                                    initData.GoodsList.filter(item => item.canuse === true).map(item => <Select.Option
                                        value={item.id}>{item.name}</Select.Option>)
                                }
                            </Select> */}

                            <TextField size="small" onChange={e => setformdata({
                                ...formdata,
                                memberid: e.target.value
                            })} value={formdata.memberid} label="会员号" placeholder='会员号' />

                            <TreeSelect onChange={e => setformdata({
                                ...formdata,
                                goodsids: e
                            })} style={{ border: '1px solid #ccc', width: 230 }} leafOnly filterTreeNode maxTagCount={1} placeholder='请选择商品' field="goodsids" multiple treeData={new_arr_goods} />


                            <Select onChange={e => setformdata({
                                ...formdata,
                                deliveryman: e
                            })} maxTagCount={1} value={formdata.deliveryman} multiple
                                style={{ border: '1px solid #ccc', width: 150 }}>
                                <Select.Option value="">请选择配送员</Select.Option>
                                {
                                    initData.OperatorList.filter(item => item.department === loginuser.login_department && item.quarters === '配送员').map(item =>
                                        <Select.Option value={item.name}>{item.name}</Select.Option>)
                                }
                            </Select>

                            <Select onChange={e => setformdata({
                                ...formdata,
                                attributiondepartment: e
                            })} maxTagCount={1} filter value={formdata.attributiondepartment} multiple
                                style={{ border: '1px solid #ccc', width: 150 }}>
                                <Select.Option value="">用户归属部门</Select.Option>
                                {
                                    initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Select.Option
                                        value={item.name}>{item.label}</Select.Option>)
                                }
                            </Select>

                            <Button
                                onClick={() => getlist('Srapp.Web_Other_Infos.GetNoDistributionSubsidyOfCompanyRecord')}
                                variant="contained">搜索记录信息</Button>
                        </Box>
                        <Box height="40vh" overflow="scroll" mt={3}>
                            <AgGridReact
                                reactUi="true"
                                className="ag-theme-balham"
                                ref={gridRef}
                                getRowStyle={e=>{
                                    // const serial = JSON.parse(localStorage.getItem('serial'))
                                    if(serial.includes(e.data.serial)){
                                        return {
                                            color:'red'
                                        }
                                    }
                                }}
                                rowSelection="multiple"
                                columnDefs={[
                                    {
                                        headerName: '时间', field: 'addtime', headerCheckboxSelection: true,
                                        checkboxSelection: true,
                                    },
                                    { headerName: '用户类型', field: 'customertype' },
                                    { headerName: '商品', field: 'goodsname' },
                                    { headerName: '卡号', field: 'memberid' },
                                    { headerName: '地址', field: 'address' },
                                    { headerName: '配送员', field: 'deliveryman' },
                                    { headerName: '数量', field: 'num' },
                                    { headerName: '订单号', field: 'serial' },
                                ]}
                                onRowClicked={({ data }) => {
                                    console.log(data.serial)
                                    api.current.setValue('serial', data.serial)
                                }}
                                onSelectionChanged={onSelectionChanged}
                                rowData={list}
                                defaultColDef={{
                                    resizable: true,
                                    sortable: true,
                                    filter: 'agTextColumnFilter',
                                    floatingFilter: true,

                                }}
                            />
                        </Box>

                        <Form onSubmit={async (e) => {
                            const list = e.serial
                            // 循环 list 3秒提交一次接口
                            for (let i = 0; i < list.length; i++) {
                                setTimeout(async () => {
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Other_Handle.AddDistributionSubsidyOfCompanyRecord',

                                        ...e,
                                        serial: list[i]
                                    })


                                    if (rew.data.msg === 'SUCCESS') {
                                        // 本地数组 记录 订单号
                                        let arr = JSON.parse(localStorage.getItem('serial'))
                                        arr.push(list[i])
                                        // 最多记录100条
                                        if (arr.length > 100) {
                                            arr.shift()
                                        }
                                        localStorage.setItem('serial', JSON.stringify(arr))
                                        setserial(arr)
                                        // 刷新表格数据
                                        setlist([])
                                        getlist('Srapp.Web_Other_Infos.GetNoDistributionSubsidyOfCompanyRecord')
                                        toast.success('操作成功')
                                    } else {
                                        toast.error(`操作失败 ${rew.data.tips}`)
                                    }
                                }
                                    , i * 3000)

                            }
                            //
                            // if (rew.data.msg === 'SUCCESS') {
                            //     toast.success('操作成功')
                            // } else {
                            //     toast.error(`操作失败 ${rew.data.tips}`)
                            // }
                            api.current.reset()
                        }} layout="vertical" getFormApi={formApi => {
                            api.current = formApi
                        }} onValueChange={values => console.log(values)}>

                            <Form.TagInput field='serial' label='子订单单据号 8002' />
                            <Form.Select field='type' label='补贴类型' style={{ width: '100%' }} >
                                <Form.Select.Option value="应急补贴">应急补贴</Form.Select.Option>
                                <Form.Select.Option value="超远补贴">超远补贴</Form.Select.Option>
                                <Form.Select.Option value="安装胶管补贴">安装胶管补贴</Form.Select.Option>
                                <Form.Select.Option value="上门收瓶补贴">上门收瓶补贴</Form.Select.Option>
                                <Form.Select.Option value="商用气45KG抬楼补贴">商用气45KG抬楼补贴</Form.Select.Option>
                                <Form.Select.Option value="商用气45KG超远补贴">商用气45KG超远补贴</Form.Select.Option>
                                <Form.Select.Option value="收购钢瓶运费补贴">收购钢瓶运费补贴</Form.Select.Option>
                            </Form.Select>
                            <Form.Input field='price' label='单价' />
                            <Form.Input field='remarks' label='备注' />
                            <Button type="submit" variant="contained">确认添加</Button>
                        </Form>
                    </Box>

            }

        </Box>
    );
};

export default AddDistributionSubsidyOfCompanyRecord;
