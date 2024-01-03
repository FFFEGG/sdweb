import ReactDOM from 'react-dom';

// third party
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';


// project imports
import * as serviceWorker from 'serviceWorker';
import App from 'App';
import { store } from 'store';


// style + assets

import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
// import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';

import 'ag-grid-enterprise'
import 'assets/scss/style.scss';


import { ToastContainer } from "react-toastify";
import React from "react";




// ==============================|| REACT DOM RENDER  ||============================== //



ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
            <ToastContainer />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);



// ReactDOM.render(
//     <Provider store={store}>
//         <BrowserRouter>
//             <App />
//             <ToastContainer />
//         </BrowserRouter>
//     </Provider>,
//     document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

