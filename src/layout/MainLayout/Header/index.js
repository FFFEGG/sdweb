import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonBase, Fab } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// assets
import { IconEdit, IconMenu2 } from '@tabler/icons';
import { useRef, useState } from "react";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { ref } from "yup";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    // console.log('loginuser',loginuser)
    if (loginuser == null) {
        window.location.href = '/login'
    }

    const api = useRef()
    const [show, setshow] = useState(false)
    const [addgg, setaddgg] = useState(false)
    const [list, setList] = useState([])
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >

                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>

            </Box>

            {/* header search */}
            <SearchSection />

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />
            {/*<Fab variant="extended" sx={{ mr: 1, boxShadow: "none" }} onClick={async () => {*/}
            {/*    setshow(true)*/}
            {/*    const rew = await request('post', '/api/getInfo', {*/}
            {/*        url: 'Srapp.Web_SystemInfo.BulletinBoardList'*/}
            {/*    })*/}
            {/*    setList(rew.data.info)*/}

            {/*}}>*/}

            {/*    系统公告*/}
            {/*</Fab>*/}
            {/*<Fab variant="extended" sx={{ mr: 1, boxShadow: "none" }}>*/}
            {/*    {loginuser.login_department}{loginuser.name}*/}
            {/*</Fab>*/}
            {/* notification & profile */}
            {/* <NotificationSection /> */}
            <ProfileSection />


            <Modal visible={show} style={{ width: '50vw', minHeight: '60vh' }} onCancel={() => setshow(false)}>

                <Box display={'flex'} alignItems={"center"} justifyContent={"space-between"}>
                    <Box fontSize={20}>公告列表</Box>
                    <Button size={"small"} onClick={() => {
                        setaddgg(true)
                    }} variant={"outlined"}>发布公告</Button>
                </Box>

                {
                    list.filter(item => (
                        new Date(item.starttime).getTime() <= new Date().getTime())
                        && (new Date(item.endtime).getTime() >= new Date().getTime())
                        && item.depidlist.indexOf(loginuser.login_departmentid) !== -1
                    )?.map(item =>
                        <Box key={item} borderBottom={'1px dashed black'} display={'flex'} justifyContent={"space-between"} pb={1} mt={1}>
                            <Box display={'flex'} alignItems={"center"}><IconEdit onClick={() => {
                                setaddgg(true)
                                console.log(item)
                                setTimeout(() => {
                                    api.current.setValues(item)
                                    api.current.setValue('id', item.id)
                                    api.current.setValue('action', 'UPDATE')
                                }, 500)
                            }} /><Box>{item.name}</Box></Box>
                            <div>{item.addtime}</div>
                        </Box>
                    )
                }
                <Box></Box>


            </Modal>


            <Modal visible={addgg} style={{ width: '50vw', minHeight: '60vh' }} onCancel={() => setaddgg(false)}>

                <Form getFormApi={e => api.current = e} initValues={{
                    action: 'ADD',
                    id: 0
                }} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingBulletinBoard',
                        ...e,
                        depidlist: JSON.stringify(e.depidlist)
                    })
                    if (rew.code === 200) {
                        toast.success('发布成功')
                    } else {
                        toast.error('发布成功')
                    }
                    setaddgg(false)
                }}>
                    <Form.Input label={'公告名称'} field={'name'} />
                    <Form.TextArea label={'内容'} field={'remarks'} />
                    <Form.Input label={'显示开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} field={'starttime'} />
                    <Form.Input label={'显示结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} field={'endtime'} />
                    <Form.Select filter field={'depidlist'} label={'接收部门'} multiple style={{ width: '70vw' }}>
                        {
                            initData?.DepartmentList?.map(item =>

                                <Form.Select.Option key={item.id} selected={true} value={item.id}>
                                    {item.name}
                                </Form.Select.Option>

                            )
                        }
                    </Form.Select>

                    <Form.Input initValue={99} label={'排序'} field={'sort'} />
                    <Form.Select field={'state'} initValue={'正常'} label={'状态'} style={{ width: '70vw' }}>
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>

                    <Button type={"submit"} variant={"contained"}>确认</Button>
                </Form>

            </Modal>
        </>

    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
