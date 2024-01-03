import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Select, Spin } from '@douyinfe/semi-ui';
import { IconLoading } from '@douyinfe/semi-icons';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    MenuItem,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    useMediaQuery,
    TextField
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/social-google.svg';
import request from "../../../../utils/request";
import pinyin from 'pinyin';


// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
    const theme = useTheme();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [departmentList, setDepartmentList] = useState([])
    const [departmentid, setdepartmentid] = useState(localStorage.getItem('department'))

    useEffect(async () => {

        const rew = await request("post", '/api/GetComDepartmentList', {
            companyid: 101
            // companyid: 902
        })
        // console.log(rew)
        if (rew.code === 200) {
            const arr = rew.data.map(item => {
                return {
                    value: item.value,
                    label: getInitials(item.label) + item.label
                }
            })
            // arr 通过label首字母排序
            arr.sort((a, b) => {
                return a.label.charCodeAt(0) - b.label.charCodeAt(0)
            })


            // console.log(arr)
            setDepartmentList(arr)
        }
        // console.log(rew);
    }, [])
    const [loading, setLoading] = useState(false)

    function getInitials(chineseText) {
        const pinyinTextArray = pinyin(chineseText, { style: 'normal' });
        // console.log(pinyinTextArray)
        const initials = pinyinTextArray[0][0];
        return initials.toUpperCase().substring(0, 1);
    }


    return (
        <>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    seatno: '',
                    submit: null,

                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().max(255).required('请输入员工工号'),
                    // password: Yup.string().max(6).required('请输入员工密码')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    // 显示loading
                    // console.log(values);
                    // 弹窗显示登录中

                    setTimeout(() => {
                        setLoading(true)
                    }, 500)

                    setTimeout(() => {
                        setLoading(false)
                    }, 1500)
                    const rew = await request('post', '/api/login', {

                        department: departmentid,
                        password: values.password,
                        seatno: values.seatno || 101,
                        username: values.username
                    })


                    // return
                    // return

                    // console.log('login', rew);
                    const res = rew.info.data
                    // console.log(res);

                    localStorage.setItem('token', res.info.token)
                    localStorage.setItem('seatno', values.seatno)
                    localStorage.setItem('refresh_token', res.info.refresh_token)
                    localStorage.setItem('expire_time', res.info.expire_time)
                    localStorage.setItem('refresh_token_expires', res.info.refresh_token_expires)
                    localStorage.setItem('userinfo', JSON.stringify(res.ope))
                    localStorage.setItem('department', departmentid)



                    window.location.href = "/"

                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth
                            error={Boolean(touched.username && errors.username)}
                            sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">员工工号</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.username}
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.username && errors.username && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.username}
                                </FormHelperText>
                            )}
                        </FormControl>



                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">员工密码</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth
                            sx={{
                                mt: 2
                            }}>

                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={departmentid}
                                prefix="当前站点"
                                filter
                                size="large"
                                name="department"
                                onChange={e => setdepartmentid(e)}
                            >
                                {departmentList.map((item) => <Select.Option key={item.value}
                                    value={item.value}>{item.label}</Select.Option>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth
                            sx={{
                                mt: 2
                            }}>
                            <InputLabel htmlFor="outlined-adornment-password-login"
                                id="demo-simple-select-label">坐席号</InputLabel>
                            <TextField onChange={handleChange} value={values.seatno} name="seatno" label="坐席号" />
                        </FormControl>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    // disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >

                                    {
                                        loading ? <Box display={'flex'} alignItems={'center'}><Box mr={2}>登录中</Box>  <Spin delay={1000} spinning={loading}></Spin></Box> : '登录'
                                    }

                                </Button>


                            </AnimateButton>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>


                                <Button
                                    disableElevation
                                    // disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="button"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        window.location.reload()
                                    }}
                                >
                                    刷新
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseLogin;
