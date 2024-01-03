import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import translation from "../../utils/translations.json";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const MaterialCirculationRecord = (props) => {
    const initData = JSON.parse(localStorage.getItem("initData"));
    const loginuser = JSON.parse(localStorage.getItem("userinfo"));
    const [list, setlist] = useState([]);
    const [pageinfo, setpageinfo] = useState("");
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const api = useRef();

    const pagelist = () => {
        if (!pageinfo.pageCount) {
            return "";
        }
        let arr = [];
        for (let i = 0; i < pageinfo.pageCount; i++) {
            arr.push(
                page === i + 1 ? (
                    <Box color={"blue"} p={1}>
                        {i + 1}
                    </Box>
                ) : (
                    <Box p={1}>{i + 1}</Box>
                )
            );
        }
        return arr;
    };

    return (
        <Box p={3} borderRadius={1} bgcolor={"#fff"}>
            <Form
                getFormApi={(e) => {
                    api.current = e;
                }}
                layout={"horizontal"}
                labelPosition={"inset"}
                onSubmit={async (e) => {
                    const rew = await request("post", "/api/getInfo", {
                        url: "Srapp.Web_Material_Infos.MaterialCirculationRecord",
                        ...e,
                    });
                    setlist(rew.data);
                }}
            >
                <Form.Input
                    field={"begintime"}
                    label={"开始时间"}
                    type={"date"}

                    initValue={moment().subtract(2, "years").format("YYYY-MM-DD")}
                />
                <Form.Input
                    field={"endtime"}
                    label={"结束时间"}
                    type={"date"}
                    initValue={moment().format("YYYY-MM-DD")}
                />

                <Form.Input field={"code"} label={"条码"} />
                <Form.Input field={'memberid'} label={'会员信息'} />
                <Button size={"small"} type={"submit"} variant={"contained"}>
                    搜索
                </Button>
            </Form>

            <Box mt={3} height={"60vh"} overflow={"scroll"}>
                <AgGridReact
                    rowData={list}
                    className="ag-theme-balham"
                    localeText={translation}
                    columnDefs={[

                        { field: "grant_mode", headerName: "移交方式" },
                        { field: "grant_time", headerName: "移交时间" },
                        { field: "packingtype", headerName: "包装物" },
                        { field: "code", headerName: "条码" },
                        { field: "trackingcode", headerName: "溯源码" },
                        { field: "reg_number", headerName: "钢印号" },
                        { field: "grantee", headerName: "移交人" },
                        { field: "grant_department", headerName: "移交部门" },
                        { field: "department", headerName: "门店" },
                        {
                            field: "stockmen",
                            headerName: "持有人",
                        },


                        { field: "archivesid", headerName: "钢瓶档案ID" },



                        { field: "residualweight", headerName: "余气重量" },
                        { field: "residualreason", headerName: "余气原因" },
                        { field: "nature", headerName: "性质" },


                        { field: "state", headerName: "状态" },


                        { field: "grant_serial", headerName: "移交单据号" },


                        { field: "remarks", headerName: "备注" },

                    ]}
                    onGridReady={(e) => {
                        e.api.sizeColumnsToFit();
                    }}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                    }}
                    onCellClicked={async (e) => {
                        console.log(e);
                        if (e.colDef.headerName === "持有人") {

                            //查询会员信息 并跳转
                            const rew = await request("post", "/api/getInfo", {
                                memberid: e.value,
                                url: "Srapp.Web_User_Infos.UserBasicInfo",
                            });

                            if (rew.code === 200) {
                                // console.log('propsss',props)

                                props.BindUser(rew.data);
                                // localstorage 记录搜索信息 memberid 数组形式 最长100条
                                let memberid = localStorage.getItem("memberid");
                                if (memberid) {
                                    memberid = JSON.parse(memberid);
                                    const index = memberid.findIndex(
                                        (item) => item.memberid === e.value
                                    );
                                    if (index === -1) {
                                        memberid.push({
                                            memberid: e.value,
                                            time: new Date().getTime(),
                                        });
                                    } else {
                                        memberid[index].time = new Date().getTime();
                                    }
                                } else {
                                    memberid = [
                                        {
                                            memberid: e.value,
                                            time: new Date().getTime(),
                                        },
                                    ];
                                }
                                localStorage.setItem(
                                    "memberid",
                                    JSON.stringify(memberid)
                                );
                                navigate("/users/UserBasicInfo");
                            } else {
                                props.BindUser("");
                            }
                        }

                    }}
                />
            </Box>
        </Box>
    );
};

const mapDispatchToProps = (dispatch) => {
    console.log("BindUser", dispatch);
    return {
        BindUser: (data) =>
            dispatch({
                type: "binduser",
                user: data,
            }),
    };
};

export default connect(null, mapDispatchToProps)(MaterialCirculationRecord);
