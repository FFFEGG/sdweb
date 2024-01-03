import React from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from 'ag-grid-react';
import printJS from 'print-js';

const TraceTheSourceMaterialStockBookkeepingInfo = () => {
    const [list, setList] = React.useState([]);
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box mb={3} fontSize={18}>获取溯源类包装物库存记账信息</Box>

            <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Material_Infos.TraceTheSourceMaterialStockBookkeepingInfo',
                    ...e
                })
                console.log(rew);
                setList(rew.data);
            }}>
                <Form.Input type={'date'} field={'begintime'} initValue={moment().format('YYYY-MM-DD')} label={'开始时间'} />
                <Form.Input type={'date'} field={'endtime'} initValue={moment().format('YYYY-MM-DD')} label={'结束时间'} />
                <Button size={"small"} type={"submit"} variant={"outlined"}>搜索</Button>
                <Button sx={{ ml: 1 }} type="button" onClick={() => {

                    printJS({
                        printable: list,
                        properties: [
                            { field: 'packingtype', displayName: '包装物类型' },
                            { field: 'type', displayName: '类型' },
                            { field: 'beginstocknum', displayName: '库存期初' },

                            { field: 'TransferInOfGPGL', displayName: '钢瓶管理部' },
                            { field: 'TransferInOfOther', displayName: '其它方式调入' },
                            { field: 'TransferInOfTransportationCompany', displayName: '运输公司调入' },
                            { field: 'TransferInOfOurStore', displayName: '本店调入' },
                            { field: 'TransferInOfUserReturnSpace', displayName: '用户回空调入' },
                            { field: 'TransferInOfUserBringIn', displayName: '用户带入调入' },
                            { field: 'TransferInOfBuy', displayName: '收购调入' },
                            { field: 'TransferInOfUserTemporaryStorage', displayName: '用户暂存调入' },
                            { field: 'TransferInOfUserOther', displayName: '用户其它调入' },
                            { field: 'TransferInOfUserReturnedMaterials', displayName: '用户退空调入' },

                            { field: 'TransferOutOfGPGL', displayName: '钢瓶管理部' },
                            { field: 'TransferOutOfOther', displayName: '其它方式调出' },
                            { field: 'TransferOutOfTransportationCompany', displayName: '运输公司调出' },
                            { field: 'TransferOutOfOurStore', displayName: '本店调出' },
                            { field: 'SalesUseBillsOfUser', displayName: '销售使用票据' },
                            { field: 'TransferOutOfUser', displayName: '用户销售调出' },
                            { field: 'endstocknum', displayName: '期末' },

                        ],
                        type: 'json',
                        // gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;',
                        // gridStyle: 'border: 2px solid #3971A5;'
                    })
                }} variant="outlined" size="small">导出</Button>
            </Form>
            <Box mt={3} height="60vh" overflow={'scroll'}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    columnDefs={[
                        { headerName: '包装物类型', field: 'packingtype', width: 200,pinned: 'left' },
                        { headerName: '类型 ', field: 'type', width: 200 },
                        { headerName: '库存期初 ', field: 'beginstocknum', width: 200 },
                        {
                            headerName: '调入',
                            children: [
                                { headerName: '钢瓶管理部', index: '钢瓶管理调入', field: 'TransferInOfGPGL', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '非钢瓶管理部门调入', index: '其它方式调入(非钢瓶管理部门调入)', field: 'TransferInOfOther', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '运输公司调入', index: '运输公司调入', field: 'TransferInOfTransportationCompany', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '本店调入', index: '本店调入', field: 'TransferInOfOurStore', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },

                                { headerName: '用户回空调入', index: '用户回空调入', field: 'TransferInOfUserReturnSpace', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '用户带瓶', index: '用户带入调入', field: 'TransferInOfUserBringIn', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '收购调入', index: '收购调入', field: 'TransferInOfBuy', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '用户暂存调入', index: '用户暂存调入', field: 'TransferInOfUserTemporaryStorage', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '用户其它', index: '用户其它调入', field: 'TransferInOfUserOther', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '用户退物资', index: '用户退空调入', field: 'TransferInOfUserReturnedMaterials', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 }
                            ],
                        },

                        {
                            headerName: '调出',
                            children: [
                                { headerName: '钢瓶管理部', index: '钢瓶管理调出', field: 'TransferOutOfGPGL', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },
                                { headerName: '其它', index: '其它方式调出(非钢瓶管理部门调出)', field: 'TransferOutOfOther', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },
                                { headerName: '运输公司调出', index: '运输公司调出', field: 'TransferOutOfTransportationCompany', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },
                                { headerName: '本店调出', index: '本店调出', field: 'TransferOutOfOurStore', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },

                                { headerName: '用户销售调出', index: '用户销售调出', field: 'TransferOutOfUser', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },
                            ]
                        },

                        { headerName: '销售使用票据', index: '销售使用票据', field: 'SalesUseBillsOfUser', width: 200 },
                        { headerName: '期末', field: 'endstocknum', width: 200 },
                        { headerName: '性质', field: 'nature', width: 200 },

                    ]}
                />
            </Box>
        </Box>
    );
};

export default TraceTheSourceMaterialStockBookkeepingInfo;
