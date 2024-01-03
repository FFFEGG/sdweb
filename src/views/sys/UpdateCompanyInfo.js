import { Form } from '@douyinfe/semi-ui';
import { Box, Button } from '@mui/material';
import React from 'react';
import { toast } from 'react-toastify';
import request from 'utils/request';
/**
 * 
 * url : Srapp.Web_SystemSetting.UpdateCompanyInfo
        更新当前公司信息
        参数名字	类型	是否必须	默认值	其他	说明
        name	字符串	必须		最大：75	公司名称
        telephone	字符串	必须		最大：75	公司电话
        verify_user_packingtype	枚举类型	必须		范围：是/否	验证包装物状态（是,否）
        effective_time	日期	必须			有效时间
        cancel_days	整型	可选	1		撤销时长
        scanmode	枚举类型	必须		范围：0/1/2	0不限制，1只读取二维码，2只读取一维码
        appversion	字符串	必须			App版本号 {"version":"","force":1}
        state	枚举类型	必须		范围：正常/取消	状态（正常,取消）
        token	字符串	必须			token
 */
const UpdateCompanyInfo = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))

    return (
        <Box bgcolor={'white'} p={3} borderRadius={1}>
            <Box fontSize={18}>更新当前公司信息</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_SystemSetting.UpdateCompanyInfo',
                    ...e,
                })
                if (rew.data.msg === 'SUCCESS') {
                    toast.success('更新成功')
                } else {
                    toast.error('更新失败')
                }
                // console.log(rew);
            }}>
                <Form.Input label={'公司名称'} field={'name'} initValue={initData.CompanyInfo.name} />
                <Form.Input label={'公司电话'} field={'telephone'} initValue={initData.CompanyInfo.telephone} />
                <Form.Select label={'验证包装物状态'}
                    field={'verify_user_packingtype'}
                    initValue={initData.CompanyInfo.verify_user_packingtype === '1' ? '是' : '否'}
                    style={{ width: '100%' }}
                >
                    <Form.Select.Option value="是">是</Form.Select.Option>
                    <Form.Select.Option value="否">否</Form.Select.Option>
                </Form.Select>
                <Form.DatePicker label={'有效时间'} field={'effective_time'} type='date' initValue={initData.CompanyInfo.effective_time} />
                <Form.Input label={'撤销时长'} field={'cancel_days'} initValue={initData.CompanyInfo.cancel_days} />
                <Form.Select label={'扫码模式'}
                    field={'scanmode'}
                    initValue={initData.CompanyInfo.scanmode}
                    style={{ width: '100%' }}
                >
                    <Form.Select.Option value="0">不限制</Form.Select.Option>
                    <Form.Select.Option value="1">只读取二维码</Form.Select.Option>
                    <Form.Select.Option value="2">只读取一维码</Form.Select.Option>
                </Form.Select>
                <Form.TextArea label={'App版本号'} field={'appversion'} initValue={JSON.stringify(initData.CompanyInfo.appversion)} />
                <Form.Select label={'状态'}
                    field={'state'}
                    initValue={initData.CompanyInfo.state}
                    style={{ width: '100%' }}
                >
                    <Form.Select.Option value="正常">正常</Form.Select.Option>
                    <Form.Select.Option value="取消">取消</Form.Select.Option>
                </Form.Select>

                <Button variant="contained" type="submit">确认更新</Button>
            </Form>


        </Box>
    );
};

export default UpdateCompanyInfo;