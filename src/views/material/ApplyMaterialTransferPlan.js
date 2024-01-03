import React, {useEffect, useState} from 'react';
import {Box} from "@mui/system";
import {Button, MenuItem, Select, TextField} from "@mui/material";
import moment from "moment";
import {Popconfirm} from "@douyinfe/semi-ui";
import request from "../../utils/request";
import {toast} from "react-toastify";
import {AgGridReact} from "ag-grid-react";

const ApplyMaterialTransferPlan = () => {

    const initData = JSON.parse(localStorage.getItem('initData'))

    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [date, setDate] = useState(moment().add(1, 'd').format('YYYY-MM-DD'))
    const [remarks, setremarks] = useState('')
    const [datajson, setdatajson] = useState([])
    const [list, setList] = useState([])
    useEffect(async () => {
        const rew = await request('post', '/api/getInfo', {
            "url": "Srapp.Web_Material_Infos.MaterialTransferPlanRecord",
            "date": moment().add(1, 'd').format('YYYY-MM-DD'),
            "department": JSON.stringify([loginuser.login_department])
        })
        setList(rew.data)
    }, [])

    return (
        <Box p={3} bgcolor="#FFF" borderRadius={1}>
            申请物资调运
            <Box mt={3} display="flex" alignItems="center">
                <Button onClick={() => {
                    datajson.push({
                        goodsname: '',
                        num: 1
                    })
                    setdatajson([...datajson])
                }} size="large" variant="contained">添加商品</Button>
                <TextField size="small" sx={{marginLeft: 3}} value={date} onChange={e => setDate(e.target.value)}
                           label="调运日期" type="date"/>

                <TextField size="small" sx={{marginLeft: 3}} value={remarks} onChange={e => setremarks(e.target.value)}
                           label="备注"/>
            </Box>
            <Box mt={3} borderTop={1} paddingTop={3} borderColor="#EEE">

                {
                    datajson.map((items, k) => <Box display="flex" marginBottom={1} alignItems="center">
                        <Select value={items.name} onChange={e => {
                            datajson[k].goodsname = e.target.value
                            setdatajson([...datajson])
                        }} size="small" sx={{width: 200}}>
                            {
                                initData.GoodsList.filter(item => item.attribute === '实体商品').sort(item =>
                                    item.stocktype === '液化气' ? -1 : 1
                                ).map(item => <MenuItem
                                    value={item.name}>{item.name}</MenuItem>)
                            }

                        </Select>
                        <TextField onChange={e => {
                            datajson[k].num = e.target.value
                            setdatajson([...datajson])
                        }} value={items.num} label="数量" size="small" type="number"/>
                        <Button onClick={() => {
                            datajson.splice(k, 1)
                            setdatajson([...datajson])
                        }} variant="outlined">删除</Button>
                    </Box>)
                }


            </Box>
            {
                datajson.length ? <Popconfirm title="提示" content="确认操作？" onConfirm={async () => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Handle.ApplyMaterialTransferPlan',
                        date,
                        remarks,
                        datajson: JSON.stringify(datajson)
                    })

                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error(`操作失败 ${rew.data.tips}`)
                    }
                    setdatajson([])
                    setremarks('')
                }}>
                    <Button variant="contained" size="large">确认操作</Button>

                </Popconfirm> : ''
            }


            <Box mt={3} height={'40vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "id": "246",
                        //     "addtime": "2023-06-09 15:21:23.390",
                        //     "date": "2023-06-10 00:00:00.000",
                        //     "data": "[{\"goodsname\":\"12KG液化气(代)\",\"num\":1}]",
                        //     "dispatchinfo": null,
                        //     "remarks": "333",
                        //     "department": "总公司店",
                        //     "deliveryman": "",
                        //     "handledepartment": "",
                        //     "handler": "",
                        //     "handletime": null,
                        //     "state": "正常"
                        // }
                        {headerName: '申请时间', field: 'addtime'},
                        {headerName: '调运日期', field: 'date'},
                        {
                            headerName: '调运商品', field: 'data', valueGetter: ({data}) => {
                                // [{\"goodsname\":\"12KG液化气(代)\",\"num\":1} 商品名称X数量
                                return JSON.parse(data.data).map(item => item.goodsname + 'X' + item.num).join(',')
                                // return JSON.parse(data).map(item=>item.goodsname).join(',')

                            }
                        },
                        {headerName: '调运备注', field: 'remarks'},
                        {headerName: '调运部门', field: 'department'},
                        {headerName: '调运人', field: 'deliveryman'},
                        {headerName: '处理部门', field: 'handledepartment'},
                        {headerName: '处理人', field: 'handler'},
                        {headerName: '处理时间', field: 'handletime'},
                        {headerName: '状态', field: 'state'},
                    ]}

                />
            </Box>

        </Box>
    );

}

export default ApplyMaterialTransferPlan;
