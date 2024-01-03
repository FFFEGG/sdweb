import React, { useState } from "react";
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";


const BuyPackingtypeList = () => {
  const [list, setList] = useState([]);
  const initData = JSON.parse(localStorage.getItem('initData'))
  const loginuser = JSON.parse(localStorage.getItem('userinfo'))
  const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
  return (
    <Box p={3} bgcolor={"#fff"} borderRadius={1}>
      <Box fontSize={18} mb={3}>
        获取收购包装物列表
      </Box>

      <Form
        onSubmit={async (e) => {
          const rew = await request("post", "/api/getInfo", {
            url: "Srapp.Web_Report_Material_Infos.BuyPackingtypeList",
            ...e,
            department: JSON.stringify(e.department),
          });

          setList(rew.data.info);
        }}
        layout={"horizontal"}
        labelPosition={"inset"}
      >
        {/* <Form.Select
          field={"department"}
          label={"部门"}
          maxTagCount={3}
          multiple
          filter
        >
          {initData.DepartmentList.map((item) => (
            <Form.Select.Option value={item.name} key={item.name}>
              {item.label}
            </Form.Select.Option>
          ))}
        </Form.Select> */}
        <Form.TreeSelect maxTagCount={1} filter treeData={new_department_byname} filterTreeNode leafOnly multiple field={"department"} label={"部门"} />

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

        <Button type={"submit"} variant={"outlined"} size={"small"}>
          搜索
        </Button>
      </Form>

      <Box height={"60vh"} mt={3} overflow={"scroll"}>
        <AgGridReact
          className="ag-theme-balham"
          rowData={list}
          columnDefs={[
            {
              headerName: "序号",
              field: "serial",
            },
            {
              headerName: "性质",
              field: "nature",
            },
            {
              headerName: "物资名称",
              field: "property_unit",
            },
            {
              headerName: "规格型号",
              field: "reg_number",
            },
            {
              headerName: "生产日期",
              field: "date4manufacture",
            },
            {
              headerName: "销售单号",
              field: "serial_sale",
            },
            {
              headerName: "入库时间",
              field: "addtime",
            },
            {
              headerName: "包装物",
              field: "packingtype",
            },
            {
              headerName: "市场价",
              field: "marketprice",
            },
            {
              headerName: "收购价",
              field: "price",
            },
            {
              headerName: "部门",
              field: "department",
            },
            {
              headerName: "操作员",
              field: "operator",
            },
          ]}
          defaultColDef={{
            resizable: true,
            sortable: true,
          }}
          onFirstDataRendered={(e) => e.api.sizeColumnsToFit()}
        />
      </Box>
    </Box>
  );
};

export default BuyPackingtypeList;
