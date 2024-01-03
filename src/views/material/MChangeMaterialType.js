import React, {Component, useState} from 'react';
import {Box} from "@mui/system";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import {Popconfirm} from "@douyinfe/semi-ui";
import request from "../../utils/request";
import {toast} from "react-toastify";
import {getCode} from "../../utils/getCode";


const MChangeMaterialType = () => {
    const [list, setlist] = useState([])
    const [code, setcode] = useState('')
    const [type, settype] = useState('空(新)转重')
    return (
        <Box borderRadius={1} bgcolor="#fff" p={3}>
            <Typography fontSize={18} width="100%">转换包装物物资类型</Typography>
            <Box display="flex" mt={3}>
                <TextField onKeyDown={(e) => {
                    if (e.code === 'Enter') {
                        const index = list.indexOf(code)
                        console.log(index)
                        if (index === -1 && code !== '') {
                            setlist([...list, code])
                            setcode('')
                        } else {
                            setcode('')
                        }
                    }
                }} value={code} onChange={async e => {
                    const str = await getCode(e.target.value)
                    setcode(str.code)
                }} sx={{width: 300}} label="钢瓶识别码"/>
                <FormControl>
                    <InputLabel>类型</InputLabel>
                    <Select value={type} onChange={e => settype(e.target.value)} sx={{width: 300}} label="类型">
                        <MenuItem value="空(新)转重">空(新)转重</MenuItem>
                        <MenuItem value="重转空">重转空</MenuItem>
                    </Select>
                </FormControl>

            </Box>

            <Box mt={3} border={1} borderRadius={1} borderColor="#CCC" p={3} mb={3}>
                {
                    list.map(item => <Button sx={{width: 200, marginRight: 1}} variant="outlined">{item}</Button>)
                }
            </Box>




            <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Material_Handle.ChangeMaterialType',
                    codejson: JSON.stringify(list),
                    mode: type
                })
                if (rew.data.msg === 'SUCCESS') {
                    toast.success('操作成功')
                } else {
                    toast.success(`操作失败 ${rew.data.tips}`)
                }
                setlist([])
            }}>
                <Button variant="contained">
                    确认操作
                </Button>
            </Popconfirm>


            <Popconfirm title="提示" content="确认清空?" onConfirm={async () => {
               setlist([])
            }}>
                <Button variant="outlined" sx={{ ml: 3}} color="error">
                    清空列表
                </Button>
            </Popconfirm>
        </Box>
    );

}
export default MChangeMaterialType;
