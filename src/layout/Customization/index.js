import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Drawer,
    Fab,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Slider,
    Tooltip,
    Typography
} from '@mui/material';
import { IconSettings } from '@tabler/icons';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { SET_BORDER_RADIUS, SET_FONT_FAMILY } from 'store/actions';
import { gridSpacing } from 'store/constant';
import request from 'utils/request';

// concat 'px'
function valueText(value) {
    return `${value}px`;
}

// ==============================|| LIVE CUSTOMIZATION ||============================== //

const Customization = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);

    // drawer on/off
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen(!open);
    };

    // state - border radius
    const [borderRadius, setBorderRadius] = useState(customization.borderRadius);
    const handleBorderRadius = (event, newValue) => {
        setBorderRadius(newValue);
    };

    useEffect(() => {
        dispatch({ type: SET_BORDER_RADIUS, borderRadius });
    }, [dispatch, borderRadius]);

    let initialFont;
    switch (customization.fontFamily) {
        case `'Inter', sans-serif`:
            initialFont = 'Inter';
            break;
        case `'Poppins', sans-serif`:
            initialFont = 'Poppins';
            break;
        case `'Roboto', sans-serif`:
        default:
            initialFont = 'Roboto';
            break;
    }

    // state - font family
    const [fontFamily, setFontFamily] = useState(initialFont);
    useEffect(() => {
        let newFont;
        switch (fontFamily) {
            case 'Inter':
                newFont = `'Inter', sans-serif`;
                break;
            case 'Poppins':
                newFont = `'Poppins', sans-serif`;
                break;
            case 'Roboto':
            default:
                newFont = `'Roboto', sans-serif`;
                break;
        }
        dispatch({ type: SET_FONT_FAMILY, fontFamily: newFont });
    }, [dispatch, fontFamily]);
    const [list, setlist] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const call_arr = JSON.parse(localStorage.getItem('call_arr')) || []

    const groupByDeliveryman = (data) =>  {
        const grouped = {};

        data.forEach(item => {
            const deliveryman = item.deliveryman;

            if (!grouped[deliveryman]) {
                grouped[deliveryman] = [];
            }

            grouped[deliveryman].push(item);
        });

        return grouped;
    }


    useEffect(async () => {
        console.log('open', open)
        if (open && loginuser.login_department == '运输公司') {
            const rew = await request('post', '/api/getInfo', {
                url: 'Srapp.Web_Other_Infos.GetDepdeliverymanOrderMaterialInfo'
            })
            console.log('Srapp.Web_Other_Infos.GetDepdeliverymanOrderMaterialInfo', rew);
            const arr = groupByDeliveryman(rew.data.info)
            console.log('arr', arr);
            // setlist(rew.data.info)
            setlist(Object.values(arr))
        }
    }, [open])




    return (
        <>
            {/* toggle button */}
            <Tooltip title="Live Customize">
                <Fab
                    component="div"
                    onClick={handleToggle}
                    size="medium"
                    variant="circular"
                    color="secondary"
                    sx={{
                        borderRadius: 0,
                        borderTopLeftRadius: '50%',
                        borderBottomLeftRadius: '50%',
                        borderTopRightRadius: '50%',
                        borderBottomRightRadius: '4px',
                        top: '25%',
                        position: 'fixed',
                        right: 10,
                        zIndex: theme.zIndex.speedDial
                    }}
                >
                    <AnimateButton type="rotate">
                        <IconButton color="inherit" size="large" disableRipple>
                            <IconSettings />
                        </IconButton>
                    </AnimateButton>
                </Fab>
            </Tooltip>

            <Drawer
                anchor="right"
                onClose={handleToggle}
                open={open}
                PaperProps={{
                    sx: {
                        width: 340
                    }
                }}
            >
                <PerfectScrollbar component="div">
                    <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
                        <Grid item xs={12}>
                            {/* font family */}
                            {
                                loginuser?.login_department == '运输公司' &&
                                <SubCard title="司机库存信息">
                                    {
                                        list.map((item, index) => {
                                            return <Box key={index} mb={2}>
                                                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                                                    {item[0].deliveryman}
                                                </Typography>
                                                {
                                                    item.map((item2, index2) =>
                                                    {
                                                        return           <Box   mb={1} p={1}>
                                                            <Box variant="caption" sx={{ color: '#555',fontSize: 16 }}>
                                                                {item2.packingtype}
                                                            </Box>

                                                            <Box variant="caption" sx={{ color: '#666' }}>
                                                                订单商品数量 {item2.ordergoodsnum}
                                                            </Box>

                                                            <Box variant="caption" sx={{ color: '#666' }}>
                                                                司机库存数量 {item2.stocknum}
                                                            </Box>

                                                        </Box>


                                                    })
                                                }

                                            </Box>
                                        })
                                    }

                                </SubCard>
                            }
                            {
                                loginuser?.login_department == '预约中心' &&
                                <SubCard title="来电历史信息">
                                    {
                                        call_arr.map((item, index) => {
                                            return <Box key={index} mb={2}>
                                                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                                                    时间: {item.time}
                                                </Typography>
                                                <Box variant="caption" sx={{ color: 'text.secondary' }}>
                                                    电话: {item.tel}
                                                </Box>

                                            </Box>
                                        })
                                    }
                                </SubCard>
                            }
                        </Grid>

                    </Grid>
                </PerfectScrollbar>
            </Drawer>
        </>
    );
};

export default Customization;
