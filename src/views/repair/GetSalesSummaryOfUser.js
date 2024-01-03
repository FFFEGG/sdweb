import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GetSalesSummaryOfUser = () => {
    const [list,setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取维修配件用户销售汇总</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_RepairParts_Infos.GetSalesSummaryOfUser',
                    ...e
                })
                setList(rew.data)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>
            </Form>


            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "memberid": "15664411007",
                        //     "attributiondepartment": "零售青秀分公司",
                        //     "total": 547,
                        //     "discountamount": ".0000",
                        //     "actualamount": 547,
                        //     "cost": 0,
                        //     "goods": [
                        //         {
                        //             "goodsname": "0401 1216管",
                        //             "num": 8
                        //         },
                        //         {
                        //             "goodsname": "0703 双叉尖咀阀",
                        //             "num": 1
                        //         },
                        //         {
                        //             "goodsname": "0405 1216内牙弯头",
                        //             "num": 1
                        //         },
                        //         {
                        //             "goodsname": "0523 防爆2立方阀",
                        //             "num": 1
                        //         },
                        //         {
                        //             "goodsname": "0110 金属包覆软管（1.2米）",
                        //             "num": 1
                        //         },
                        //         {
                        //             "goodsname": "0707 管勾",
                        //             "num": 5
                        //         }
                        //     ]
                        // }
                        {field: 'memberid', headerName: '用户', cellRenderer: 'agGroupCellRenderer',},
                        {field: 'attributiondepartment', headerName: '部门'},
                        {field: 'total', headerName: '总金额'},
                        {field: 'discountamount', headerName: '优惠金额'},
                        {field: 'actualamount', headerName: '实际金额'},
                        {field: 'cost', headerName: '成本'},
                        // {field: 'goods', headerName: '商品',valueGetter: (params) => {
                        //         return params?.data?.goods.map(item=>item.goodsname).join(',')
                        //     }},
                        //goods 里面的数据 展开显示
                    ]}
                    masterDetail="true"
                    detailCellRendererParams={{
                        detailGridOptions: {
                            columnDefs: [
                                {field: 'goodsname', headerName: '商品名称'},
                                {field: 'num', headerName: '数量'},
                            ],
                            defaultColDef: {
                                flex: 1,
                                sortable: true,
                                filter: 'agTextColumnFilter',
                                floatingFilter: true,
                                resizable: true,
                            },
                            onFirstDataRendered(params) {
                                params.api.sizeColumnsToFit();
                            },
                        },
                        getDetailRowData: function (params) {
                            params.successCallback(params.data.goods);
                        },
                    }}
                    // rowGroupPanelShow="always"
                    defaultColDef={{

                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        resizable: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetSalesSummaryOfUser;
