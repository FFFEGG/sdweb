import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import getjsonlist from "../../utilities/getjsonlist";

const UserPackingtypeChargeSalespromotion = ({ userinfo }) => {
    // console.log(userinfo);
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
            url: 'Srapp.Web_User_Infos.UserPackingtypeChargeSalespromotion',
            userid: userinfo.userid
        })
        setlist(rew.data)
        // console.log(getjsonlist(rew.data[0]))
    }
    useEffect(() => {
        setlist([])
    }, [userinfo])
    return (
        <Box>
            <Box display="flex" alignItems="center">
                <Button onClick={handleSubmit(getlist)} variant="contained">搜索</Button>
            </Box>

            <Box height="80vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    reactUi="true"
                    rowData={list}
                    // onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    columnDefs={
                        [{
                            field: "id",
                            headerName: "id",
                            hide: true
                        }, {
                            field: "serial",
                            headerName: "serial",
                            hide: true
                        }, {
                            field: "addtime",
                            headerName: "添加时间"
                        }, {
                            field: "starttime",
                            headerName: "开始时间"
                        }, {
                            field: "endtime",
                            headerName: "结束时间"
                        }, {
                            field: "userid",
                            headerName: "userid",
                            hide: true
                        }, {
                            field: "memberid",
                            headerName: "会员号"
                        }, {
                            field: "name",
                            headerName: "姓名"
                        }, {
                            field: "workplace",
                            headerName: "工作单位"
                        }, {
                            field: "address",
                            headerName: "地址"
                        }, {
                            field: "discount",
                            headerName: "折扣",
                            valueGetter: data => {
                                console.log(data)
                                return parseFloat(data.data.discount).toFixed(2)
                            }
                        }, {
                            field: "billingmode",
                            headerName: "收费模式"
                        }, {
                            field: "remarks",
                            headerName: "备注"
                        }, {
                            field: "applican_department",
                            headerName: "申请部门"
                        }, {
                            field: "applicant_ope",
                            headerName: "申请人"
                        }, {
                            field: "applicant_opeid",
                            headerName: "applicant_opeid",
                            hide: true

                        }, {
                            field: "authorized_department",
                            headerName: "授权部门"
                        }, {
                            field: "authorized_ope",
                            headerName: "授权人"
                        }, {
                            field: "authorized_opeid",
                            headerName: "authorized_opeid",
                            hide: true
                        }, {
                            field: "authorized_time",
                            headerName: "授权时间"
                        }, {
                            field: "revoke_department",
                            headerName: "撤销部门"
                        }, {
                            field: "revoke_ope",
                            headerName: "撤销人"
                        }, {
                            field: "revoke_opeid",
                            headerName: "revoke_opeid",
                            hide: true
                        }, {
                            field: "revoke_time",
                            headerName: "撤销时间"
                        }, {
                            field: "revoke_remarks",
                            headerName: "撤销备注"
                        },
                        { field: "state", headerName: "状态" }]
                    }
                />
            </Box>
        </Box>
    );
};

export default UserPackingtypeChargeSalespromotion;
