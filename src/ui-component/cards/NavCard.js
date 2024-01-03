import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
// constant
const headerSX = {
    '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const NavCard = forwardRef(
    (
        {
            border = true,
            boxShadow,
            darkTitle,
            secondary,
            shadow,
            sx = {},
            title,
            subtitle,
            ...others
        },
        ref
    ) => {
        const theme = useTheme();

        return (
            <Card
                ref={ref}
                {...others}
                sx={{
                    border: border ? '1px solid' : 'none',
                    borderColor: theme.palette.primary[200] + 75,
                    ':hover': {
                        boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
                    },
                    ...sx,
                    padding: 'none'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 1.5,
                        bgcolor: 'background.paper',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h3"  component="div">
                        { title }
                    </Typography>
                    <Box   sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Button onClick={()=>{
                            console.log(ref);
                        }}>
                            <HomeRoundedIcon color="secondary" />
                        </Button>
                        <ChevronRightTwoToneIcon color="gray" />
                        <Button sx={{
                            color: 'black !important'
                        }}>{subtitle}</Button>
                        <ChevronRightTwoToneIcon color="gray" />
                        <Button disabled sx={{ color: "gainsboro" }}> { title }</Button>
                    </Box>
                </Box>
            </Card>
        );
    }
);

NavCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    children: PropTypes.node,
    content: PropTypes.bool,
    contentClass: PropTypes.string,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    shadow: PropTypes.string,
    sx: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default NavCard;
