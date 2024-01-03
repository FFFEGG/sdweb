import React, { useCallback, useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import { Button } from "@mui/material";
import request from "../../utils/request";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";

const SplitUserPackingtypeWarehouse = () => {
    const [data, setdata] = useState({
        list: [],
    })
    const [packList, setPackList] = useState([])
    const [user, setUser] = useState([])
    const gridRef = useRef()
    const [packing, setpackage] = useState('')
    const [show, setshow] = useState(false)
    return (
        <Box bgcolor={'#fff'} borderRadius={1} p={3}>
            <Box fontSize={18}>拆分用户包装物仓库数据</Box>
            <Box mt={3}>
                <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e => {
                    //查询用户信息

                    const user = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_Infos.UserBasicInfo',
                        memberid: e.memberid
                    })

                    setUser(user.data)

                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_Infos.UserPackingtypeWarehouse',
                        userid: user.data.userid,
                        ...e
                    })
                    setdata({
                        ...data,
                        list: rew.data.filter(item => item.state !== '撤销')
                    })

                    console.log(rew);
                }}>
                    <Form.Input field={'memberid'} label={'会员号'} />
                    <Form.Input field={'begintime'} type={'date'} label={'开始时间'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'endtime'} type={'date'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')} />
                    <Button type={"submit"} variant={"contained"} size={"small"}>搜索</Button>
                </Form>
            </Box>

            <Box height={'60vh'} overflow={"scroll"} mt={1}>

                <AgGridReact
                    ref={gridRef}
                    className='ag-theme-balham'
                    rowData={data.list}

                    columnDefs={[

                        { headerName: '办理时间', field: 'addtime' },
                        { headerName: '模式', field: 'mode' },
                        { headerName: '名称', field: 'name' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '票号', field: 'billno' },
                        { headerName: '单价', field: 'price' },
                        { headerName: '收费类型', field: 'billingmode' },
                        { headerName: '使用时间', field: 'usetime' },
                        { headerName: '订单号', field: 'serial' },
                        { headerName: 'serial_use', field: 'serial_use' },
                        { headerName: 'billingtime', field: 'billingtime' },
                        { headerName: '包装物类型', field: 'packingtype' },
                        { headerName: '备注', field: 'remarks' },
                        { headerName: '门店', field: 'department' },
                        { headerName: '营业员', field: 'operator' },
                        { headerName: 'retreat_serial', field: 'retreat_serial' },
                        { headerName: 'retreat_type', field: 'retreat_type' },
                        { headerName: 'retreat_department', field: 'retreat_department' },
                        { headerName: 'retreat_ope', field: 'retreat_ope' },
                        { headerName: 'retreat_time', field: 'retreat_time' },
                        { headerName: 'refund_department', field: 'refund_department' },
                        { headerName: 'refund_ope', field: 'refund_ope' },
                        { headerName: 'refund_time', field: 'refund_time' },
                        { headerName: 'refund_remarks', field: 'refund_remarks' },
                        { headerName: '状态', field: 'state' },
                        {
                            headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) => <Button onClick={() => {
                                setpackage(data)
                                setshow(true)
                            }} size={"small"} variant={"text"}>拆分</Button>
                        },
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                />
            </Box>


            <Modal style={{ top: '10%' }} visible={show} onCancel={() => setshow(false)} footer={<></>}  >
                <Box>
                    拆分包装物 数量: {packing.num}
                </Box>
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        nums: JSON.stringify(e.nums.trim().split(' ')),
                        userid: user.userid,
                        packingtypwarehouseid: packing.id,
                        url: 'Srapp.Web_BusinessProcessing_Handle.SplitUserPackingtypeWarehouse'
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('成功')
                        setdata({
                            ...data,
                            list: []
                        })
                    } else {
                        toast.error(`失败 ${rew.data.tips}`)
                    }
                    setshow(false)
                }}>
                    <Form.Input field={'nums'} label={'拆分数据集（数字加空格）'} />
                    <Button variant={"contained"} type={"submit"}>确认拆分</Button>
                </Form>
            </Modal>

        </Box>
    );
};

export default SplitUserPackingtypeWarehouse;
