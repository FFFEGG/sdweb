import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Descriptions, Form, Tag } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import { AgGridReact } from 'ag-grid-react';


const MaterialPackingtypeBasicArchives = () => {
    const [data, setData] = useState('')
    const [list, setList] = useState([])



    const style = {

        backgroundColor: '#eee',
        borderRadius: '4px',
        padding: '10px',
        marginRight: '2px',
        width: '300px',
    }
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Box mb={2} fontSize={18}>包装物原始档案信息</Box>
            <Box mb={2}>
                <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Infos.MaterialPackingtypeBasicArchives',
                        ...e
                    })
                    setList(rew.data)
                }}>
                    <Form.Input field={'keys'} label={'关键字'} />
                    <Form.Select label={'状态'} field={'type'} initValue={'识别码'}>
                        <Form.Select.Option value={'识别码'}>识别码</Form.Select.Option>
                        <Form.Select.Option value={'追溯码'}>追溯码</Form.Select.Option>
                        <Form.Select.Option value={'钢印号'}>钢印号</Form.Select.Option>
                        <Form.Select.Option value={'出厂码'}>出厂码</Form.Select.Option>
                    </Form.Select>


                    <Button type={"submit"} variant={"outlined"} size={"small"}>搜索</Button>

                </Form>
            </Box>

            <Box height={'60vh'} overflow="scroll">
                <AgGridReact
                    className="ag-theme-balham"
                    localeText={tanslations}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "id": "223687",
                        //     "addtime": "2023-09-03 13:14:39.567",
                        //     "nature": "周转",
                        //     "property_unit": "三燃",
                        //     "code": "8010019",
                        //     "trackingcode": "8010019",
                        //     "reg_number": "8006243",
                        //     "manufacturing_unit": "广东良奇钢瓶有限公司",
                        //     "packingtype": "YSP118型钢瓶(液相)",
                        //     "production_number": "0000000",
                        //     "date4manufacture": "2023-07-01 00:00:00.000",
                        //     "lasttestdate": "2023-07-01 00:00:00.000",
                        //     "nexttestdate": "2026-10-01 00:00:00.000",
                        //     "volume": "118LL",
                        //     "wall_thickness": "2-3",
                        //     "nominal_pressure": "2.1Mpa",
                        //     "material": "钢材",
                        //     "weight": "48.5",
                        //     "suttle": "0",
                        //     "remarks": "",
                        //     "department": "钢瓶管理部",
                        //     "operator": "GP001",
                        //     "state": "正常"
                        // }
                        // { field: 'id', headerName: 'id', width: 100 },
                        { field: 'addtime', headerName: '添加时间'},
                        { field: 'nature', headerName: '性质'},
                        { field: 'property_unit', headerName: '产权单位'},
                        { field: 'code', headerName: '识别码'},
                        { field: 'trackingcode', headerName: '追溯码'},
                        { field: 'reg_number', headerName: '钢印号'},
                        { field: 'manufacturing_unit', headerName: '生产单位'},
                        { field: 'packingtype', headerName: '包装类型'},
                        { field: 'production_number', headerName: '出厂编号'},
                        { field: 'date4manufacture', headerName: '生产日期'},
                        { field: 'lasttestdate', headerName: '上次检验日期'},
                        { field: 'nexttestdate', headerName: '下次检验日期'},
                        { field: 'volume', headerName: '容积'},
                        { field: 'wall_thickness', headerName: '壁厚'},
                        { field: 'nominal_pressure', headerName: '公称压力'},
                        { field: 'material', headerName: '材质'},
                        { field: 'weight', headerName: '重量'},
                        { field: 'suttle', headerName: '净重'},
                        { field: 'remarks', headerName: '备注'},
                        { field: 'department', headerName: '部门'},
                        { field: 'operator', headerName: '操作人'},
                        { field: 'state', headerName: '状态'},

                    ]}
                />
            </Box>
        </Box>

    );
};

export default MaterialPackingtypeBasicArchives;
