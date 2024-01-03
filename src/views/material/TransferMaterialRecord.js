import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import moment from "moment";
import request from "../../utils/request";
import { Form, Modal, Popconfirm, Select as Selects } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { getCode } from "../../utils/getCode";

const TransferMaterialRecord = () => {
    const [list, setlist] = useState([])
    const [transactionopeid, settransactionopeid] = useState('')
    const [codejson, setcodejson] = useState([])
    const [code, setcode] = useState('')
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const OperatorList = initData.OperatorList
    const [datas, setdata] = useState({
        opename: OperatorList[0].name,
        mode: '接收物资',
        begintime: moment().format('YYYY-MM-DD'),
        endtime: moment().format('YYYY-MM-DD'),
    })

    const [showmyrecord, setshowmyrecord] = useState(false)
    const [myrecord, setmyrecord] = useState([])
    const [myrecordList, setmyrecordList] = useState([])

    const getlist = async () => {
        setlist([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Material_Infos.TransferMaterialRecord',
            ...datas
        })
        setlist(rew.data)
        // console.log(rew);
    }
    const RemoveChinese = (strValue) => {
        if (strValue != null && strValue != "") {
            var reg = /[\u4e00-\u9fa5]/g;
            return strValue.replace(reg, "");
        }
        else
            return "";
    }
    const api = useRef()
    return (
        <Box p={3} bgcolor="#fff" borderRadius={1}>
            <Typography fontSize={18}>移交包装物</Typography>
            <Box mt={3} p={3} border={1} borderColor="#CCC" borderRadius={1}>
                <Typography fontSize={16}>员工移交包装物物资列表</Typography>
                <Box mt={3} display="flex" alignItems="center">
                    <Form labelPosition="inset" layout="horizontal">

                        <Form.Select filter initValue={datas.opename} onChange={e => setdata({ ...datas, opename: e })}
                            label="人员">
                            {
                                OperatorList.map(item => <Selects.Option value={item.name}>{item.name}</Selects.Option>)
                            }

                        </Form.Select>

                        <Form.Select initValue={datas.mode} onChange={e => setdata({ ...datas, mode: e })} label="状态">
                            <Selects.Option value="接收物资">接收物资</Selects.Option>
                            <Selects.Option value="调出物资">调出物资</Selects.Option>
                        </Form.Select>
                        <Form.Input initValue={datas.begintime} onChange={e => setdata({ ...datas, begintime: e })}
                            type="date" label="开始时间" />
                        <Form.Input initValue={datas.endtime} onChange={e => setdata({ ...datas, endtime: e })}
                            type="date" label="结束时间" />
                        <Button size="small" onClick={getlist} sx={{ ml: 1 }} variant="contained">查询</Button>
                    </Form>
                </Box>

                <Box mt={3} height="40vh" overflow="scroll">
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={list}
                        columnDefs={[
                            { headerName: '创建时间', field: 'addtime' },
                            { headerName: '方式', field: 'mode' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '发起员工', field: 'originator' },
                            { headerName: '钢瓶类型', field: 'packingtype' },
                            { headerName: '接收门店', field: 'receive_department' },
                            { headerName: '接收员工', field: 'receiver' },
                            { headerName: '钢瓶状态', field: 'type' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: '操作', cellRendererFramework: ({ data }) =>
                                    1 ? '' : <Box>
                                        <Popconfirm title="提示" content="确认操作？" onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_Material_Handle.CancelStaffTransferMaterial',
                                                id: data.id,
                                                serial: data.serial
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                            getlist()
                                        }}>
                                            {data.state !== '正常' ?
                                                <Button size="small" color="error" variant="outlined">取消</Button> : ''}

                                        </Popconfirm>
                                        <Popconfirm title="提示" content="确认操作？" onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_Material_Handle.ConfirmStaffTransferMaterial',
                                                id: data.id,
                                                serial: data.serial
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                            getlist()
                                        }}>
                                            {data.state !== '正常' ?
                                                <Button size="small" color="success"
                                                    variant="outlined">确认</Button> : ''}

                                        </Popconfirm>

                                    </Box>

                            },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sort: true
                        }}
                    />
                </Box>

            </Box>
            <Modal visible={showmyrecord} onOk={() => {
                const arr = myrecordList.map(item => item.code)
                setcodejson(arr)
                setshowmyrecord(false)
                setmyrecord([])
                setmyrecordList([])

            }} onCancel={() => {
                setshowmyrecord(false)
                setmyrecord([])
                setmyrecordList([])
            }} style={{ width: '60vw', top: '10%' }}>
                <Box fontSize={20} mb={2}>物资列表</Box>
                <Box display={"flex"}>

                    {
                        Object.keys(myrecord).map((item) => <Box flex={1} mr={1} border={1} p={1}>

                            <Box fontSize={15}>{item}</Box>
                            {
                                Object.keys(myrecord[item]).map(v =>
                                    <Box>
                                        <Box>{v}:[{myrecord[item][v].length}]</Box>
                                        <Box display={"flex"} flexWrap={"wrap"}>
                                            {
                                                myrecord[item][v].map(vi => <Button variant={"outlined"} size={"small"} sx={{ mr: 1, mb: 1 }}>{vi.code}</Button>)
                                            }
                                        </Box>
                                    </Box>
                                )
                            }



                        </Box>)
                    }
                </Box>


            </Modal>
            <Box mt={3} p={3} border={1} borderColor="#CCC" borderRadius={1}>
                <Box fontSize={16}>员工移交包装物物资 <Button onClick={async () => {
                    setshowmyrecord(true)
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Infos.OpeHoldPackingtypeInfo',
                        opeids: JSON.stringify([loginuser.opeid])
                    })
                    const arr_s = rew.data.filter(item => item.state === '正常')

                    const arr = {
                        "空": {},
                        "重": {},
                    }
                    for (const i in arr_s) {
                        if (!arr[arr_s[i].type][arr_s[i].packingtype]) {

                            arr[arr_s[i].type][arr_s[i].packingtype] = []
                            arr[arr_s[i].type][arr_s[i].packingtype].push(arr_s[i])
                        } else {
                            arr[arr_s[i].type][arr_s[i].packingtype].push(arr_s[i])
                        }
                    }

                    setmyrecord(arr)
                    setmyrecordList(arr_s)


                }} variant={"outlined"} size={"small"}>转移所有物资</Button></Box>

                <Box mt={3}>
                    <Form getFormApi={e => api.current = e} labelPosition="inset" layout="horizontal">
                        <Form.Input field='code' value={code} onChange={e => setcode(e)} onKeyDown={async e => {
                            if (e.code === 'Enter') {
                                const str = await getCode(code)

                                if (str.code != '') {
                                    codejson.push(str.code)
                                    setcode('')
                                    api.current.setValue('code', '')
                                    setcodejson([...codejson])
                                }

                            }
                        }} label="识别码" />
                        <Form.Select initValue={datas.mode} onChange={e => setdata({ ...datas, mode: e })} label="方式">
                            <Form.Select.Option value="接收物资">接收物资</Form.Select.Option>
                            <Form.Select.Option value="调出物资">调出物资</Form.Select.Option>
                        </Form.Select>

                        <Form.Select style={{width:150}} initValue={transactionopeid} filter onChange={e => settransactionopeid(e)}
                            label="交易人">
                            {
                                OperatorList
                                    //本门店排序
                                    .sort((a, b) => {
                                        if (a.department === loginuser.login_department) {
                                            return -1
                                        }
                                        if (b.department === loginuser.department) {
                                            return 1
                                        }
                                        return 0
                                    }).map(item => <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>


                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_Material_Handle.StaffTransferMaterial',
                                mode: datas.mode,
                                codejson: JSON.stringify(codejson),
                                transaction_opeid: transactionopeid
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('操作成功')
                            } else {
                                toast.error(`操作失败 ${rew.data.tips}`)
                            }
                            setcodejson([])
                        }}>
                            <Button size="small" variant="contained">确认提交</Button>
                        </Popconfirm>

                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                            setcodejson([])
                        }}>
                            <Button size="small" sx={{ ml: 1 }} variant="outlined">清空</Button>
                        </Popconfirm>
                    </Form>

                </Box>
                <Box mt={3} padding={3} bgcolor="#F8f8f8" borderRadius={1}>
                    {
                        codejson.map(item => <Button variant="outlined" sx={{ width: 200 }}>{item}</Button>)
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default TransferMaterialRecord;
