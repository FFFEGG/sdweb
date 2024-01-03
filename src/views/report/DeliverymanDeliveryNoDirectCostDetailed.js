import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";

const DeliverymanDeliveryNoDirectCostDetailed = () => {
    const [list, setList] = useState([])
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>配送员\司机配送明细（不计直送运费）</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.DeliverymanDeliveryNoDirectCostDetailed',
                    ...e
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {

                        //     "addtime": "2023-06-20 00:00:00.000",
                        //     "goodsname": "45KG液化气",
                        //     "num": "1.0",
                        //     "return_num": "0",
                        //     "deliveryman": "秦健民",
                        //     "memberid": "200020",
                        //     "workplace": "国鹏壹号",
                        //     "address": "朝阳1号"
                        // }
                        { headerName: '时间', field: 'addtime' },
                        { headerName: '商品名称', field: 'goodsname' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '空瓶数量', field: 'return_num' },
                        { headerName: '配送员', field: 'deliveryman' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '单位', field: 'workplace' },
                        { headerName: '地址', field: 'address' },
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default DeliverymanDeliveryNoDirectCostDetailed;
