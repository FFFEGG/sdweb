import React, {useEffect, forwardRef} from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import {Box, Button, Card, Table, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import request from "../../utils/request";
import { JSEncrypt } from 'jsencrypt'
// import ras from '../../utils/rsa_public_key.pem'

const ChangePassword = () => {
    const {register, handleSubmit} = useForm();

    const submit = async (data) => {

        const encrypt = new JSEncrypt();
        encrypt.setPublicKey('MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGdxv1Qge87+wN8yK9VF5YcIygIQcu5PD/ESf+qrhIYuORW1C5/FiyebKKKAKEdNU2Um2E8kE9uvcyonj85XJppxPWLcZ32cv6UZNMwWwhaTk+XYxVE7ZBz+h9DGxwMXDiKyK5O9dr83iTACwAU+mrHxU50YB0yyy4M0G3qAXIFlAgMBAAE=');
        const password= encrypt.encrypt(JSON.stringify({
            oldpasswords: data.password,
            newpasswords: data.password1,
        }));
        if (data.password1 !== data.password2) {
            toast.error('两次密码不一致')
            return
        }
        const rew = await request('post', '/api/getInfo', {
            passwordstr: password,
            url: 'Srapp.Web_Ope.ChangePassword'
        })
        if (rew.data.msg !== 'SUCCESS') {
            toast.success(rew.data.tips)
        } else {
            toast.success('修改成功')
        }
        console.log(rew);
    }
    return (
        <form>
            <NavCard title="修改密码" subtitle="系统参数设置"/>
            <Card sx={{
                mt: 1,
                p: 2
            }}>
                <TextField {...register('password')} fullWidth sx={{mb: 2}} type="password" label="原密码"/>
                <TextField minRows={6} {...register('password1')} fullWidth sx={{mb: 2}} type="password" label="新密码"/>
                <TextField minRows={6} {...register('password2')} fullWidth sx={{mb: 2}} type="password" label="重复新密码"/>
                <Button onClick={handleSubmit(submit)} variant="contained">确认修改</Button>
            </Card>
        </form>
    );
}

export default ChangePassword;
