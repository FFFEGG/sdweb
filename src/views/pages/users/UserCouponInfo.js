import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { Popconfirm, Toast } from "@douyinfe/semi-ui";
import {getValue} from "@mui/system";
import {toast} from "react-toastify";

const UserCouponInfo = ({ userinfo }) => {
    const [list, setlist] = useState([])
    const [selectedRows, setSelectedRows] = useState([]);

    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    // 处理行选择变化的函数
    const onSelectionChanged = (params) => {
        const selectedNodes = params.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        setSelectedRows(selectedData);
    };

    // 批量取消操作的函数
    // const handleBulkCancel = async () => {
    //     for (let i = 0; i < selectedRows.length; i++) {
    //         const row = selectedRows[i];
    //         // 执行取消操作
    //         await request('post', '/api/getInfo', {
    //             url: 'Srapp.Web_User_EditInfo.CancelUserGoodsCoupon',
    //             id: row.id,
    //             userid: userinfo.userid,
    //             begintime: getValues('begintime'),
    //             endtime: getValues('endtime'),
    //             // 其他需要的参数
    //         });
    //     }
    //     // 重新获取列表数据
    //     getlist({
    //         begintime: getValues('begintime'),
    //         endtime: getValues('endtime')
    //     });
    //     Toast.success('批量取消操作完成');
    // };


    const processCancel = async (rows, index) => {
        if (index < rows.length) {
            const row = rows[index];
            // 执行取消操作，例如：
            await request('post', '/api/getInfo', {
                url: 'Srapp.Web_User_EditInfo.CancelUserGoodsCoupon',
                id: row.id,
                userid: userinfo.userid,
                begintime: getValues('begintime'),
                endtime: getValues('endtime'),
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

    const { handleSubmit, register,getValues } = useForm({
        defaultValues: {
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const getlist = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_User_Infos.UserCouponInfo',
            userid: userinfo.userid
        })
        console.log(rew)
        setlist(rew.data)
    }
    useEffect(() => {
        setlist([])
    }, [userinfo])
    return (
        <Box>
            <Box display="flex" alignItems="center">
                <TextField {...register('begintime')} size="small" type="date" />
                <TextField {...register('endtime')} size="small" type="date" />
                <Button onClick={handleSubmit(getlist)} sx={{ ml: 1 }} variant="contained">搜索</Button>
                <Button sx={{ ml: 1 }}  onClick={handleBulkCancel}>批量取消</Button>

            </Box>

            <Box height="80vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    isRowSelectable={data => data.data.state == '正常'} // 仅当状态为“正常”时允许选择

                    className="ag-theme-balham"
                    rowData={list}
                    defaultColDef={{
                        // flex: 1,
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,

                    }}
                    rowSelection="multiple" // 启用行选择
                    onSelectionChanged={onSelectionChanged} // 行选择变化时的回调

                    columnDefs={
                        [
                            {
                                checkboxSelection: true, headerCheckboxSelection: true,
                                field: "type",
                                headerName: "类型"
                            },
                            {
                                field: "couponname",
                                headerName: "优惠券名称"
                            },
                            {
                                field: "addtime",
                                headerName: "发券时间"
                            },
                            {
                                field: "begin_termofvalidity",
                                headerName: "开始时间"
                            },
                            {
                                field: "end_termofvalidity",
                                headerName: "结束时间"
                            },
                            {
                                field: "minconsumption",
                                headerName: "最小使用金额"
                            },
                            {
                                field: "price",
                                headerName: "金额"
                            },
                            {
                                field: "goodsnames",
                                headerName: "商品"
                            },
                            {
                                field: "state",
                                headerName: "状态"
                            },
                            {

                                headerName: "操作",
                                pinned: 'left',
                                cellRendererFramework: ({ data }) => <Box>
                                    {
                                        data.state === '正常' ?

                                            <Popconfirm style={{ width: 300 }} title="提示" content="确认操作?"
                                                onConfirm={async () => {
                                                    const rew = await request('post', '/api/getInfo', {
                                                        url: 'Srapp.Web_User_EditInfo.CancelUserGoodsCoupon',
                                                        id: data.id,
                                                        userid: userinfo.userid,
                                                        begintime: getValues('begintime'),
                                                        endtime: getValues('endtime'),

                                                    })
                                                    if (rew.data.msg === 'SUCCESS') {
                                                        Toast.success('操作成功')
                                                    } else {
                                                        Toast.error(`操作失败 ${rew.data.tips}`)
                                                    }
                                                    getlist({

                                                        begintime: getValues('begintime'),
                                                        endtime: getValues('endtime'),
                                                    })
                                                }}>

                                                <Button>取消</Button>
                                            </Popconfirm> :
                                            ''
                                    }
                                </Box>
                            },
                        ]
                    }
                />
            </Box>
        </Box>
    );
};

export default UserCouponInfo;
