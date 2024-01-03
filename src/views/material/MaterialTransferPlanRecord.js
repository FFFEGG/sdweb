import React, { useEffect, useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Button, TextField, Typography } from "@mui/material";
import moment from "moment";
import request from "../../utils/request";
import { ArrayField, Form, Modal, Popconfirm, Select } from "@douyinfe/semi-ui";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import { useLocation } from 'react-router';
import transulations from '../../utils/translations.json'
import myprint from 'utils/myprint';


const MaterialTransferPlanRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [apdata, setapdata] = useState('')
    const [visible, setvisible] = useState(false)
    const [date, setdate] = useState(moment().format('YYYY-MM-DD'))
    const [deliveryman, setdeliveryman] = useState('')
    const [department, setdepartment] = useState([loginuser.login_department])
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const key_department = searchParams.get('department');

    const [num, setnum] = useState(0)
    const [goodsjson, setgoodsjson] = useState([])
    const getlist = async () => {
        setList([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Material_Infos.MaterialTransferPlanRecord',
            date,
            department: JSON.stringify(department)
        })
        setList(rew.data)
    }
    const onChange = (value) => {
        setdeliveryman(value);
        console.log(value);
    };

    useEffect(() => {
        if (key_department) {
            setdepartment([key_department])
        }
    }, [key_department])
    const [keywords, setkeywords] = useState('')
    const ref = useRef(null);

    return (
        <div>
            <Box p={3} bgcolor="#FFF" borderRadius={1}>
                <Typography fontSize={18} color="black">获取物资计划调拨记录</Typography>
                <Box display="flex" alignItems="center" mt={3}>
                    <TextField size="small" type="date" value={date} onChange={e => setdate(e.target.value)} />
                    <Select value={department} maxTagCount={1} filter onChange={e => setdepartment(e)} multiple
                        style={{ padding: 4, border: '1px solid #ccc', marginLeft: 10, marginRight: 10 }}>
                        {
                            initData.DepartmentList.filter(item => item.type == '业务门店').map(item => <Select.Option
                                value={item.name}>{item.label}</Select.Option>)
                        }

                    </Select>
                    <TextField placeholder='快捷搜索' size="small" value={keywords} onChange={e => {
                        setkeywords(e.target.value)
                        ref.current.api.setQuickFilter(e.target.value)
                    }} />

                    {/* <Input value={keywords} placeholder={'快捷搜索'} onChange={e => {
                        setkeywords(e)
                        ref.current.api.setQuickFilter(e)
                    }} /> */}

                    <Button sx={{ ml: 1 }} variant="outlined" onClick={() => {
                        setkeywords('水')
                        ref.current.api.setQuickFilter('水')
                    }}>水</Button>
                    <Button sx={{ ml: 1 }} variant="outlined" onClick={() => {
                        setkeywords('气')
                        ref.current.api.setQuickFilter('气')
                    }}>气</Button>
                    {((loginuser.login_department === '运输公司' || loginuser.login_department === '总公司店')) &&
                        <Button sx={{ ml: 1 }} variant="contained"
                            onClick={() => setdepartment(initData.DepartmentList.filter(item => item.type == '业务门店').map(item => item.name))}>全选</Button>
                    }

                    <Button sx={{ ml: 1 }} variant="contained" onClick={getlist}>搜索</Button>
                </Box>
                <Modal
                    title="确认安排"
                    visible={visible}
                    // onOk={async () => {
                    //     console.log(apdata)
                    //     const rew = await request('post', '/api/getInfo', {
                    //         url: 'Srapp.Web_Material_Handle.ArrangeMaterialTransferPlan',
                    //         id: apdata.id,
                    //         deliveryman: deliveryman.value
                    //     })

                    //     if (rew.data.msg === 'SUCCESS') {
                    //         toast.success('操作成功')
                    //     } else {
                    //         toast.error(`操作失败 ${rew.data.tips}`)
                    //     }
                    //     getlist()
                    //     setvisible(false)

                    // }}
                    onCancel={() => setvisible(false)}
                    maskClosable={false}
                    style={{ top: '10%' }}
                    footer={null}
                    size="large"
                >
                    <Form onSubmit={async e => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Material_Handle.ArrangeMaterialTransferPlan',
                            ...e,
                            id: apdata.id,
                            dispatchinfo: JSON.stringify(e.dispatchinfo)
                        })

                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('操作成功')
                            if (rew.data.printinfo) {
                                myprint(rew.data.printinfo)
                            }
                        } else {
                            toast.error(`操作失败 ${rew.data.tips}`)
                        }
                        getlist()
                        setvisible(false)
                    }}>
                        <Form.Select rules={[
                            {
                                required: true,
                                message: '必填',
                            },
                        ]} field='deliveryman' filter style={{width: 300}} label='司机'>
                            {
                                initData.OperatorList.filter(item => {
                                    if (loginuser.department == '运输公司') {
                                        return  item.quarters === '司机' && item.department === '运输公司'
                                    } else {
                                       return  item.quarters === '司机'
                                    }
                                }).map((item, k) =>
                                    <Select.Option key={k}
                                        value={item.name}>{item.name}</Select.Option>)
                            }
                        </Form.Select>
                        {/* <Form.Input initValue={num} field='num' label='确认安排数量' /> */}

                        <ArrayField field='dispatchinfo' initValue={goodsjson}>
                            {({ add, arrayFields, addWithInitValue }) => (
                                <React.Fragment>
                                    {
                                        arrayFields.map(({ field, key, remove }, i) => (
                                            <div key={key} style={{ display: 'flex' }}>
                                                <Form.Input
                                                    field={`${field}[goodsname]`}
                                                    label={`商品名称`}
                                                    style={{ width: 200, marginRight: 16 }}
                                                >
                                                </Form.Input>
                                                <Form.Input
                                                    field={`${field}[num]`}
                                                    label={`数量`}
                                                    style={{ width: 200, marginRight: 16 }}
                                                >
                                                </Form.Input>
                                                <Form.Input
                                                    field={`${field}[confirm_num]`}
                                                    label={`确认数量`}
                                                    style={{ width: 200, marginRight: 16 }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '必填',
                                                        },
                                                    ]}
                                                >
                                                </Form.Input>

                                            </div>
                                        ))
                                    }
                                </React.Fragment>
                            )}
                        </ArrayField>
                        <Button variant="contained" type="submit" sx={{ mb: 3 }}>确认安排</Button>
                    </Form>

                </Modal>
                <Box height="60vh" overflow="scroll" mt={2}>
                    <AgGridReact
                        className="ag-theme-balham"
                        ref={ref}
                        localeText={transulations}
                        onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                        rowData={list}
                        columnDefs={[
                            { headerName: '时间', field: 'addtime' },
                            { headerName: '调运日期', field: 'date', valueGetter: ({ data }) => data.date.substr(0, 10) },
                            { headerName: '门店', field: 'department' },
                            { headerName: '安排部门', field: 'handledepartment' },
                            { headerName: '安排人', field: 'handler' },
                            { headerName: '计划人', field: 'operator' },
                            { headerName: '司机', field: 'deliveryman' },
                            {
                                headerName: '商品', field: 'data', valueGetter: ({ data }) => {
                                    if (JSON.parse(data.data) !== 0) {
                                        return JSON.parse(data.data).map((item, k) => `${item.goodsname} X ${item.num} `)
                                    }
                                    return ''
                                }
                            },
                            { headerName: '备注', field: 'remarks' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: '操作',
                                suppressExport: true,
                                pinned: 'left',
                                cellRendererFramework: ({ data }) => <Box>
                                    <Popconfirm title="提示" content="确认取消？" onConfirm={async () => {
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_Material_Handle.CancelMaterialTransferPlan',
                                            id: data.id
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast.success('操作成功')
                                        } else {
                                            toast.error(`操作失败 ${rew.data.tips}`)
                                        }
                                        getlist()
                                    }}>
                                        {(loginuser.login_department === data.department && data.state === '正常') ?
                                            <Button size="small" variant="outlined">取消</Button> : ''}

                                    </Popconfirm>

                                    {((loginuser.login_department === '运输公司' || loginuser.login_department === '总公司店')) ?
                                        <Button onClick={() => {
                                            setvisible(true)
                                            setapdata(data)
                                            let goodsdata = JSON.parse(data.data)
                                            setgoodsjson(goodsdata)
                                            // setnum(goodsdata[0].num)


                                        }} size="small" variant="text">安排</Button> : ''}



                                </Box>
                            },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            //// flex: 1
                        }}
                    />
                </Box>

            </Box>
        </div>
    );

}

export default MaterialTransferPlanRecord;
