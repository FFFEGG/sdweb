import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { useNavigate } from 'react-router';

const InventoryAlert = () => {
    const [list, setList] = useState([])
    const navigate = useNavigate()
        const initData = JSON.parse(localStorage.getItem('initData'))
            const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取库存预警信息</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Material_Infos.InventoryAlert',
                    ...e
                })
                let arr = []
                arr = rew.data.filter(item=>{
                    //如果是等于部门是运输公司 则只显示 商品含有 '气' 的数据
                    if (loginuser.login_department === '运输公司') {
                        if (item.goodsname.indexOf('气') !== -1) {
                            return true
                        }
                        return false
                    } else {
                        return true
                    }


                    }).map(item => {

                    item.llkc = parseFloat(item.endstocknum) + parseFloat(item.plannum_wc) - parseFloat(item.ordergoodsnum)
                    return item
                })
                setList(arr)

            }} layout={"horizontal"} labelPosition={"inset"}>

                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    getRowStyle={params => {
                        if (params.data && params.data.llkc < 20) {
                            return { background: "green", color: 'white' }
                        }

                        return { color: "black" }
                    }}
                    className="ag-theme-balham"
                    rowData={list}
                    groupDefaultExpanded={1}

                    columnDefs={[
                        { headerName: '部门', field: 'department', rowGroup: true, hide: true },
                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '期初库存', field: 'endstocknum' },
                        { headerName: '昨日销售商品数量', field: 'salenum' },
                        { headerName: '今天订单商品数量', field: 'ordergoodsnum' },
                        { headerName: '计划未安排数量', field: 'plannum_zc' },
                        { headerName: '计划已安排数量', field: 'plannum_wc' },
                        { headerName: '理论库存', field: 'llkc' },
                        {
                            headerName: '操作', field: 'plannum_wc', cellRendererFramework: ({ data }) =>
                                <>

                                    <Button onClick={() => {
                                        // console.log(params);
                                        navigate('/material/MaterialTransferPlanRecord?department=' + data.department)
                                    }} size="small" variant="text">安排</Button>
                                </>

                        },

                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        flex: 1

                    }}
                // onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default InventoryAlert;
