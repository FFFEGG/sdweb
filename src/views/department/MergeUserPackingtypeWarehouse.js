import React, {useCallback, useRef, useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import {Button} from "@mui/material";
import request from "../../utils/request";
import moment from "moment";
import {AgGridReact} from "ag-grid-react";
import {toast} from "react-toastify";

const MergeUserPackingtypeWarehouse = () => {
    const [data,setdata] = useState({
        list: [],
    })
    const [packList,setPackList] = useState([])
    const [user,setUser] = useState([])
    const gridRef = useRef()
    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        setPackList(selectedRows)
        // setInvoice(selectedRows)
    }, []);
    return (
        <Box bgcolor={'#fff'} borderRadius={1} p={3}>
            <Box fontSize={18}>合并用户包装物仓库数据(周转非扫描类)</Box>
            <Box mt={3}>
                <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e=> {
                    //查询用户信息

                    const user = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_User_Infos.UserBasicInfo',
                        memberid: e.memberid
                    })

                    setUser(user.data)

                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_User_Infos.UserPackingtypeWarehouse',
                        userid: user.data.userid,
                        ...e
                    })
                    setdata({
                        ...data,
                        list: rew.data.filter(item=>item.verificationmethod === '周转销售(不扫描)' && item.state !== '撤销')
                    })

                    console.log(rew);
                }}>
                    <Form.Input field={'memberid'} label={'会员号'} />
                    <Form.Input field={'begintime'} type={'date'} label={'开始时间'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'endtime'} type={'date'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')} />
                    <Button type={"submit"} variant={"contained"} size={"small"}>搜索</Button>
                </Form>
            </Box>

            <Box height={'60vh'} overflow={"scroll"} mt={1}>
                <Box display={"flex"} alignItems={"center"}  my={1} p={1} bgcolor={'#eee'}>
                    <Box p={1} mr={3}>已选择: { packList.length } 条数据</Box>
                    <Button onClick={async () => {
                        const rew = await request('post','/api/getInfo',{
                            url: 'Srapp.Web_BusinessProcessing_Handle.MergeUserPackingtypeWarehouse',
                            userid: user.userid,
                            packingtypwarehouseids: JSON.stringify(packList.map(item=>item.id))
                        })
                        if (rew.code == 200) {
                            toast.success('合并成功')
                            setdata({
                                ...data,
                                list: []
                            })
                            setPackList([])
                        } else {
                            toast.error('合并失败')
                        }
                    }} variant={"contained"}>确认合并</Button>
                </Box>
                <AgGridReact
                    ref={gridRef}
                    className='ag-theme-balham'
                    rowData={data.list}
                    rowSelection="multiple"
                    onSelectionChanged={onSelectionChanged}
                    columnDefs={[
                        {headerName:'订单号',field: 'serial',checkboxSelection: true},
                        {headerName:'办理时间',field: 'addtime'},
                        {headerName:'模式',field: 'mode'},
                        {headerName:'名称',field: 'name'},
                        {headerName:'票号',field: 'billno'},
                        {headerName:'单价',field: 'price'},
                        {headerName:'数量',field: 'num'},
                        {headerName:'收费类型',field: 'billingmode'},
                        {headerName:'使用时间',field: 'usetime'},
                        {headerName:'serial_use',field: 'serial_use'},
                        {headerName:'billingtime',field: 'billingtime'},
                        {headerName:'包装物类型',field: 'packingtype'},
                        {headerName:'备注',field: 'remarks'},
                        {headerName:'门店',field: 'department'},
                        {headerName:'营业员',field: 'operator'},
                        {headerName:'retreat_serial',field: 'retreat_serial'},
                        {headerName:'retreat_type',field: 'retreat_type'},
                        {headerName:'retreat_department',field: 'retreat_department'},
                        {headerName:'retreat_ope',field: 'retreat_ope'},
                        {headerName:'retreat_time',field: 'retreat_time'},
                        {headerName:'refund_department',field: 'refund_department'},
                        {headerName:'refund_ope',field: 'refund_ope'},
                        {headerName:'refund_time',field: 'refund_time'},
                        {headerName:'refund_remarks',field: 'refund_remarks'},
                        {headerName:'状态',field: 'state'},
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                />
            </Box>

        </Box>
    );
};

export default MergeUserPackingtypeWarehouse;
