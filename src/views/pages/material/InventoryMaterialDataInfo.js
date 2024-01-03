import { Select } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import request from "utils/request";

const InventoryMaterialDataInfo = () => {

     const [list, setList] = useState([])
     const [list2, setList2] = useState([])
     const getlist = async () => {
          const rew = await request('post', '/api/getInfo', {
               url: 'Srapp.Web_Material_Infos.InventoryMaterialDataInfo',
               state
          })
          console.log(rew);
          setList(rew.data)

          // 分组 rew.data 按照 包装物类型 类型 数量
          let arr = {}
          rew.data.forEach(item => {
               if (arr[item.packingtype + item.type]) {
                    arr[item.packingtype + item.type].num++
               } else {
                    arr[item.packingtype + item.type] = {
                         num: 1,

                         packingtype: item.packingtype,
                         type: item.type,
                    }
               }
          })
          //arr 对象转数组
          setList2(Object.values(arr))
          // console.log();

     }
     const [state, setState] = useState('正常')
     return (<Box p={3} bgcolor={'#fff'} borderRadius={1}>
          <Box fontSize={18} mb={3}>盘点持有信息</Box>
          <Box display={'flex'}>
               <Select prefix="状态" value={state} onChange={e => setState(e)}  >
                    <Select.Option value={'正常'}>正常</Select.Option>
                    <Select.Option value={'已完成'}>已完成</Select.Option>
               </Select>
               <Button sx={{ ml: 2 }} variant="outlined" size="small" onClick={getlist} >查询</Button>

          </Box>


          <Box height={'45vh'} overflow={'scroll'} mt={3}>
               <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                         // {
                         //      "id": "1",
                         //      "companyid": "101",
                         //      "archivesid": "186125",
                         //      "gid": "B876673E933E42228C97445959051A1D",
                         //      "nature": "周转",
                         //      "packingtype": "YSP35.5型钢瓶",
                         //      "reg_number": "918388",
                         //      "code": "918388",
                         //      "trackingcode": "918388",
                         //      "packingweight": "16.5",
                         //      "type": "重",
                         //      "department": "业务测试门店",
                         //      "stockmen": "营业员",
                         //      "stockmen_opeid": "YW001",
                         //      "grant_serial": "800020230902160407899844920",
                         //      "grant_mode": "盘点入库",
                         //      "grant_time": "2023-09-02 16:04:07.000",
                         //      "grant_department": "业务测试门店",
                         //      "grantee": "营业员",
                         //      "grantee_opeid": "YW001"
                         //  }

                         { headerName: "性质", field: "nature" },
                         { headerName: "包装物类型", field: "packingtype" },
                         // { headerName: "登记编号", field: "reg_number" },
                         { headerName: "钢瓶码", field: "code" },
                         // { headerName: "追溯码", field: "trackingcode" },
                         { headerName: "包装物重量", field: "packingweight" },
                         { headerName: "类型", field: "type" },
                         { headerName: "持有人部门", field: "department" },
                         { headerName: "持有人", field: "stockmen" },
                         // { headerName: "库管员ID", field: "stockmen_opeid" },
                         // { headerName: "发放流水号", field: "grant_serial" },
                         { headerName: "发出方式", field: "grant_mode" },
                         { headerName: "发出时间", field: "grant_time" },
                         { headerName: "发出部门", field: "grant_department" },
                         { headerName: "发出人", field: "grantee" },

                    ]}
                    defaultColDef={{
                         resizable: true,
                         sortable: true,
                         filter: 'agTextColumnFilter',
                         floatingFilter: true
                    }}

               />
          </Box>
          <Box fontSize={18} mt={2}>
               <Box >统计</Box>

               {
                    list2.map(item => {
                         return <Box key={item.packingtype + item.type} display={'flex'} mt={1}>
                              <Box>{item.packingtype} - {item.type}: </Box>
                              <Box ml={1}>{item.num}</Box>
                         </Box>
                    })

               }

          </Box>


     </Box>);
}

export default InventoryMaterialDataInfo;