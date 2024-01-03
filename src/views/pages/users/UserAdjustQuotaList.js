import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";

const UserAdjustQuotaList = ({ userinfo }) => {
    const [list, setlist] = useState([])
    const { handleSubmit, register } = useForm({
        defaultValues: {
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const getlist = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            // ...data,
            url: 'Srapp.Web_User_Infos.UserAdjustQuotaList',
            userid: userinfo.userid
        })
        // console.log(rew)
        setlist(rew.data)
        // setlist(rew.data)
    }
    useEffect(() => {
        setlist([])
    }, [userinfo])
    return (
        <Box>
            <Box display="flex" alignItems="center" marginTop={1}>
                <TextField {...register('begintime')} size="small" type="date" />
                <TextField {...register('endtime')} size="small" type="date" />
                <Button onClick={handleSubmit(getlist)} sx={{ ml: 1 }} variant="contained">搜索2</Button>
            </Box>

            <Box height="80vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    // onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    defaultColDef={{
                        // flex: 1
                    }}
                    columnDefs={
                        [
                            {
                                field: "addtime",
                                headerName: "申请时间"
                            },
                            {
                                field: "primaryquota",
                                headerName: "信用额度",

                            },
                            {
                                field: "quota",
                                headerName: "申请额度",

                            },
                            {
                                field: "remarks",
                                headerName: "备注",

                            },

                            {
                                field: "applicant_ope",
                                headerName: "申请人",

                            },
                            {
                                field: "authorized_ope",
                                headerName: "授权人",
                            },
                            {
                                field: "authorized_time",
                                headerName: "授权时间",
                            },
                            {
                                field: "state",
                                headerName: "状态",
                            },
                        ]
                    }
                />
            </Box>
        </Box>
    );
};

export default UserAdjustQuotaList;
