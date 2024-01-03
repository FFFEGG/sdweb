import React, {Component} from 'react';
import {Button} from "@mui/material";
import {connect} from "react-redux";


const CommB = ({customization}) => {
    console.log('CommmBBBB',customization)
    return (
        <div>
            {customization.num}
        </div>
    );

}

const mapStateToProps = (state) => {
    console.log('commb', state)
    return state
}

export default connect(mapStateToProps)(CommB);