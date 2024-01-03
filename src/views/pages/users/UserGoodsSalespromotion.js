import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import translations from "../../../utils/translations.json";
import { AgGridReact } from "ag-grid-react";

const UserGoodsSalespromotion = ({ userinfo }) => {
    // 获取用户商品优惠信息
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
            url: 'Srapp.Web_User_Infos.UserGoodsSalespromotion',
            userid: userinfo.userid
        })
        setlist(rew.data)
        console.log(rew)
    }
    useEffect(() => {
        setlist([])
    }, [userinfo])
    return (
        <Box>
            <Box display="flex" alignItems="center">

                <Button onClick={handleSubmit(getlist)} sx={{ ml: 1 }} variant="contained">搜索</Button>
            </Box>

            <Box height="80vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    reactUi="true"
                    rowData={list}
                    localeText={translations}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    columnDefs={
                        [

                            {
                                field: "addtime",
                                headerName: "申请时间"
                            },
                            {
                                field: "applican_department",
                                headerName: "申请部门"
                            },
                            {
                                field: "applicant_ope",
                                headerName: "申请人"
                            },
                            {
                                field: "authorized_ope",
                                headerName: "授权人"
                            },
                            {
                                field: "starttime",
                                headerName: "生效时间"
                            },
                            {
                                field: "endtime",
                                headerName: "结束时间"
                            },
                            {
                                field: "goodsname",
                                headerName: "商品"
                            },
                            {
                                field: "salestype",
                                headerName: "优惠方式"
                            },
                            {
                                field: "price",
                                headerName: "优惠价格"
                            },
                            {
                                field: "payment",
                                headerName: "支付方式"
                            },
                            {
                                field: "sellbykilogram",
                                headerName: "是否折公斤销售",
                                valueGetter: ({ data }) => {
                                    return data.sellbykilogram == 1 ? '是' : '否'
                                }
                            },
                            {
                                field: "id_packingtypewarehouse",
                                headerName: "id_packingtypewarehouse",
                                hide: true
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

export default UserGoodsSalespromotion;
