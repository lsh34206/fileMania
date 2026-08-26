import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './layout/login'
import Singup from './layout/singup'
import FileListFree from './layout/download_free'
import FileListPaid from './layout/download_paid'
import FileListGym from './layout/download_gym'
import FileUpload from './layout/file_upload'
import FileView from './layout/file_view'
import FileEdit from './layout/file_edit'
import FilePurchase from './layout/file_purchase'
import FileViewGym from './layout/file_view_gym'
import FileDownload from './layout/file_download'

import MyPage from './layout/myPage'
import Profile from './layout/profile'
import Home from './layout/home'
import AdminPage from './layout/admin/adminPage'
import Message from './layout/message/message'
import ChatMain from './layout/message/chatMain'
import ChatRoom from './layout/message/chatroom'
import PointCharge from './layout/point/pointCharge'
import PointChargeSuccess from './layout/point/pointChargeSuccess'
import PointChargeFail from './layout/point/pointChargeFail'

import Write from './layout/community/write'
import WriteList from './layout/community/writer_list'
import View from './layout/community/view'
import CommunityEdit from './layout/community/edit'


function Header() {
  const [name, setName] = useState(null);
  const [role, setRole] = useState(null);

  useEffect( () => {
    axios.get('http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/home',{withCredentials: true}).then(res => {
      setName(res.data.name)
      setRole(res.data.role ?? null)
    });
  },[]);
 const logout = async (e:any) => {
  try{
      await axios.get('http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/logout',{withCredentials: true})
      alert("로그아웃됨");
      window.location.href = '/home';
    }catch(error){
      alert(error);
    }
  }
  var content = null;

  console.log(name);
  if(name === null){
    content = <div><a href="/login" className='login'>로그인 &nbsp;&nbsp;</a><a href="/signup" className='signup'>회원가입 &nbsp;&nbsp;</a></div>;
  }else{
      content = <div>{role === 'admin' && <a href="/admin" className='admin-link'>관리자 &nbsp;&nbsp;</a>}<a onClick={logout} className='logout'>로그아웃</a>&nbsp;&nbsp;{name}님</div>;
  }

  return (
    <div className='Header'>
      <a href="/home"><h1>파일매니아</h1></a>

      {content} <br />
    </div>
  )
}

function Menu() {
  return (
    <div className='Menu'>
      <table>
        <thead>
           <tr>
          <th><a href="/home" className='home'>홈 &nbsp;&nbsp;</a></th>
          <th><a href="/file_upload" className='upload'>업로드 &nbsp;&nbsp;</a></th>
          <th><a href="/download" className='download'>다운로드 &nbsp;&nbsp;</a></th>
          <th><a href="/community" className='community'>커뮤니티 &nbsp;&nbsp;</a></th>
          <th><a href="/mypage" className='mypage'>마이페이지 &nbsp;&nbsp;</a></th>
        </tr>
        </thead>
       <tbody>
       
        <tr>
          <td><a   className='home'> &nbsp;&nbsp;</a></td>
          <td><a href="/file_upload" className='image'>이미지 &nbsp;&nbsp;</a></td>
          <td><a href="/download/free" className='download'>무료 &nbsp;&nbsp;</a></td>
          <td><a href="/community/talk" className='community'>수다 &nbsp;&nbsp;</a></td>
          <td><a href="/mypage/payManage" className='payManage'>결제/포인트 관리 &nbsp;&nbsp;</a></td>
        </tr>
        <tr>
          <td><a  className='home'> &nbsp;&nbsp;</a></td>
          <td><a href="/file_upload" className='video'>비디오 &nbsp;&nbsp;</a></td>
          <td><a href="/download/paid" className='download'>유료 &nbsp;&nbsp;</a></td>
          <td><a href="/community/question" className='community'>질문 &nbsp;&nbsp;</a></td>
          <td><a href="/mypage/myInfo" className='myInfo'>회원정보 &nbsp;&nbsp;</a></td>
        </tr>
        <tr>
          <td><a className='home'> &nbsp;&nbsp;</a></td>
          <td><a href="/file_upload" className='audio'>오디오 &nbsp;&nbsp;</a></td>
          <td><a href="/download/gym" className='download'>경매 &nbsp;&nbsp;</a></td>
          <td><a href="/community/share" className='community'>자료 공유 &nbsp;&nbsp;</a></td>
          <td><a href="/message" className='susin'>채팅 &nbsp;&nbsp;</a></td>
        </tr>
        <tr>
          <td><a className='home'> &nbsp;&nbsp;</a></td>
          <td><a href="/file_upload" className='document'>문서 &nbsp;&nbsp;</a></td>
          <td><a className='download'>&nbsp;&nbsp;</a></td>
          <td><a href="/community/notice" className='notice'>공지사항 &nbsp;&nbsp;</a></td>
          <td><a className='mypage'> &nbsp;&nbsp;</a></td>
        </tr>
        <tr>
          <td><a  className='home'>&nbsp;&nbsp;</a></td>
          <td><a href="/file_upload/program" className='program'>프로그램/앱 &nbsp;&nbsp;</a></td>
          <td><a className='download'> &nbsp;&nbsp;</a></td>
          <td><a className='community'>  &nbsp;&nbsp;</a></td>
          <td><a className='mypage'> &nbsp;&nbsp;</a></td>
        </tr>
       </tbody>
        
      </table>
     
    </div>
  )
}

function App() {

  useEffect(() => {
    const socket = io('http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080', { withCredentials: true })
    socket.on('force_logout', (data: any) => {
      alert(data?.message || '계정이 제재되어 로그아웃되었습니다.')
      window.location.href = '/login'
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className='App'>
      <Header /><hr />
      <Menu /><hr />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Singup />} />
              <Route path="/download/free" element={<FileListFree />} />
              <Route path="/download/paid" element={<FileListPaid />} />
              <Route path="/download/gym" element={<FileListGym />} />
              <Route path="/download/gym/:type/:id" element={<FileViewGym />} />
              <Route path="/download/free/:type/:id" element={<FileView />} />
              <Route path="/download/paid/:type/:id" element={<FileView />} />
              <Route path="/purchase/:type/:id" element={<FilePurchase />} />
              <Route path="/file_upload/edit/:download_type/:type/:id" element={<FileEdit />} />

              <Route path="/community/write" element={<Write />} />
              <Route path="/community/edit/:type/:id" element={<CommunityEdit />} />
              <Route path="/community/:type/:id" element={<View />} />
              <Route path="/community/:type" element={<WriteList />} />
         
              <Route path="/profile/:name" element={<Profile />} />

              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/:tab" element={<MyPage />} />
              <Route path="/message" element={<Message />} />
              <Route path="/chat" element={<ChatMain />} />
              <Route path="/chat/:room_id" element={<ChatRoom />} />

              <Route path="/point/charge" element={<PointCharge />} />
              <Route path="/point/charge/success" element={<PointChargeSuccess />} />
              <Route path="/point/charge/fail" element={<PointChargeFail />} />

              <Route path="/file_upload" element={<FileUpload />} />
              
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
