import React, { useRef, useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { Form, Modal, Popover } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from 'react-toastify';

const GetSpotCheckCommodityQualityRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const api = useRef(null)
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Typography mb={3} fontSize={18} color={"black"}>获取商品抽检信息</Typography>

            <Form getFormApi={e => api.current = e} layout={'horizontal'} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_WorkSafety_Infos.GetSpotCheckCommodityQualityRecord',
                    ...e,
                    department: JSON.stringify(e.department)
                })
                setList(rew.data)
                // console.log(rew);
            }}>
                <Form.Input type="date" field={'begintime'} label={'开始时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input type="date" field={'endtime'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select initValue={[loginuser.login_department]} multiple maxTagCount={2} filter style={{ width: 250 }} field={'department'} label={'门店'}>
                    {
                        initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }
                </Form.Select>


                <Box display={"flex"} alignItems={"end"}>
                    <Button type={"submit"} variant={"contained"}>搜索</Button>
                </Box>
            </Form>

            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                    }}
                    columnDefs={[
                        { field: 'addtime', headerName: '添加时间', },
                        { field: 'code', headerName: '条码', },

                        { field: 'department', headerName: '门店', },
                        { field: 'fillafterweight', headerName: '重瓶重量', },
                        { field: 'fillgunno', headerName: '扫码枪号', },
                        { field: 'operator', headerName: '操作员', },
                        { field: 'packingtype', headerName: '包装物', },
                        { field: 'packingweight', headerName: '包装物重量', },
                        {
                            headerName: '钢瓶状态', valueGetter: ({ data }) => {

                                //大于12公斤，小于11.5(不含)公斤的异常
                                if ((data.fillafterweight - data.packingweight) > 12 || (data.fillafterweight - data.packingweight) < 11.5) {
                                    return '异常'
                                }
                                return '正常'
                            }
                        },
                        { field: 'state', headerName: '状态', },
                        {
                            headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) => <Button onClick={async e => {
                                Modal.confirm({
                                    title: '确认取消？',
                                    content: '',
                                    onOk: async () => {
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_WorkSafety_Handle.CancelSpotCheckCommodityQuality',
                                            id: data.id
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast.success('取消成功')
                                            api.current.submitForm()
                                        } else {
                                            toast.error(`取消失败 ${rew.data.tips}`)
                                        }
                                    }
                                })
                            }}>取消</Button>
                        },

                    ]}
                />
            </Box>
        </Box>
    );
};

export default GetSpotCheckCommodityQualityRecord;
