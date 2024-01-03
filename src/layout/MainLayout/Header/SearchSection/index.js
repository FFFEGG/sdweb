import PropTypes from 'prop-types';
import {useEffect, useRef, useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {
    Avatar,
    Box,
    ButtonBase,
    Card,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Popper,
    Select
} from '@mui/material';
import {Form, Modal} from "@douyinfe/semi-ui";

// third-party
import PopupState, {bindPopper, bindToggle} from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';

// assets
import {IconAdjustmentsHorizontal, IconSearch, IconX} from '@tabler/icons';
import {shouldForwardProp} from '@mui/system';
import request from "../../../../utils/request";
import {connect} from 'react-redux'
import {toast} from "react-toastify";

import UserBasicInfo from "../../../../views/pages/users/UserBasicInfo";
import Dialog from "@mui/material/Dialog";
import {useLocation, useNavigate} from 'react-router';

import users from 'menu-items/users';
// ==============================|| SEARCH INPUT ||============================== //
import pinyin from 'pinyin';
import moment from 'moment';

// styles
const PopperStyle = styled(Popper, {shouldForwardProp})(({theme}) => ({
    zIndex: 1100,
    width: '99%',
    top: '-55px !important',
    padding: '0 12px',
    [theme.breakpoints.down('sm')]: {
        padding: '0 10px'
    }
}));

const OutlineInputStyle = styled(OutlinedInput, {shouldForwardProp})(({theme}) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    }
}));

const HeaderAvatarStyle = styled(Avatar, {shouldForwardProp})(({theme}) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    '&:hover': {
        background: theme.palette.secondary.dark,
        color: theme.palette.secondary.light
    }
}));


// ==============================|| SEARCH INPUT - MOBILE||============================== //

// const mapDispatchToProps = (dispatch) => {
//     console.log('user',dispatch)
//     return {
//         sendActions: () => dispatch({
//             type: 'binduser',
//             user: ''
//         })
//     }
// }
const mapDispatchToProps = (dispatch) => {
    console.log('BindUser', dispatch)
    return {
        BindUser: (data) => dispatch({
            type: 'binduser',
            user: data
        })
    }
}

const MobileSearch = (props) => {
    const {value, setValue, popupState, sendAction} = props
    const [userinfo, setuserinfo] = useState('')
    const theme = useTheme();
    const changeuserid = async (memberid) => {
        setValue(memberid)
        const rew = await request('post', '/api/getInfo', {
            memberid,
            url: 'Srapp.Web_User_Infos.UserBasicInfo'
        })
        if (rew.data.length === 0) {
            toast.error('未找到用户信息')
            setValue('')
        }
        sendAction(rew.data)
        setuserinfo(rew.data)

    }
    return (
        <OutlineInputStyle
            id="input-search-header"
            className={userinfo.memberid === value ? 'userred' : ''}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="搜索会员号"
            startAdornment={
                <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]}/>
                </InputAdornment>
            }
            onKeyDown={async (e) => {
                if (e.keyCode === 13) {

                    const rew = await request('post', '/api/getInfo', {
                        memberid: value,
                        url: 'Srapp.Web_User_Infos.UserBasicInfo'
                    })
                    if (rew.data.length === 0) {
                        toast.error('未找到用户信息')
                        setValue('')
                    }


                    sendAction(rew.data)
                    setuserinfo(rew.data)
                    let memberid = localStorage.getItem('memberid')
                    if (memberid) {
                        memberid = JSON.parse(memberid)
                        const index = memberid.findIndex((item) => item.memberid === value)
                        if (index === -1) {
                            memberid.unshift({
                                memberid: value,
                                time: moment().format('YYYY-MM-DD HH:mm:ss')
                            })
                        } else {
                            memberid[index].time = new Date().getTime()
                        }
                    } else {
                        memberid = [
                            {
                                memberid: value,
                                time: moment().format('YYYY-MM-DD HH:mm:ss')
                            }
                        ]

                    }
                    localStorage.setItem('memberid', JSON.stringify(memberid))

                    if (memberid.length > 100) {
                        // 删除最后一条
                        memberid.pop()
                        localStorage.setItem('memberid', JSON.stringify(memberid))
                    }
                }
            }}
            endAdornment={
                <InputAdornment position="end">
                    <ButtonBase sx={{borderRadius: '12px'}}>
                        <HeaderAvatarStyle variant="rounded">
                            <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem"/>
                        </HeaderAvatarStyle>
                    </ButtonBase>
                    <Box sx={{ml: 2}}>
                        <ButtonBase sx={{borderRadius: '12px'}}>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    background: theme.palette.orange.light,
                                    color: theme.palette.orange.dark,
                                    '&:hover': {
                                        background: theme.palette.orange.dark,
                                        color: theme.palette.orange.light
                                    }
                                }}
                                {...bindToggle(popupState)}
                            >
                                <IconX stroke={1.5} size="1.3rem"/>
                            </Avatar>
                        </ButtonBase>
                    </Box>
                </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{'aria-label': 'weight'}}
        />
    );
};

