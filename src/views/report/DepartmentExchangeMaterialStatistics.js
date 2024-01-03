import React, { useState } from "react";
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import initData from "../initData";
import ComplexTable from "./ComplexTable";

const DepartmentExchangeMaterialStatistics = () => {
    const [list, setList] = useState([]);

    return (
        <Box p={3} bgcolor={"#fff"} borderRadius={1}>
            <Box fontSize={18} mb={3}>
                获取指定部门交换物资统计(员工交接/员工交接(签封))
            </Box>

            <Form
                onSubmit={async (e) => {
                    const rew = await request("post", "/api/getInfo", {
                        url: "Srapp.Web_Report_Material_Infos.DepartmentExchangeMaterialStatistics",
                        ...e,
                        department: JSON.stringify(e.department),
                        handler: JSON.stringify(e.hanlder),
                    });

                    setList(rew.data.info);
                }}
                layout={"horizontal"}
                labelPosition={"inset"}
            >
                <Form.Select
                    field={"department"}
                    label={"部门"}
                    multiple
                    maxTagCount={2}
                    filter
                >
                    {initData.DepartmentList.map((item) => {
                        return (
                            <Form.Select.Option value={item.name}>
                                {item.label}
                            </Form.Select.Option>
                        );
                    })}
                </Form.Select>



                <Form.Input
                    field={"begintime"}
                    label={"开始时间"}
                    type={"date"}
                    initValue={moment().format("YYYY-MM-DD")}
                />
                <Form.Input
                    field={"endtime"}
                    label={"结束时间"}
                    type={"date"}
                    initValue={moment().format("YYYY-MM-DD")}
                />
                <Form.Select
                    field={"hanlder"}
                    label={"经办人"}
                    multiple
                    filter
                    maxTagCount={2}
                >
                    {initData.OperatorList.map((item) => {
                        return (
                            <Form.Select.Option value={item.name}>
                                {item.name}
                            </Form.Select.Option>
                        );
                    })}
                </Form.Select>
                <Button type={"submit"} variant={"outlined"} size={"small"}>
                    搜索
                </Button>
            </Form>

            <Box height={"60vh"} mt={3} overflow={"scroll"}>
                {/*<AgGridReact*/}
                {/*  className="ag-theme-balham"*/}
                {/*  rowData={list}*/}
                {/*  columnDefs={columnDefs}*/}
                {/*  defaultColDef={defaultColDef}*/}
                {/*  autoGroupColumnDef={autoGroupColumnDef}*/}
                {/*  onGridReady={onGridReady}*/}
                {/*  groupIncludeFooter={true}*/}
                {/*  groupIncludeTotalFooter={true}*/}
                {/*  groupDefaultExpanded={1}*/}
                {/*  groupMultiAutoColumn={true}*/}
                {/*  groupSuppressAutoColumn={true}*/}
                {/*  animateRows={true}*/}
                {/*  treeData={true}*/}
                {/*  getDataPath={(data) => [data.packingtype, data.id]}*/}
                {/*  onFirstDataRendered={(e) => e.api.sizeColumnsToFit()}*/}
                {/*/>*/}
                <ComplexTable    list={list} />
            </Box>
        </Box>
    );
};

export default DepartmentExchangeMaterialStatistics;
