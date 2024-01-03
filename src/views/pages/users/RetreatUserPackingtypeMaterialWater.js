import React, {useCallback, useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";

import request from "../../../utils/request";
import {AgGridReact} from "ag-grid-react";
import {Popconfirm} from "@douyinfe/semi-ui";
import {getCode} from "../../../utils/getCode";
import {toast} from "react-toastify";
import myprint from "../../../utils/myprint";


const RetreatUserPackingtypeMaterialWater = ({userinfo,list,getlist}) => {
    const [type, settype] = useState('票据')
    const [code, setcode] = useState('')
    const [remarks, setremarks] = useState('')
    const [residual, setresidual] = useState(0)
    const [packingtypwarehouseserial, setpackingtypwarehouseserial] = useState('')
    const [packingtypwarehouseid, setpackingtypwarehouseid] = useState('')
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [isprint, setisprint] = useState('打印')
    const [materiallist, setmateriallist] = useState([])
    useEffect(() => {
        console.log('userinfosss', userinfo)  // userinfo is undefined
    }, [userinfo]);
    const plgridRef = React.useRef();
    const onSelectionChanged = useCallback(() => {
        const selectedRows = plgridRef.current.api.getSelectedRows();
        // console.log(selectedRows);
        setmateriallist(selectedRows)
        setpackingtypwarehouseserial(selectedRows.map((item) => item.serial).join(','))
        setcode('000000')
    }, []);

    return <div>
        <Box mt={2} height="30vh">
            <AgGridReact
                reactUi="true"
                className="ag-theme-balham"
                ref={plgridRef}
                columnDefs={[
                    { field: 'addtime', headerName: '办理时间',checkboxSelection: true, headerCheckboxSelection: true, },
                    { field: 'serial', headerName: '订单号', },
                    { field: 'mode', headerName: '办理方式', },
                    { field: 'name', headerName: '商品名称', },
                    { field: 'packingtype', headerName: '包装物', },
                    { field: 'num', headerName: '数量', },
                    { field: 'billingmode', headerName: '计费方式', },
                    { field: 'billno', headerName: '票据号', },
                    { field: 'price', headerName: '价格', },
                    { field: 'remarks', headerName: '备注', },
                    { field: 'department', headerName: '办理部门', },
                    { field: 'department_use', headerName: '使用部门', },
                    { field: 'operator_use', headerName: '使用人', },
                    { field: 'usetime', headerName: '使用时间', },
                    { field: 'state', headerName: '状态', },
                ]}
                rowSelection="multiple"
                rowData={list}
                defaultColDef={{
                    flex: 1,
                    resizable: true,
                    sortable: true,
                    filter: 'agTextColumnFilter',
                    floatingFilter: true,
                }}
                onSelectionChanged={onSelectionChanged}
                // onRowClicked={data => {
                //     setpackingtypwarehouseserial(data.data.serial)
                //     setpackingtypwarehouseid(data.data.id)
                //     setcode(data.data.billno)
                // }}
                // onGridReady={params => {
                //     params.api.sizeColumnsToFit();
                // }}
                getRowStyle={params => {
                    if (params.data && params.data.state === '已使用') {
                        return { color: "red" }
                    }

                    return { color: "black" }
                }}
            />
        </Box>

        <Box>
            <TextField value={packingtypwarehouseserial} label="单据号" fullWidth sx={{ mt: 2 }}
                       InputLabelProps={{ shrink: true }} />

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>票据类型</InputLabel>
                <Select value={type} onChange={(data) => settype(data.target.value)} label="票据类型">
                    <MenuItem value="票据">票据</MenuItem>
                    <MenuItem value="物品">物品</MenuItem>
                </Select>
            </FormControl>
            <TextField value={code} onChange={(data) => setcode(data.target.value)} label="票据号或者物资识别号" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
            <TextField value={residual} onChange={(data) => setresidual(data.target.value)} label="回收余气/公斤（可选）" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />

            <TextField value={remarks} id="remarks" onChange={(data) => setremarks(data.target.value)} label="备注" fullWidth
                       sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
            <Box marginTop={1} marginBottom={1}>
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    size="small"
                    value={isprint}
                    onChange={(e, data) => {
                        // console.log(data)
                        // setsalesmethods(data)
                        // 记录是否打印 本地
                        // localStorage.setItem('isprint', data)
                        setisprint(data)
                    }}
                >
                    <ToggleButton value="打印">打印</ToggleButton>
                    <ToggleButton value="不打印">不打印</ToggleButton>

                </ToggleButtonGroup>
            </Box>

            <Box display={'flex'} flexWrap={'wrap'}>

                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('退备用瓶')}>退备用瓶</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('铺面倒闭')}>铺面倒闭</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('经营不下，铺面转让')}>经营不下，铺面转让</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('铺面合同到期')}>铺面合同到期</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('工地项目完工')}>工地项目完工</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('退大换小')}>退大换小</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('退小换大')}>退小换大</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('改用管道燃气')}>改用管道燃气</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('改用电')}>改用电</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('改用环保油')}>改用环保油</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('嫌送气慢')}>嫌送气慢</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('服务态度不满')}>服务态度不满</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('铺面拆迁')}>铺面拆迁</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('因价格换外公司气')}>因价格换外公司气</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('改家用，不完全退户')}>改家用，不完全退户</Box>
                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => {
                    setremarks('')
                    //光标移动到备注
                    document.getElementById('remarks').focus()
                }}>其他原因</Box>



            </Box>
            <Popconfirm title="提示" content="确认办理？" onConfirm={async () => {
                let str = await getCode(code)
                // console.log('str',str)
                // 循环提交
                for (let i = 0; i < materiallist.length; i++) {
                    setTimeout(async ()=>{
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_BusinessProcessing_Handle.RetreatUserPackingtypeMaterial',
                            userid: userinfo.userid,
                            packingtypwarehouseid: materiallist[i].id,
                            packingtypwarehouseserial: materiallist[i].serial,
                            type,
                            code: str.code,
                            residualweight: residual
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('办理成功！')
                            getlist()
                            if (rew.data.printinfo && isprint === '打印') {
                                myprint(rew.data.printinfo)
                            }
                        } else {
                            toast.error(`办理失败！${rew.data.tips}`)
                        }
                    }, i*500)
                }




            }}><Button sx={{ mt: 2 }} variant="contained">确认办理</Button></Popconfirm>
        </Box>
    </div>
};

export default RetreatUserPackingtypeMaterialWater;
