import React, {useRef} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {toast} from "react-toastify";
import {getCode} from "../../utils/getCode";

const HandleMaterial = () => {
    const api = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18}>处理包装物物资</Box>

            <Form getFormApi={e=>api.current = e} onSubmit={async e=> {

                const rew = await request('post','/api/getInfo',{
                    ...e,
                    url: 'Srapp.Web_Material_Handle.HandleMaterial',
                    codejson: JSON.stringify(e.codejson)
                })
                if (rew.data.msg !== 'ERROR') {
                    api.current.setValue('codejson','')
                    api.current.setValue('remarks','')
                    toast.success('成功')
                } else {
                    toast.error(`失败${rew.data.tips}`)
                }
            }}>
                <Form.TagInput field={'codejson'} onChange={async e=>{
                    let arr = []
                    for (const i in e) {
                        let str = await getCode(e[i])
                        arr.push(str.code)
                    }
                    api.current.setValue('codejson',arr)
                }} label={'识别码'} />
                <Form.Select field={'mode'} label={'状态'} initValue={'送检处理'}>
                    <Form.Select.Option value={'送检处理'}>送检处理</Form.Select.Option>
                    <Form.Select.Option value={'报废处理'}>报废处理</Form.Select.Option>
                </Form.Select>
                <Form.Input field={'remarks'} label={'备注'} />


                <Button type={"submit"} variant={"contained"} sx={{mt:1}}>确认</Button>
            </Form>
        </Box>
    );
};

export default HandleMaterial;
