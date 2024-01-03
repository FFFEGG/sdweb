import { Box } from "@mui/material"
import { useEffect } from "react"

const chat = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     useEffect(() => {
          //新窗口打开链接
          // window.open('https://wschat.sanrangas.com/room?name=' + loginuser.name + '&seatno=' + localStorage.getItem('seatno') + '&opeid=' + loginuser.opeid)
     }, [])
     const chat = () => {
          window.open('https://wschat.sanrangas.com/room?name=' + loginuser.name + '&seatno=' + localStorage.getItem('seatno') + '&opeid=' + loginuser.opeid)
     }
     return (
          <Box>
               {/* 居中超大按钮 */}
               <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'80vh'}>
                    <Box onClick={chat} fontSize={50} fontWeight={'bold'} color={'#1890ff'}>点击进入聊天室</Box>
               </Box>
          </Box>
     );
}

export default chat;