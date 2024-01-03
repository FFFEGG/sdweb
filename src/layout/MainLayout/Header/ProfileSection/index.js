import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Switch,
    Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconEdit, IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons';
import { Form, Modal } from '@douyinfe/semi-ui';
import request from 'utils/request';
import { toast } from 'react-toastify';
import moment from 'moment';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        localStorage.removeItem('refresh_token_expires')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('initData')
        localStorage.removeItem('expire_time')
        localStorage.removeItem('userinfo')
        localStorage.removeItem('token')
        localStorage.removeItem('new_department')
        localStorage.removeItem('new_goodslist')
        localStorage.removeItem('new_PackingtypeList')
        window.location.href = "/login"
        console.log('Logout');
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);
    const initData = JSON.parse(localStorage.getItem('initData'))


    const api = useRef()
    const [show, setshow] = useState(false)
    const [addgg, setaddgg] = useState(false)
    const [list, setList] = useState([])


    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={User1}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="h4">{loginuser.login_department}-</Typography>
                                                <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                    {loginuser.name}
                                                </Typography>
                                            </Stack>
                                            {/* <Typography variant="subtitle2">Project Admin</Typography> */}
                                        </Stack>

                                    </Box>
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 2 }}>
                                            <Divider />
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 1}
                                                    onClick={async () => {
                                                        setshow(true)
                                                        const rew = await request('post', '/api/getInfo', {
                                                            url: 'Srapp.Web_SystemInfo.BulletinBoardList'
                                                        })
                                                        setList(rew.data.info)

                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <IconSettings stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">系统公告</Typography>} />
                                                </ListItemButton>

                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 0}
                                                    onClick={(event) => handleListItemClick(event, 0, '/sys/ChangePassword')}
                                                >
                                                    <ListItemIcon>
                                                        <IconSettings stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">修改密码</Typography>} />
                                                </ListItemButton>

                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={handleLogout}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">退出登录</Typography>} />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}

            </Popper>



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


            <Modal visible={addgg} size="large" onCancel={() => setaddgg(false)}>

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

export default ProfileSection;
