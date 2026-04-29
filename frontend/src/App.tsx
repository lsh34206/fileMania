import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom' 
import './App.css'
import Login from './layout/login'
import Singup from './layout/singup'
import FileListFree from './layout/download_free'
import FileListPaid from './layout/download_paid'
import FileListGym from './layout/download_gym'
import FileUpload from './layout/file_upload'
import FileView from './layout/file_view'
import FileViewGym from './layout/file_view_gym'
import FileDownload from './layout/file_download'

function Header() {
  const [name, setName] = useState(null);
 
  useEffect( () => {
    axios.get('http://localhost:8080/home',{withCredentials: true}).then(res => setName(res.data.name));
  },[]);
 const logout = async (e:any) => {
  try{
      await axios.get('http://localhost:8080/logout',{withCredentials: true})
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
      content = <div><a onClick={logout} className='logout'>로그아웃</a>&nbsp;&nbsp;{name}님</div>;
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
          <td><a href="/mypage/susin" className='susin'>우편함 &nbsp;&nbsp;</a></td>
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

  
  return (
    <div className='App'>
      <Header /><hr />
      <Menu /><hr />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={null} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Singup />} />
              <Route path="/download/free" element={<FileListFree />} />
              <Route path="/download/paid" element={<FileListPaid />} />
              <Route path="/download/gym" element={<FileListGym />} />
              <Route path="/download/gym/:type/:id" element={<FileViewGym />} />
              <Route path="/download/free/:type/:id" element={<FileView />} />
              <Route path="/download/paid/:type/:id" element={<FileView />} />
         
              <Route path="/file_upload" element={<FileUpload />} />
              
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
