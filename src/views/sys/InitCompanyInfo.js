import React from 'react';
import {Box} from "@mui/system";
import {Button, Typography} from "@mui/material";
import {Form, Modal, Toast} from "@douyinfe/semi-ui";
import request from "../../utils/request";
import {toast} from "react-toastify";

const InitCompanyInfo = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} borderRadius={3} bgcolor={'#fff'}>
            <Typography fontSize={20} fontWeight={"bold"} mb={3}>初始化公司信息</Typography>

            <Form style={{width: '50vw'}} onSubmit={async (e) => {
                Modal.confirm({
                    'title': '提示', 'content': '确认提交信息', 'onOk': async () => {
                        const rew =await request('post','/api/getInfo',{
                            url: 'Srapp.Web_SystemSetting.InitCompanyInfo',
                            ...e
                        })

                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('添加成功')
                        } else {
                            toast.error(`初始化失败 ${rew.data.tips}`)
                        }
                    }
                });

            }}>
                <Form.Input field='companyid' label={'companyid'}/>
                <Form.Input field='name' label={'公司名称'}/>
                <Form.Input field='telephone' label={'公司电话'}/>
                <Form.RadioGroup initValue={'否'} field={'verify_user_packingtype'} label={'验证包装物状态'}>
                    <Form.Radio value={'是'}>是</Form.Radio>
                    <Form.Radio value={'否'}>否</Form.Radio>
                </Form.RadioGroup>

                <Form.Input field={'effective_time'} label={'有效时间'} type={'date'}/>

                <Form.Input field={'cancel_days'} label={'撤销时长'} type={'number'} initValue={1}/>
                <Form.RadioGroup initValue={'否'} field={'scanmode'} label={'扫描方式'}>
                    <Form.Radio value={0}>不限制</Form.Radio>
                    <Form.Radio value={1}>只读取二维码</Form.Radio>
                    <Form.Radio value={2}>只读取一维码</Form.Radio>
                </Form.RadioGroup>

                <Form.Select label={'状态'} initValue={'正常'} field={'state'}>
                    <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                    <Form.Select.Option value={'取消'}>取消</Form.Select.Option>
                </Form.Select>
                <Button variant={"contained"} type={'submit'}>确认提交信息</Button>
            </Form>
        </Box>
    );
};

export default InitCompanyInfo;
