import React, {Component} from 'react';
import {Button} from "@mui/material";
import {connect} from "react-redux";


const CommA = (props) => {
    console.log('2')
    return (
        <Button onClick={()=>{
            console.log('comma',props)
            // 发送action
            props.sendAction()
        }}>
            +
        </Button>
    );

}

const mapDispatchToProps = (dispatch) => {
    console.log('+++',dispatch)
    return {
        sendAction: () => dispatch({
            type: 'send_action',
            num: 3
        })
    }
}

export default connect(null, mapDispatchToProps)(CommA);