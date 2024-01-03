import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import translations from "../../../utils/translations";
import { AgGridReact } from "ag-grid-react";
import { Form, Popconfirm } from '@douyinfe/semi-ui'
import { toast } from "react-toastify";


const UserPackingtypeChargeRecord = ({ userinfo }) => {
    const [list, setlist] = useState([])
    const { handleSubmit, register } = useForm({
        defaultValues: {
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const getlist = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_User_Infos.UserPackingtypeChargeRecord',
            userid: userinfo.userid
        })
        setlist(rew.data)

    }
    useEffect(() => {
        setlist([])
    }, [userinfo])
    // 新增：用于存储选中行的状态
    // 用于存储选中行的状态
    const [selectedRows, setSelectedRows] = useState([]);

    // 处理行选择变化的函数
    const onSelectionChanged = (params) => {
        console.log(params)
        const selectedNodes = params.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        setSelectedRows(selectedData);
    }

    // 计算选中行的总数和金额
    const selectedCount = selectedRows.length;
    const selectedTotal = selectedRows.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
    // 批量取消操作的递归函数
    const processCancel = async (rows, index) => {
        if (index < rows.length) {
            const row = rows[index];
            // 执行取消操作，例如：
            await request('post', '/api/getInfo', {
                url: 'Srapp.Web_User_EditInfo.CancelUserPackingtypeCharge',
                id: row.id,
                userid: userinfo.userid,
                remarks: `操作员${loginuser.name}取消`
            });

            // 设置500毫秒后处理下一条
            setTimeout(() => processCancel(rows, index + 1), 500);
        } else {
            // 所有行处理完毕
            toast.success('操作完毕');
            setSelectedRows([]);
        }
    };

    // 启动批量取消操作
    const handleBulkCancel = () => {
        if (selectedRows.length > 0) {
            processCancel(selectedRows, 0);
        } else {
            toast.info('没有选中的行');
        }
    };


    const remarksdata = useRef('');
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box>
            <Box display="flex" alignItems="center">

                <Button onClick={handleSubmit(getlist)} variant="contained">搜索</Button>
                <Button onClick={handleBulkCancel}>
                    批量取消 ({selectedCount} 条, 总金额: {selectedTotal})
                </Button>

            </Box>

            <Box height="80vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    reactUi="true"
                    rowData={list}
                    localeText={translations}
                    rowSelection="multiple" // 新增：启用行选择
                    onSelectionChanged={onSelectionChanged} // 新增：行选择变化时的回调
                    isRowSelectable={data => data.data.state == '正常'} // 仅当状态为“正常”时允许选择

                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    columnDefs={
                        [

                            {
                                checkboxSelection: true, headerCheckboxSelection: true,
                                field: "serial",
                                headerName: "订单号"
                            },
                            {
                                field: "id_packingtypewarehouse",
                                headerName: "id_packingtypewarehouse",
                                hide: true
                            },
                            {
                                field: "serial_packingtypewarehouse",
                                headerName: "serial_packingtypewarehouse",
                                hide: true
                            },
                            {
                                field: "userid",
                                headerName: "userid",
                                hide: true
                            },
                            {
                                field: "serial_collect",
                                headerName: "serial_collect",
                                hide: true
                            },
                            {
                                field: "packingtype",
                                headerName: "包装物",
                            },
                            {
                                field: "project",
                                headerName: "收费项",
                            },
                            {
                                field: "date_collect",
                                headerName: "收费时间",
                            },
                            {
                                field: "state",
                                headerName: "状态",
                            },
                            {
                                field: "handle_remarks",
                                headerName: "取消原因",
                            },
                            {
                                field: "remarks",
                                headerName: "备注",
                            },
                            {
                                field: "total",
                                headerName: "小计",
                            },



                            {
                                headerName: '操作',
                                pinned: 'right',
                                cellRendererFramework: ({ data }) => <Box>
                                    {
                                        data.state === '正常' ? <Popconfirm style={{ width: 300 }}
                                            title="提示"
                                            content={
                                                <Box>
                                                    <Form onChange={e => {
                                                        // console.log(e.values.remarks)
                                                        // setremarks(e.values.remarks)
                                                        remarksdata.current = e.values.remarks
                                                    }}>
                                                        <Form.Input field='remarks' label="取消原因" />
                                                    </Form>

                                                </Box>
                                            }
                                            onConfirm={async () => {
                                                const rew = await request('post', '/api/getInfo', {
                                                    url: 'Srapp.Web_User_EditInfo.CancelUserPackingtypeCharge',
                                                    id: data.id,
                                                    userid: userinfo.userid,
                                                    remarks: `操作员${loginuser.name}取消,原因:${remarksdata.current}`
                                                })
                                                if (rew.data.msg === 'SUCCESS') {

                                                    toast.success('操作成功')
                                                } else {
                                                    toast.error(`操作失败 ${rew.data.tips}`)
                                                }
                                            }}>

                                            <Button>取消</Button>
                                        </Popconfirm> : ''
                                    }

                                </Box>
                            }
                        ]
                    }
                />
            </Box>
        </Box>
    );
};

export default UserPackingtypeChargeRecord;
