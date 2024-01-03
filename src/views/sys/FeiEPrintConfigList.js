import React, { useEffect, forwardRef } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import {
     Autocomplete,
     Box,
     Button,
     Card,
     FormControl,
     MenuItem,
     Select,
     Table,
     TextField,
     Typography
} from "@mui/material";
import request from "../../utils/request";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { InputLabel } from "@material-ui/core";
import { Form } from "@douyinfe/semi-ui";


const FeiEPrintConfigList = () => {
     const [list, setList] = React.useState([]);
     const initData = JSON.parse(localStorage.getItem('initData'))

     const getlist = async () => {
          setList([])
          const response = await request('post', '/api/sysGetList', {
               url: 'FeiEPrintConfigList'
          })
          console.log(response);
          setList(response.data.info);
     }
     useEffect(async () => {
          getlist();
     }, [])
     const { register, handleSubmit, setValue, control, reset, getValues } = useForm({

     });

     const [open, setOpen] = React.useState(false);
     const [formdata, setformdata] = React.useState('');


     const handleClickOpen = () => {
          setOpen(true);
     };

     const handleClose = () => {
          setOpen(false);
     };



     const submit = async (data) => {

          const rew = await request('post', '/api/getInfo', {
               ...formdata,
               url: 'Srapp.Web_SystemSetting.SettingFeiEPrintConfig'
          })
          if (rew.code === 200) {
               toast('操作成功');
               handleClose();
          }
          console.log(rew);
     }


     const Edit = (data) => {
          console.log(data.data)
          data.data.action = 'UPDATE'
          setformdata(data.data)
          handleClickOpen()
     }
     const Add = () => {

          setformdata({
               action: 'ADD',
               id: 0
          })
          handleClickOpen()
     }

     const { Option } = Form.Select;

     return (
          <form>
               <NavCard title="飞鹅打印机列表" subtitle="系统参数设置" />
               <Card sx={{
                    mt: 1,
                    p: 2

               }}>
                    <Box height="60vh" overflow={'scroll'}>
                         <Box display={"flex"} mb={3}>
                              <Button onClick={() => getlist()} variant={"contained"}>刷新</Button>
                              <Button onClick={() => Add()} variant={"contained"} sx={{ ml: 2 }}>新增</Button>
                         </Box>

                         <AgGridReact
                              rowData={list}
                              reactUi="true"
                              className="ag-theme-balham"

                              columnDefs={[
                                   // {
                                   //      "id": "1",
                                   //      "companyid": "101",
                                   //      "name": "移动B",
                                   //      "sn": "815001655",
                                   //      "keys": "T9pXsi7T",
                                   //      "endtime": "2019-08-01 00:00:00.000",
                                   //      "opeid": "SJ033",
                                   //      "remarks": "",
                                   //      "sort": "1",
                                   //      "state": "正常",
                                   //      "operator": "曹毅"
                                   //  }
                                   { headerName: 'id', field: 'id' },
                                   { headerName: '名称', field: 'name' },
                                   { headerName: 'sn', field: 'sn' },
                                   { headerName: 'keys', field: 'keys' },
                                   { headerName: 'endtime', field: 'endtime' },
                                   { headerName: 'opeid', field: 'opeid' },
                                   { headerName: 'remarks', field: 'remarks' },


                                   { headerName: '排序', field: 'sort' },
                                   { headerName: '状态', field: 'state' },
                                   {
                                        headerName: "操作", cellRendererFramework: (rowData) => (
                                             <Button onClick={() => Edit(rowData)}>编辑</Button>
                                        ),
                                   },
                              ]}
                              defaultColDef={{
                                   flex: 1,

                                   resizable: true,
                                   sortable: true,
                              }}

                         />
                    </Box>

               </Card>
               <Dialog

                    maxWidth="md"
                    open={open}
                    onClose={handleClose}
               >
                    <DialogContent>
                         <Typography fontSize={18} mb={3}>飞鹅打印机新增/修改</Typography>

                         <Form layout='vertical' initValues={formdata} onValueChange={values => setformdata(values)}>

                              <Form.Input field='name' label='打印机名称' />

                              <Form.Input field='sn' label='打印机SN' />
                              <Form.Input field='keys' label='打印机KEY' />
                              <Form.Input field='endtime' type='date' label='结束时间' />
                              <Form.Select filter style={{ width: '100%' }} field='opeid' label='使用人OPEID' >
                                   {
                                        initData.OperatorList.map(item => <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                                   }
                              </Form.Select>
                              <Form.Input field='remarks' label='备注' />

                              <Form.Input field='sort' label='排序' />

                              <Form.Select zIndex={999999} field="state" label='状态' >
                                   <Option value="正常">正常</Option>
                                   <Option value="取消">取消</Option>
                              </Form.Select>




                         </Form>

                    </DialogContent>
                    <DialogActions>
                         <Button onClick={handleSubmit(submit)}>确认添加/修改</Button>
                         <Button onClick={handleClose}>关闭</Button>
                    </DialogActions>
               </Dialog>
          </form>
     );
}

export default FeiEPrintConfigList;
