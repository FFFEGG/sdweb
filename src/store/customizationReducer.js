// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';
import moment from "moment";

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    user: '',
    memberid: '',
    begintime: moment().add(-3, 'days').format('YYYY-MM-DD'),
    endtime: moment().format('YYYY-MM-DD'),
    orderlist: {
        state: ['正常', '已安排'],
        list: []
    },
    num: 0
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.SENDACTION:
            return {
                ...state,
                num: state.num + action.num
            };
        case actionTypes.BINDUSER:
            return {
                ...state,
                num: state.num + 1,
                user: action.user,
            };
        case actionTypes.SEARORDER:
            // console.log(action)
            return {
                ...state,
                begintime: action.begintime,
                endtime: action.endtime,
                orderlist: {
                    state: action.orderlist.state,
                    list: action.orderlist.list
                },
            };
        case actionTypes.MEMBERID:
            // console.log(action)
            return {
                ...state,
                memberid: action.memberid

            };
        default:
            return state;
    }
};

export default customizationReducer;
