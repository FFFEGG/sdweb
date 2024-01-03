import React, {useEffect, useRef, useState} from 'react';
import {Box} from "@mui/system";
import {Form, Modal} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {toast} from "react-toastify";
import {AgGridReact} from "ag-grid-react";

const GetInOrOutRecord = () => {
//     Srapp.Web_RepairParts_Infos.GetInOrOutRecord
//     获取维修配件进出记录
//     接口地址：http://113.16.193.82:8203/?s=Srapp.Web_RepairParts_Infos.GetInOrOutRecord
//         POST
//     接口描述：
//
// 接口参数
//     参数名字	类型	是否必须	默认值	其他	说明
//     begintime	日期	必须			开始时间
//     endtime	日期	必须			结束时间
//     goodsname	字符串	可选			配件名称
//     mode	枚举类型	必须		范围：采购入库/门店调出/门店退回/员工出库/员工入库/用户购买	交易方式
    const [wxlist,setwxlist] = useState([])
    const [list,setlist] = useState([])
    const [addshow,setaddshow] = useState(false)
    const [mode, setMode] = useState(''); // 新增状态来存储 mode
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef()

    useEffect(async ()=>{
        // 获取配件名称
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.RepairPartsList'
        })
        setwxlist(rew.data.info.filter(item=>item.state == '正常'))
    },[])


    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取维修配件进出记录</Box>


            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_RepairParts_Infos.GetInOrOutRecord',
                    ...e
                })
                setlist(rew.data)
            }}>
                <Form.Input field="begintime" label="开始时间" type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field="endtime" label="结束时间" type={'date'} initValue={moment().format('YYYY-MM-DD')}/>

                <Form.Select  field={'goodsname'} label={'商品名称'} filter style={{width:200}}>
                    {
                        wxlist.map(item=>

                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                        )
                    }
                </Form.Select>
                {/*//     mode	枚举类型	必须		范围：采购入库/门店调出/门店退回/员工出库/员工入库/用户购买	交易方式*/}
                <Form.Select rules={[{required: true}]} field={'mode'} label={'交易方式'} filter style={{width:200}}>
                    <Form.Select.Option value={'采购入库'}>采购入库</Form.Select.Option>
                    <Form.Select.Option value={'门店调出'}>门店调出</Form.Select.Option>
                    <Form.Select.Option value={'门店退回'}>门店退回</Form.Select.Option>
                    <Form.Select.Option value={'员工出库'}>员工出库</Form.Select.Option>
                    <Form.Select.Option value={'员工入库'}>员工入库</Form.Select.Option>
                    <Form.Select.Option value={'用户购买'}>用户购买</Form.Select.Option>
                </Form.Select>
                <Button size={'small'} sx={{mr:2}} variant="contained" color="primary" type={'submit'}>查询</Button>
                <Button size={'small'} variant="contained" color="primary" onClick={()=>setaddshow(true)} >新增</Button>

            </Form>


            <Modal title={'新增'} visible={addshow} onCancel={()=>setaddshow(false)} onOk={ ()=>{
                api.current.submitForm()
            }}>
                <Form getFormApi={e=>api.current = e} onSubmit={async e=>{
                    console.log(e)
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_RepairParts_Handle.AddInOrOutRecord',
                        ...e
                    })
                    if (rew.data.msg == 'SUCCESS') {
                        setaddshow(false)
                        api.current.reset()
                        toast.success('新增成功')
                    } else {
                        toast.error(rew.data.tips)
                    }
                }}>
                    {/*Srapp.Web_RepairParts_Handle.AddInOrOutRecord*/}
                    {/*新增维修配件商品进出库记录*/}
                    {/*接口地址：http://113.16.193.82:8203/?s=Srapp.Web_RepairParts_Handle.AddInOrOutRecord*/}
                    {/*POST*/}
                    {/*接口描述：*/}

                    {/*接口参数*/}
                    {/*参数名字	类型	是否必须	默认值	其他	说明*/}
                    {/*mode	枚举类型	必须		范围：采购入库/门店调出/门店退回/员工出库/员工入库/用户购买	交易方式*/}
                    {/*goodsid	整型	必须			配件商品ID*/}
                    {/*counterparty	字符串	可选		最大：150	交易方*/}
                    {/*price	浮点型	可选	0		配件商品单价*/}
                    {/*num	浮点型	必须			数量*/}
                    {/*remarks	字符串	可选		最大：150	备注*/}
                    <Form.Select rules={[{required: true}]} field={'mode'} style={{width:'100%'}} label={'交易方式'}
                                 filter
                                 onChange={(value) => {
                                     setMode(value)
                                     api.current.reset()
                                 }} // 更新 mode 状态

                    >
                        <Form.Select.Option value={'采购入库'}>采购入库</Form.Select.Option>
                        <Form.Select.Option value={'门店调出'}>门店调出</Form.Select.Option>
                        <Form.Select.Option value={'门店退回'}>门店退回</Form.Select.Option>
                        <Form.Select.Option value={'员工出库'}>员工出库</Form.Select.Option>
                        <Form.Select.Option value={'员工入库'}>员工入库</Form.Select.Option>
                        <Form.Select.Option value={'用户购买'}>用户购买</Form.Select.Option>
                    </Form.Select>
                    <Form.Select

                        onChange={e=>{
                            if (api.current.getValue('mode') === '用户购买') {

                                api.current.setValue('price', parseFloat( wxlist.filter(item=>item.id == e)[0].price))
                            }
                        }}
                        rules={[{required: true}]} field={'goodsid'} label={'商品名称'} filter style={{width:'100%'}}>
                        {
                            wxlist.map(item=>

                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>
                    {
                        ( mode === '门店调出' || mode === '门店退回') &&
                        <Form.Select field="counterparty" rules={[{required: true}]} filter label="交易方" style={{width:'100%'}} >
                            {
                                initData.DepartmentList.map(item=>
                                    <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                                )
                            }
                        </Form.Select>




                    }
                    {

                        ( mode === '员工出库' || mode === '员工入库') &&
                        <Form.Select field="counterparty" rules={[{required: true}]} filter label="交易方" style={{width:'100%'}} >
                            {
                                initData.OperatorList
                                    // 本门店的排序在前面
                                    .sort((a, b) => {
                                        if (a.department === loginuser.login_department) return -1;
                                        if (b.department === loginuser.login_department) return 1;
                                        return 0; // 如果都不是，则保持原有顺序
                                    })
                                    .filter(item=>item.department == '客服中心')
                                    .map(item=>
                                    <Form.Select.Option value={item.name}>[{item.department}]-{item.name}</Form.Select.Option>
                                )
                            }
                        </Form.Select>
                    }


                    {
                        ( mode === '用户购买' ) &&
                        <>
                            <Form.Input field="counterparty" rules={[{required: true}]} label="交易方" />
                            <Form.Input field="price" label="配件商品单价" />
                        </>

                    }

                    {
                        ( mode === '采购入库' ) &&
                        <Form.Input field="counterparty" rules={[{required: true}]} label="交易方" />

                    }





                    <Form.Input field="num" initValue={1} rules={[{required: true}]} label="数量" />
                    <Form.Input field="remarks" label="备注" />
                </Form>


            </Modal>



            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "id": "1",
                        //     "addtime": "2023-12-06 11:17:03.833",
                        //     "serial": "800020231206111703643925030",
                        //     "mode": "员工出库",
                        //     "counterparty": "杨闯",
                        //     "type": "",
                        //     "goodsname": "胶管",
                        //     "price": ".0000",
                        //     "num": "1.0000",
                        //     "remarks": "测试出库",
                        //     "department": "岭南店",
                        //     "operator": "胡东CD"
                        // }
                        {field: 'id', headerName: 'ID', width: 70,hide:true},
                        {field: 'addtime', headerName: '时间',},
                        {field: 'serial', headerName: '流水号', hide:true},
                        {field: 'mode', headerName: '交易方式', filter: 'agSetColumnFilter',enableRowGroup: true},
                        {field: 'counterparty', headerName: '交易方', filter: 'agSetColumnFilter',enableRowGroup: true},
                        {field: 'type', headerName: '类型', hide:true},
                        {field: 'goodsname', headerName: '商品名称', filter: 'agSetColumnFilter',enableRowGroup: true},
                        {field: 'price', headerName: '单价', width: 200},
                        {field: 'num', headerName: '数量', width: 200},
                        {field: 'remarks', headerName: '备注', width: 200},
                        {field: 'department', headerName: '部门', filter: 'agSetColumnFilter',enableRowGroup: true},
                        {field: 'operator', headerName: '操作员', filter: 'agSetColumnFilter',enableRowGroup: true},
                        {headerName: '操作', pinned:'left', width: 100, cellRendererFramework: (params) => {
                                return (
                                    <>
                                        <Button size={'small'} variant="text"  onClick={async ()=>{
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_RepairParts_Handle.CancelInOrOutRecord',
                                                id: params.data.id
                                            })
                                            if (rew.data.msg == 'SUCCESS') {
                                                toast.success('取消成功')
                                                params.api.applyTransaction({ remove: [params.data] });
                                            } else {
                                                toast.error(rew.data.tips)
                                            }
                                        }}>取消</Button>
                                    </>
                                )

                            }
                        }

                    ]}
                    rowGroupPanelShow={'always'}

                    defaultColDef={{
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        resizable: true,
                    }}
                    onFirstDataRendered={(params) => {
                        params.api.sizeColumnsToFit();
                    } }

                />
            </Box>
        </Box>
    );
};

export default GetInOrOutRecord;
