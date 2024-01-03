import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const SYQGYQUserAllocateAndTransferRecord = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const [keys, setKeys] = useState([])
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     const pf = (str) => {
          if (srt) {
               return parseFloat(str).toFixed(2)
          }
          return 0
     }
     const api = useRef(null);


     return <Box p={3} bgcolor={'#fff'} borderRadius={1}>
          <Box fontSize={18} mb={3}>商用气工业气用户调拨记录</Box>
          <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQGYQUserAllocateAndTransferRecord',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    salesman: JSON.stringify(e.salesman)
               })


               setList(rew.data.info)


          }}>
               <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

               <Form.Input field="memberid" label="会员号" type="number" />

               <Form.Select field="salesman" label="业务员" multiple filter maxTagCount={2}>
                    {
                         initData.OperatorList.filter(item => item.departmentid === loginuser.login_departmentid).map(item =>
                              <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                         )
                    }
               </Form.Select>
               <Box>
                    <Button size="small" variant="outlined" type="submit">搜索</Button>

               </Box>



          </Form>

          <Box height={'60vh'} mt={3} overflow={"scroll"}>
               <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={

                         [
                              { headerName: '时间', field: 'addtime', width: 150, sortable: true, filter: true },
                              { headerName: '会员号', field: 'memberid', width: 150, sortable: true, filter: true },
                              { headerName: '工作单位', field: 'workplace', width: 150, sortable: true, filter: true },
                              { headerName: '商品名称', field: 'goodsname', width: 150, sortable: true, filter: true },
                              // { headerName: '包装类型', field: 'packingtype', width: 150, sortable: true, filter: true },
                              { headerName: '销售数量', field: 'num', width: 150, sortable: true, filter: true },
                              { headerName: '空瓶', field: 'return_num', width: 150, sortable: true, filter: true },
                              { headerName: '票据', field: 'billnum', width: 150, sortable: true, filter: true },
                              { headerName: '存瓶', field: 'cpnum', width: 150, sortable: true, filter: true },
                              { headerName: '配送部门', field: 'department', width: 150, sortable: true, filter: true },
                              { headerName: '经手人', field: 'deliveryman', width: 150, sortable: true, filter: true },
                         ]
                    }

               />
          </Box>

     </Box>;
}

export default SYQGYQUserAllocateAndTransferRecord;