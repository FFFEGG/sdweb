import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import UserInfo from "./UserInfo";
import {Popconfirm} from "@douyinfe/semi-ui";
import request from "../../../utils/request";
import {toast} from "react-toastify";

const CreateUserPackingtypeArchives = ({customization}) => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    const [userinfo, setuserinfo] = useState('')
    const [formdata, setformdata] = useState({
        property_unit: '广西三燃',
        code: '',
        manufacturing_unit: '',
        packingtypeid: '',
        reg_number: '',
        province: '',
        production_number: '',
        lasttestdate: '',
        nexttestdate: '',
        volume: '',
        wall_thickness: '',
        nominal_pressure: '',
        material: '',
        suttle: '',
        type: '',
        weight: '',
        remarks: '',
    })
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])
    return (
        <Box sx={{width: '100%', background: '#FFF'}}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo}/>
            </Box>
            <Typography fontSize={18} px={3}>创建用户代充瓶包装物档案信息</Typography>
            <Box p={3} bgcolor="#fff" borderRadius={1}>



               <TextField value={formdata.property_unit} onChange={e=>setformdata({...formdata,property_unit: e.target.value})} label="产权单位" sx={{width: 200}}/>
                <TextField value={formdata.code} onChange={e=>setformdata({...formdata,code: e.target.value})} label="识别码" sx={{width: 200}}/>
                <TextField value={formdata.manufacturing_unit} onChange={e=>setformdata({...formdata,manufacturing_unit: e.target.value})}  label="制造单位" sx={{width: 200}}/>
                <FormControl sx={{width: 200}}>
                    <InputLabel>包装物类型</InputLabel>
                    <Select  value={formdata.packingtypeid} onChange={e=>setformdata({...formdata,packingtypeid: e.target.value})}  label="包装物类型">
                        {
                            initData.PackingtypeList.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)
                        }

                    </Select>
                </FormControl>

                <TextField value={formdata.reg_number} onChange={e=>setformdata({...formdata,reg_number: e.target.value})} label="登记编号（钢印）" sx={{width: 200}}/>
                <TextField type="date" value={formdata.date4manufacture} onChange={e=>setformdata({...formdata,date4manufacture: e.target.value})} label="生产日期" sx={{width: 200}}/>
                <TextField value={formdata.production_number} onChange={e=>setformdata({...formdata,production_number: e.target.value})} label="出厂编号" sx={{width: 200}}/>
                <TextField type="date" value={formdata.lasttestdate} onChange={e=>setformdata({...formdata,lasttestdate: e.target.value})} label="最近检测日期" sx={{width: 200}}/>
                <TextField type="date" value={formdata.nexttestdate} onChange={e=>setformdata({...formdata,nexttestdate: e.target.value})} label="下次检测日期" sx={{width: 200}}/>
                <TextField value={formdata.volume} onChange={e=>setformdata({...formdata,volume: e.target.value})} label="容积（L）" sx={{width: 200}}/>
                <TextField value={formdata.wall_thickness} onChange={e=>setformdata({...formdata,wall_thickness: e.target.value})} label="设计壁厚（MM）" sx={{width: 200}}/>
                <TextField value={formdata.nominal_pressure} onChange={e=>setformdata({...formdata,nominal_pressure: e.target.value})} label="公称压力(Mpa)" sx={{width: 200}}/>
                <TextField value={formdata.material} onChange={e=>setformdata({...formdata,material: e.target.value})} label="材料" sx={{width: 200}}/>
                <TextField value={formdata.suttle} onChange={e=>setformdata({...formdata,suttle: e.target.value})} label="充装量" sx={{width: 200}}/>
                <TextField value={formdata.weight} onChange={e=>setformdata({...formdata,weight: e.target.value})} label="重量" sx={{width: 200}}/>
                <FormControl sx={{width: 200}}>
                    <InputLabel>类型</InputLabel>
                    <Select value={formdata.type} onChange={e=>setformdata({...formdata,type: e.target.value})} label="类型">
                        <MenuItem value="重">重</MenuItem>
                        <MenuItem value="空">空</MenuItem>
                    </Select>
                </FormControl>
                <TextField value={formdata.remarks} onChange={e=>setformdata({...formdata,remarks: e.target.value})} label="备注" sx={{width: 200}}/>
            </Box>

            <Box px={3} pb={3}>

                <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Handle.CreateUserPackingtypeArchives',
                        userid: userinfo.userid,
                        ...formdata
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error(`操作失败 ${rew.data.tips}`)
                    }
                }}>

                    <Button variant="contained">确认操作</Button>
                </Popconfirm>
            </Box>
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(CreateUserPackingtypeArchives);
