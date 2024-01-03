import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import QRCode from 'qrcode.react';
import CryptoJS from 'crypto-js'
import { AgGridReact } from "ag-grid-react";


import { Tooltip, Toast, Form, Modal } from "@douyinfe/semi-ui";
import copy from "copy-to-clipboard";

const List = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     return (<Box p={3} bgcolor={'#fff'} borderRadius={1}>
          <Box mb={3} fontSize={18}>部门列表</Box>
          <Box display={'flex'} flexWrap={'wrap'} textAlign={'center'} fontSize={18}>
               {/* {
                    initData?.DepartmentList.map((item, index) => <Box mr={5} mb={5}>
                         <QRCode

                              id="qrCode"
                              value={CryptoJS.AES.encrypt(JSON.stringify({
                                   departmentid: item.id,
                                   department: item.name,
                                   key2: item.datakey,
                                   key1: item.signkey
                              }), 'JmYcAEiTql5EEyPW').toString()}
                              size={300} // 二维码的大小
                              fgColor="#000000" // 二维码的颜色
                              style={{ borderRadius: '10px' }}
                         />
                         <Box>{item.name}</Box>
                    </Box>)
               } */}
               <Box height={'60vh'} width={'100vw'} overflow={'scroll'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         rowData={initData.DepartmentList}
                         defaultColDef={{
                              flex: 1,

                              resizable: true,
                              sortable: true,
                              filter: 'agTextColumnFilter',
                              floatingFilter: true,

                         }}
                         columnDefs={[
                              { field: 'id', headerName: '部门id', sortable: true, },
                              { field: 'name', headerName: '部门名称', sortable: true, },
                              {
                                   headerName: "二维码", cellRendererFramework: ({ data }) =>
                                        <Tooltip
                                             position="left"
                                             trigger="click"
                                             onVisibleChange={(e) => {
                                                  if (e) {
                                                       copy(CryptoJS.AES.encrypt(JSON.stringify({
                                                            departmentid: data.id,
                                                            department: data.name,
                                                            key2: data.datakey,
                                                            key1: data.signkey
                                                       }), 'JmYcAEiTql5EEyPW').toString())
                                                       Toast.success({
                                                            content: '复制二维码信息成功',
                                                            duration: 3,
                                                       })
                                                  }

                                             }}
                                             content={
                                                  <QRCode

                                                       id="qrCode"
                                                       value={CryptoJS.AES.encrypt(JSON.stringify({
                                                            departmentid: data.id,
                                                            department: data.name,
                                                            key2: data.datakey,
                                                            key1: data.signkey
                                                       }), 'JmYcAEiTql5EEyPW').toString()}
                                                       size={136} // 二维码的大小
                                                       fgColor="#000000" // 二维码的颜色
                                                       style={{ borderRadius: '10px' }}
                                                  />}>
                                             <Button size="small" variant="outlined">点击复制</Button>
                                        </Tooltip>
                              }
                         ]}

                    />
               </Box>

          </Box>

     </Box>);
}

export default List;