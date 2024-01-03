import {Button as Buttons, Form, Modal, Upload} from '@douyinfe/semi-ui';
import { Box, Button } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import React, {useEffect, useRef} from 'react';
import { toast } from 'react-toastify';
import request from 'utils/request';
import RepairPartsTypeList from "./RepairPartsTypeList";
import * as XLSX from "xlsx";
import {IconUpload} from "@douyinfe/semi-icons";

const RepairPartsList = () => {
    const [list, setlist] = React.useState([])
    const [gaslist, setgaslist] = React.useState([])
    const [show, setshow] = React.useState(false)
    const [gasshow, setgasshow] = React.useState(false)
    const [RepairPartsTypeList, seRepairPartsTypeList] = React.useState([])
    const getlist = async () => {
        console.log('getlist')
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.RepairPartsList'
        })
        setlist(rew.data.info)
    }

    useEffect(async ()=>{
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.RepairPartsTypeList'
        })
        seRepairPartsTypeList(rew.data.info)
    },[])
    const api = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={1}>设置配件参数</Box>
            <Box>
                <Button sx={{ mr: 1 }} onClick={getlist} variant="contained">刷新</Button>
                <Button sx={{ mr: 1 }} onClick={() => {
                    setshow(true)
                }} variant="contained">新增</Button>
                {/*<Button variant="contained" type="button" onClick={() => {*/}
                {/*    setgasshow(true)*/}
                {/*}} >EXCEL上传数据</Button>*/}

            </Box>

            <Modal size="large" visible={gasshow} title="EXCEL上传数据" onCancel={() => {
                setgasshow(false)
                setgaslist([])
            }} footer={<></>}>
                <Box >
                    <Upload action="http://srsdapi.sanrangas.com/" onFileChange={e => {
                        // console.log(e);
                        const file = e[0];
                        const reader = new FileReader();
                        // reader.readAsText(file);
                        if (reader.readyState === FileReader.DONE || reader.readyState === FileReader.EMPTY) {
                            reader.onload = function (event) {
                                const data = new Uint8Array(event.target.result)
                                const workbook = XLSX.read(data, { type: 'array' })
                                const sheetName = workbook.SheetNames[0]
                                const worksheet = workbook.Sheets[sheetName]
                                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                                const dataArray = []
                                for (let i = 1; i < rows.length; i++) {
                                    const row = rows[i]
                                    console.log('+++++',row)
                                    if (row[0]) {

                                        const item = {

                                            typeid: RepairPartsTypeList.find(e=>e.name === row[0]).id,
                                            typename: row[0],
                                            name: row[1],
                                            unit: row[2],
                                            price: parseFloat(row[4]),
                                            commissionprice: parseFloat(row[5]),
                                            sort: i + 162,
                                            state: '正常',

                                        }
                                        dataArray.push(item)
                                    }

                                }
                                setgaslist(dataArray)
                                console.log(dataArray)
                            }

                            reader.readAsArrayBuffer(file)
                        } else {
                            console.log('FileReader is busy')
                        }

                    }}>
                        <Buttons icon={<IconUpload />} theme="light">
                            点击上传
                        </Buttons>
                    </Upload>
                    {
                        gaslist.length > 0 && <Button variant="contained" sx={{ mt: 3 }} onClick={async () => {
                            for (let i = 0; i < gaslist.length; i++) {
                                // console.log({
                                //     url: 'Srapp.Web_SystemSetting.SettingRepairParts',
                                //     ...gaslist[i]
                                // })
                                setTimeout(async ()=>{
                                    // console.log({
                                    //     url: 'Srapp.Web_SystemSetting.SettingRepairParts',
                                    //     ...gaslist[i]
                                    // })
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_SystemSetting.SettingRepairParts',
                                        ...gaslist[i],
                                        action: 'ADD',
                                        id: 0,
                                    })

                                    if (rew.data.msg === 'SUCCESS') {
                                        toast.success('操作成功')
                                    } else {
                                        toast.error('操作失败')
                                    }

                                    // 最后一条上传完毕提示
                                    if(i === gaslist.length - 1){
                                        toast.success('上传完毕')
                                        setgasshow(false)
                                        setgaslist([])
                                        getlist()
                                    }
                                },i*500)
                            }
                        }}>确认上传</Button>
                    }

                    <table className="my-table" style={{ marginTop: 10 }}>
                        <thead>
                        <tr>
                            <td>类型</td>
                            <td>商品名称</td>
                            <td>单位</td>
                            <td>销售单价</td>
                            <td>提成单价</td>

                        </tr>
                        </thead>
                        <tbody>
                        {
                            gaslist.map((item, index) => {
                                return <tr key={index}>
                                    <td>{item.typename}</td>
                                    <td>{item.name}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.price}</td>
                                    <td>{item.commissionprice}</td>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>

                </Box>
            </Modal>

            <Box mt={2} height="60vh" overflow={'scroll'}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[

                        { field: 'type', headerName: '类型' },
                        { field: 'name', headerName: '名称' },
                        { field: 'unit', headerName: '单位' },
                        { field: 'price', headerName: '单价' },
                        { field: 'commissionprice', headerName: '提成单价' },
                        { field: 'sort', headerName: '排序' },
                        { field: 'state', headerName: '状态' },
                        {
                            field: '操作', headerName: '操作', cellRendererFramework: (params) => {

                                return (
                                    <Button onClick={() => {
                                        setshow(true)
                                        setTimeout(() => {
                                            api.current.setValues(params.data)
                                            api.current.setValue('id', params.data.id)
                                            api.current.setValue('action', 'UPDATE')
                                        }, 100);

                                    }} variant="text" size="small">修改</Button>
                                )


                            }
                        },
                    ]}

                />
            </Box>



            <Modal title="新增/修改配件参数" visible={show} onCancel={() => {
                setshow(false)
            }} onOk={() => {
                api.current.submitForm()
            }}>

                <Form getFormApi={e => api.current = e} initValues={{
                    action: 'ADD',
                    id: 0,
                }} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingRepairParts',
                        ...e
                    })

                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setshow(false)

                }}>
                    {/*<Form.Input label="类型" field='type' />*/}

                    <Form.Select label="配件类型" field='typeid' style={{width: '100%'}}>
                        {RepairPartsTypeList.map(e => {
                            return (
                                <Form.Select.Option value={e.id}>{e.name}</Form.Select.Option>
                            )
                        })}
                    </Form.Select>
                    <Form.Input label="名称" field='name' />
                    <Form.Input label="单位" field='unit' />
                    <Form.Input label="单价" field='price' />
                    <Form.Input label="提成单价" field='commissionprice' />
                    <Form.Input label="排序" field='sort' />
                    <Form.Select label="状态" field='state' >
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>

                </Form>

            </Modal>
        </Box>
    );
};

export default RepairPartsList;