MobileSearch.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    popupState: PopupState
};


const SearchSection = (props) => {

    // console.log('propspropspropspropspropspropsprops', props)
    const theme = useTheme();
    const {customization} = props
    // console.log('customization', customization)
    const [value, setValue] = useState(customization.memberid);
    const [userinfo, setuserinfo] = useState('')
    const [show, setshow] = useState(false)
    const [menulist, setmenulist] = useState([])
    const url = useLocation();

    const navigate = useNavigate()

    useEffect(() => {
        // console.log('users', users)
        let arrs = []
        for (let i = 0; i < users.children.length; i++) {
            const data = users.children[i];
            for (let j = 0; j < data.children.length; j++) {
                const arr = data.children[j];
                if (arr.children) {
                    for (let k = 0; k < arr.children.length; k++) {
                        const arr1 = arr.children[k];
                        const title_pinyin_arr = pinyin(arr1.title, {style: 'normal'})
                        const title_pinyin = title_pinyin_arr.join('')
                        arrs.push({
                            title: arr1.title,
                            url: arr1.url,
                            pinyin: title_pinyin
                        })
                    }
                } else {
                    const title_pinyin_arr = pinyin(arr.title, {style: 'normal'})
                    const title_pinyin = title_pinyin_arr.join('')
                    arrs.push({
                        title: arr.title,
                        url: arr.url,
                        pinyin: title_pinyin
                    })
                }

            }
        }
        // console.log('arrs', arrs)
        setmenulist(arrs)

    }, [users])


    useEffect(async () => {
        setValue(customization.memberid)
        console.log('customizationssss', customization)
        console.log('customizationssss', url.pathname)

        if ((customization.isOpen.length == 0 || customization.isOpen[0] === "VagueQueryUserInfo") && url.pathname == '/users/VagueQueryUserInfo') {
            const rew = await request('post', '/api/getInfo', {
                memberid: customization.memberid,
                url: 'Srapp.Web_User_Infos.UserBasicInfo'
            })

            if (rew.code === 200) {
                // console.log('propsss',props)

                if (rew.data.length === 0) {
                    toast.error('未找到用户信息')
                    setValue('')
                }
                setuserinfo(rew.data)
                // props.BindUser(rew.data)
                props.dispatch({
                    type: 'binduser',
                    user: rew.data
                })

                // localstorage 记录搜索信息 memberid 数组形式 最长100条
                let memberid = localStorage.getItem('memberid')
                if (memberid) {
                    memberid = JSON.parse(memberid)
                    const index = memberid.findIndex((item) => item.memberid === value)
                    if (index === -1) {
                        memberid.unshift({
                            memberid: value,
                            time: moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                    } else {
                        memberid[index].time = new Date().getTime()
                    }
                } else {
                    memberid = [
                        {
                            memberid: value,
                            time: moment().format('YYYY-MM-DD HH:mm:ss')
                        }
                    ]

                }
                localStorage.setItem('memberid', JSON.stringify(memberid))

                if (memberid.length > 100) {
                    // 删除最后一条
                    memberid.pop()
                    localStorage.setItem('memberid', JSON.stringify(memberid))
                }

            } else {
                // props.BindUser('')
                props.dispatch({
                    type: 'binduser',
                    user: ''
                })
                setuserinfo('')
            }

        }

    }, [customization.memberid])
    const menuapi = useRef(null);
    const [menushow, setmenushow] = useState(false)
    const menuformapi = useRef(null);
    useEffect(() => {
        menuapi.current.reset()
    }, [url.pathname])


    // 监听键盘事件 如果按下 ctrl + k 弹窗搜索

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.keyCode === 75) {
                setmenushow(!menushow)
                setTimeout(() => {
                    menuformapi.current.focus()
                }, 300)

            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const [showPopup, setShowPopup] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const options = ['操作1', '操作2', '操作3'];

    const handleKeyDown = (e) => {
        if (showPopup) {
            switch (e.key) {
                case 'ArrowUp':
                    setSelectedIndex((prevIndex) => (prevIndex - 1 + options.length) % options.length);
                    break;
                case 'ArrowDown':
                    setSelectedIndex((prevIndex) => (prevIndex + 1) % options.length);
                    break;
                case 'Enter':
                    handleSelectOption();
                    break;
                default:
                    break;
            }
        }
    };

    const handleSelectOption = () => {
        console.log(`选择了：${options[selectedIndex]}`);
        setShowPopup(false);
    };
    const inputRef = useRef(null);
    return (
        <>
            {/*{showPopup && (*/}
            {/*    <div style={{position:"fixed",zIndex:9999999}}>*/}
            {/*        <div className="overlay" onClick={() => setShowPopup(false)}></div>*/}

            {/*        <div className="popup">*/}
            {/*            {options.map((option, index) => (*/}
            {/*                <div key={index} className={index === selectedIndex ? 'selected' : ''}>*/}
            {/*                    {option}*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*)}*/}
            <Box sx={{display: {xs: 'block', md: 'none'}}}>
                <PopupState variant="popper" popupId="demo-popup-popper">
                    {(popupState) => (
                        <>
                            <Box sx={{ml: 2}}>
                                <ButtonBase sx={{borderRadius: '12px'}}>
                                    <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                                        <IconSearch stroke={1.5} size="1.2rem"/>
                                    </HeaderAvatarStyle>
                                </ButtonBase>
                            </Box>
                            <PopperStyle {...bindPopper(popupState)} transition>
                                {({TransitionProps}) => (
                                    <>
                                        <Transitions type="zoom" {...TransitionProps}
                                                     sx={{transformOrigin: 'center left'}}>
                                            <Card
                                                sx={{
                                                    background: '#fff',
                                                    [theme.breakpoints.down('sm')]: {
                                                        border: 0,
                                                        boxShadow: 'none'
                                                    }
                                                }}
                                            >
                                                <Box sx={{p: 2}}>
                                                    <Grid container alignItems="center" justifyContent="space-between">
                                                        <Grid item xs>
                                                            <MobileSearch sendAction={props.BindUser} value={value}
                                                                          setValue={setValue} popupState={popupState}/>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Card>
                                        </Transitions>
                                    </>
                                )}
                            </PopperStyle>
                        </>
                    )}
                </PopupState>
            </Box>

            <Box sx={{display: {xs: 'none', md: 'block'}}}>

                <OutlineInputStyle
                    id="input-search-header"
                    ref={inputRef}
                    className={userinfo.memberid === value ? 'userred' : ''}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {


                            const rew = request('post', '/api/getInfo', {
                                memberid: value,
                                url: 'Srapp.Web_User_Infos.UserBasicInfo'
                            }).then(rew => {

                                if (rew.code === 200) {
                                    // console.log('propsss',props)

                                    if (rew.data.length === 0) {
                                        toast.error('未找到用户信息')
                                        setValue('')
                                    }
                                    setuserinfo(rew.data)
                                    // props.BindUser(rew.data)
                                    props.dispatch({
                                        type: 'binduser',
                                        user: rew.data
                                    })

                                    // localstorage 记录搜索信息 memberid 数组形式 最长100条
                                    let memberid = localStorage.getItem('memberid')
                                    if (memberid) {
                                        memberid = JSON.parse(memberid)
                                        const index = memberid.findIndex((item) => item.memberid === value)
                                        if (index === -1) {
                                            memberid.unshift({
                                                memberid: value,
                                                time: moment().format('YYYY-MM-DD HH:mm:ss')
                                            })
                                        } else {
                                            memberid[index].time = new Date().getTime()
                                        }
                                    } else {
                                        memberid = [
                                            {
                                                memberid: value,
                                                time: moment().format('YYYY-MM-DD HH:mm:ss')
                                            }
                                        ]

                                    }
                                    localStorage.setItem('memberid', JSON.stringify(memberid))

                                    if (memberid.length > 100) {
                                        // 删除最后一条
                                        memberid.pop()
                                        localStorage.setItem('memberid', JSON.stringify(memberid))
                                    }

                                    // 移除焦点
                                    // 移除input的焦点
                                    // 使用 setTimeout 来移除焦点
                                    setTimeout(() => {
                                        // alert('移除焦点')
                                        const inputElement = document.getElementById("input-search-header");
                                        if (inputElement) {
                                            inputElement.blur();
                                        }
                                        localStorage.setItem('search_memberid', value)
                                    }, 100);
                                } else {
                                    // props.BindUser('')
                                    props.dispatch({
                                        type: 'binduser',
                                        user: ''
                                    })
                                    setuserinfo('')
                                }

                            })


                        }
                    }}
                    placeholder="搜索"

                    endAdornment={

                        <InputAdornment position="end">
                            <ButtonBase sx={{borderRadius: '12px'}}>

                                {/*<HeaderAvatarStyle variant="rounded" onClick={() => setshow(!show)}>*/}
                                <HeaderAvatarStyle variant="rounded">
                                    <IconSearch onClick={async (e) => {
                                        if (1) {
                                            const rew = await request('post', '/api/getInfo', {
                                                memberid: value,
                                                url: 'Srapp.Web_User_Infos.UserBasicInfo'
                                            })

                                            if (rew.code === 200) {
                                                // console.log('propsss',props)

                                                if (rew.data.length === 0) {
                                                    toast.error('未找到用户信息')
                                                    setValue('')
                                                }
                                                setuserinfo(rew.data)
                                                props.dispatch({
                                                    type: 'binduser',
                                                    user: rew.data
                                                })
                                                // localstorage 记录搜索信息 memberid 数组形式 最长100条
                                                let memberid = localStorage.getItem('memberid')
                                                if (memberid) {
                                                    memberid = JSON.parse(memberid)
                                                    const index = memberid.findIndex((item) => item.memberid === value)
                                                    if (index === -1) {
                                                        memberid.unshift({
                                                            memberid: value,
                                                            time: moment().format('YYYY-MM-DD HH:mm:ss')
                                                        })
                                                    } else {
                                                        memberid[index].time = new Date().getTime()
                                                    }
                                                } else {
                                                    memberid = [
                                                        {
                                                            memberid: value,
                                                            time: moment().format('YYYY-MM-DD HH:mm:ss')
                                                        }
                                                    ]

                                                }
                                                localStorage.setItem('memberid', JSON.stringify(memberid))

                                                if (memberid.length > 100) {
                                                    // 删除最后一条
                                                    memberid.pop()
                                                    localStorage.setItem('memberid', JSON.stringify(memberid))
                                                }

                                            } else {
                                                props.dispatch({
                                                    type: 'binduser',
                                                    user: ''
                                                })
                                                setuserinfo('')
                                            }

                                        }
                                    }} stroke={1.5} size="1.3rem"/>
                                </HeaderAvatarStyle>
                            </ButtonBase>
                        </InputAdornment>

                    }
                    aria-describedby="search-helper-text"
                    inputProps={{'aria-label': 'weight'}}
                />
            </Box>
            {/*<Button sx={{ml:1,p: 1}} onClick={()=>setshow(!show)} >会员信息</Button>*/}
            <Box ml={3}>
                {/*下拉列表选择 memberid */}
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">历史卡号</InputLabel>

                    <Select
                        sx={{width: 200}}
                        value={value}
                        label="历史卡号"
                        onChange={(e) => {
                            setValue(e.target.value)
                            // props.BindUser(e.target.value)
                            // props.dispatch({
                            //     type: 'binduser',
                            //     user: ''
                            // })
                        }}
                    >
                        {
                            JSON.parse(localStorage.getItem('memberid'))?.map((item, index) => {
                                return <MenuItem key={index}
                                                 value={item.memberid}>{new Date(item.time).getHours()}:{new Date(item.time).getMinutes()}:{new Date(item.time).getSeconds()}|{item.memberid}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>

            </Box>

            <Box sx={{ml: 3}}>
                <Form getFormApi={e => menuapi.current = e}>
                    <Form.Select clearIcon onChange={e => {
                        navigate(e)
                    }} noLabel size="large" label="菜单搜索" placeholder="菜单搜索" filter={(sugInput, option) => {
                        // console.log('option', option.label)
                        const title_pinyin_arr = pinyin(option?.label, {style: 'normal'})
                        const title_pinyin = title_pinyin_arr.join('')


                        return (option.label.includes(sugInput)) || (title_pinyin.includes(sugInput));
                    }} field='menu' style={{width: 200, height: 50}}>
                        {
                            menulist.map((item, index) => {
                                return <Form.Select.Option key={index}
                                                           value={item.url}>{item.title}</Form.Select.Option>
                            })
                        }
                    </Form.Select>
                </Form>

            </Box>
            <Dialog

                maxWidth="md"
                open={show}
                onClose={() => setshow(!show)}
            >
                <UserBasicInfo style={{maxWidth: '80vw', zIndex: 999}} customization={userinfo}/>
            </Dialog>


            <Modal size={'large'} title="菜单搜索" visible={menushow} onCancel={() => setmenushow(false)}>
                <Form getFormApi={e => menuapi.current = e}>
                    <Form.Select ref={e => menuformapi.current = e} clearIcon onChange={e => {
                        setmenushow(false)
                        navigate(e)
                    }} noLabel size="large" label="菜单搜索" placeholder="菜单搜索" filter={(sugInput, option) => {
                        // console.log('option', option.label)
                        const title_pinyin_arr = pinyin(option?.label, {style: 'normal'})
                        const title_pinyin = title_pinyin_arr.join('')


                        return (option.label.includes(sugInput)) || (title_pinyin.includes(sugInput));
                    }} field='menu' style={{width: '100%', height: 50}}>
                        {
                            menulist.map((item, index) => {
                                return <Form.Select.Option key={index}
                                                           value={item.url}>{item.title}</Form.Select.Option>
                            })
                        }
                    </Form.Select>
                </Form>
            </Modal>

            {/* {*/}

            {/*    show ?  <Box borderColor={'#ccc'} border={'1px solid #ccc'} bgcolor={'#fff'} position={"fixed"} borderRadius={3} top={"15%"} width={"75%"} left={"20%"} overflow={"scroll"} height={"80vh"} p={3} zIndex={99999999999999}>*/}

            {/*        <UserBasicInfo customization={userinfo} />*/}
            {/*    </Box>*/}
            {/*        : ''*/}
            {/*} */}

        </>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(SearchSection);
