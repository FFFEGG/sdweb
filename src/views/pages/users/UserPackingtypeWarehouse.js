import React, { useEffect, useRef, useState } from 'react';
import request from "../../../utils/request";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import { Toast, Popconfirm, Modal, Form } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import translate from "../../../utils/translations.json";
const UserPackingtypeWarehouse = ({ userinfo }) => {
    const initData = JSON.parse(localStorage.getItem('initData'))

    const [list, setlist] = useState([])
    const [formdata, setdata] = useState('')
    const [pageNumber, setpageNumber] = useState(1)
    const { register, handleSubmit } = useForm({
        defaultValues: {
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })


    const getlist = async (data) => {
        setlist([])
        setdata(data)
        const rew = await request('post', '/api/getInfo', {
            ...data,
            userid: userinfo.userid,
            url: 'Srapp.Web_User_Infos.UserPackingtypeWarehouse'
        })
        if (rew.code === 200) {


            setlist(rew.data)

        }
    }
    const [UserHoldPackingtypeInfo, setUserHoldPackingtypeInfo] = useState([])
    useEffect(async () => {
        const rew = await request('post', '/api/getInfo', {
            userid: userinfo.userid,
            url: 'Srapp.Web_User_Infos.UserHoldPackingtypeInfo'
        })
        setUserHoldPackingtypeInfo(rew.data)
    }, [userinfo])
    const [maindata, setmaindata] = useState('')
    const [open, setopen] = useState(false)
    const [open2, setopen2] = useState(false)
    const [archivesid, setarchivesid] = useState('')
    const ref = useRef()
    function sumFunction(values) {
        let result = 0;
        values.forEach(value => result += Number(value));
        return result;
    }
    return (
        <div>
            <Box p={1} border={1} borderColor="#ccc" minHeight={600} >
                <Box display={'flex'}>
                    <TextField {...register('begintime')} type="date" size="small" />
                    <TextField {...register('endtime')} type="date" size="small" />
                    <FormControl style={{ width: 200 }}>

                        <InputLabel id="demo-simple-select-label">状态</InputLabel>
                        <Select label="状态" size="small" onChange={e => {
                            ref.current.api.setQuickFilter(e.target.value)
                        }}>
                            <MenuItem value={''}>全部</MenuItem>
                            <MenuItem value={'正常'}>正常</MenuItem>
                            <MenuItem value={'已使用'}>已使用</MenuItem>
                            <MenuItem value={'已退物资'}>已退物资</MenuItem>
                            <MenuItem value={'撤销'}>取消</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField {...register('keywords')} size="small" placeholder="快捷查询" />



                    <Button size="small" sx={{ p: 1, px: 4 }} onClick={handleSubmit(getlist)} variant="outlined">查询</Button>
                </Box>


                <Box mt={2} overflow="scroll" height="70vh">
                    <AgGridReact
                        ref={ref}
                        reactUi="true"
                        className="ag-theme-balham"
                        localeText={translate}
                        onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                        rowGroupPanelShow="always"
                        columnDefs={[

                            { headerName: '订单号', field: 'serial' },
                            { headerName: '订单时间', field: 'addtime' },
                            { headerName: '状态', field: 'state', enableRowGroup: true, },
                            { headerName: '订单类型', field: 'mode', enableRowGroup: true, },
                            { headerName: '包装物类型', field: 'packingtype', enableRowGroup: true, },
                            { headerName: '包装物名称', field: 'name' },
                            { headerName: '票号', field: 'billno' },
                            { headerName: '包装物单价', field: 'price' },
                            { headerName: '包装物数量', field: 'num' },

                            { headerName: '使用部门', field: 'department_use' },
                            { headerName: '使用人', field: 'operator_use' },
                            { headerName: '使用时间', field: 'usetime' },
                            { headerName: '使用类型', field: 'type_use' },

                            { headerName: '退物类型', field: 'retreat_type' },
                            { headerName: '退物门店', field: 'retreat_department' },
                            { headerName: '退物操作人', field: 'retreat_ope' },
                            { headerName: '退物时间', field: 'retreat_time' },
                            { headerName: '退款门店', field: 'refund_department' },
                            { headerName: '核销方式', field: 'verificationmethod' },
                            { headerName: '会员ID', field: 'memberid' },
                            { headerName: '计费方式', field: 'billingmode' },

                            // { headerName: '核销订单号', field: 'serial_use' },
                            { headerName: '计费时间', field: 'billingtime' },
                            { headerName: '备注', field: 'remarks' },
                            { headerName: '门店', field: 'department' },
                            { headerName: '操作人', field: 'operator' },
                            { headerName: '退还订单号', field: 'retreat_serial' },

                            { headerName: '退款操作人', field: 'refund_ope' },
                            { headerName: '退款时间', field: 'refund_time' },
                            { headerName: '退款备注', field: 'refund_remarks' },




                            {
                                headerName: '操作', pinned:'right', cellRendererFramework: ({ data }) => {
                                    console.log(data)
                                    if (data?.state === '已使用') {
                                        return <div>
                                            <Button onClick={() => {
                                                setopen(true)
                                                setmaindata(data)
                                            }}>冻结</Button>
                                            <Button onClick={() => {
                                                setopen2(true)
                                                setmaindata(data)
                                            }}>转卡</Button>
                                        </div>
                                    }
                                    return  <Button onClick={() => {
                                        setopen2(true)
                                        setmaindata(data)
                                    }}>转卡</Button>

                                }
                            },
                        ]}

                        // rowSelection="single"
                        rowClass="my-row"
                        getRowStyle={params => {
                            if (params.data && params.data.state === '已使用') {
                                return { color: "blue" }
                            }
                            if (params.data && params.data.state === '已退款') {
                                return { color: "red" }
                            }

                            if (params.data && params.data.state === '已接单') {
                                return { color: "green" }
                            }

                            if (params.data && params.data.state === '取消') {
                                return { color: "pink" }
                            }

                            if (params.data && params.data.state === '冻结') {
                                return { color: "gray" }
                            }

                            if (params.data && params.data.state === '撤销') {
                                return { color: "pink" }
                            }

                            return { color: "black" }
                        }}
                        rowData={list}
                        defaultColDef={{
                            sortable: true, // 开启排序
                            resizable: true,
                            floatingFilter: 'true',
                            filter: 'agTextColumnFilter',
                        }}
                        // groupDefaultExpanded={-1}
                        // autoGroupColumnDef={{
                        //     headerName: "Group",
                        //     minWidth: 200,
                        //     cellRenderer: 'agGroupCellRenderer',
                        //     cellRendererParams: {
                        //         checkbox: true,
                        //     }
                        // }}
                        autoGroupColumnDef={{
                            headerName: "Group",
                            field: 'group',
                            cellRendererParams: {
                                innerRenderer: function (params) {
                                    console.log('params', params.node.allLeafChildren)
                                    const list_arr = params.node.allLeafChildren
                                    return `${params.value} - 合计数量: ${list_arr.reduce((total, item) => total + item.data.num * 1, 0)}`;
                                }
                            }
                        }}
                    // aggFuncs={{
                    //     'sum': sumFunction  // 'sumFunction' 是你自定义的求和函数
                    // }}
                    />
                </Box>
            </Box>

            <Modal visible={open2} title="转卡"
                   onCancel={() => {
                       setopen2(false)
                       setmaindata('')
                   }}
                   footer={<></>}
                   >
                <>
                    <Form onSubmit={async e=>{
                        //查询会员号信息
                        // const user = await request('post','/api/getInfo',{
                        //     "memberid": e.memberid,
                        //     "url": "Srapp.Web_User_Infos.UserBasicInfo"
                        // })
                        try {
                            // const userid = user.data.userid
                            const rew = await  request('post','/api/getInfo',{
                                url: 'Srapp.Web_Material_Handle.TransferUserPackingtypeInfoToOtherUser',
                                code: e.code,
                                userid: userinfo.userid,
                                othermemberid: e.memberid,
                                remarks: e.remarks,
                                askdepartment: e.askdepartment,
                                askoperator: e.askoperator,
                                id: maindata.id

                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('转移成功')
                            } else {
                                toast.error('转移失败' + rew.data.tips)
                            }

                            setopen2(false)
                            setmaindata('')

                        } catch (e) {
                            // toast.error('会员不存在')
                        }


                    }}>
                        <Form.Input field={'code'} label={'钢瓶号识别码'} />
                        <Form.Input field={'memberid'} label={'会员号'} />
                        <Form.Input field={'remarks'} label={'备注'} />
                        <Form.Select filter style={{width:300}} field={'askdepartment'} label={'要求门店'} >
                            {
                                initData.DepartmentList.map(item=>
                                    <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                                )

                            }
                        </Form.Select>

                        <Form.Select style={{width:300}} filter field={'askoperator'} label={'要求营业员'} >
                            {
                                initData.OperatorList.map(item=>
                                    <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                                )

                            }
                        </Form.Select>
                        <Button type={'submit'} variant={'contained'}>确认</Button>
                    </Form>
                </>
            </Modal>
            <Modal
                visible={open}
                onCancel={() => {
                    setopen(false)
                    setmaindata('')
                }}
                onOk={async () => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_EditInfo.FrozenUserPackingtype',
                        userid: userinfo.userid,
                        id: maindata.id,
                        materialid: archivesid
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error(`操作失败 ${rew.data.tips}`)
                    }
                    setopen(false)
                    setmaindata('')
                    setarchivesid('')
                }}
                style={{
                    top: '10%'
                }}
            >
                <Box fontSize={18}>确认冻结?</Box>
                <Form onChange={e => setarchivesid(e.values.archivesid)}>
                    <Form.Select label={'用户持有包装物'} field={'archivesid'} style={{ width: '100%' }}>
                        {
                            UserHoldPackingtypeInfo.map(item =>
                                <Form.Select.Option value={item.id}>{item.packingtype}-{item.code}</Form.Select.Option>
                            )
                        }
                    </Form.Select>
                </Form>
            </Modal>
        </div>
    );
};

export default UserPackingtypeWarehouse;
