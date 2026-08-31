import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function FileView() {
  type DataType={
    file:any,
    writer_is_me:Boolean,
    name:String,
    id:String,
    purchased:Boolean
   }
    const [data, setData] = useState<DataType>({file:null,writer_is_me:false,name:"",id:"",purchased:true})
    const pathParts = window.location.pathname.split("/").filter(item => item !== '');
    const type = pathParts[pathParts.length - 2];
    const download_type = pathParts[pathParts.length - 3];
    const id = pathParts[pathParts.length - 1];
    console.log(type,id)
   useEffect(() => {
 

    axios.get(import.meta.env.VITE_API_VALUE+`/download/${download_type}/${type}/${id}`, {
      withCredentials: true
    }).then(res => setData(res.data))
}, [type, id])

    console.log(data)

    const deleteFile = async (id:string) => {
        try{

            const res = await axios.get(import.meta.env.VITE_API_VALUE+`/writer_delete/free/${type}/${id}`, { withCredentials: true }).then(res => {
                if(res.data.success){
                    alert('파일 삭제 완료')
                    location.href = '/download/free';
                }
            })
            
        }catch(e){
            alert(e)
        }finally{
            location.href = '/download/free';
        }
    }

    if (!data.file) {
        return (
            <div className='state'>
                로딩중...
            </div>
        )
    }
    const src = `${import.meta.env.VITE_API_VALUE}/media/${type}/${id}`; // 인증 기반 미리보기/플레이어용
    console.log(src);
    const downloadHref = `/download/file/${type}/${id}`; // 강제 다운로드 라우트
    
 
const locked = data.file.download_type === 'paid' && !data.purchased;
const purchaseHref = `/purchase/${type}/${id}`;

const actionLink = data.file.download_type === 'free' ? (
  <a href={import.meta.env.VITE_BACKEND_URI_VALUE+`/download_file/${type}/${id}`} className='view-download'>
    {data.file.title + "  다운로드"}
  </a>
) : locked ? (
  <a href={purchaseHref} className='view-download view-purchase'>
    {data.file.title + "  구매하기 (" + data.file.price + "원)"}
  </a>
) : data.file.download_type === 'paid' ? (
  <a href={import.meta.env.VITE_BACKEND_URI_VALUE+`/download_file/${type}/${id}`} className='view-download'>
    {data.file.title + "  다운로드("+data.file.price+")원"}
  </a>
) : <span></span>;

var content = null;
if (data.file.type === 'image') {
    content = (<div>
        {locked ? (
          <div className='purchase-preview'>
            <img src={import.meta.env.VITE_BACKEND_URI_VALUE+`/media/${type}/${id}/preview`} alt={data.file.title} width="500px" height="500px" className='file_view_image purchase-blur'/>
            <div className='purchase-overlay'><span>구매 후 확인 가능합니다</span></div>
          </div>
        ) : (
          <img src={import.meta.env.VITE_BACKEND_URI_VALUE+`${src}`} alt={data.file.title} width="500px" height="500px" className='file_view_image'/>
        )}
        <br />
        {actionLink}
      </div>)
} else if (data.file.type === 'video') {
    content = (<div>
        {locked ? (
          <div className='purchase-preview'>
            <img src={import.meta.env.VITE_BACKEND_URI_VALUE+`/media/${type}/${id}/preview`} alt={data.file.title} width="500px" height="500px" className='file_view_image purchase-blur'/>
            <div className='purchase-overlay'><span>구매 후 재생 가능합니다</span></div>
          </div>
        ) : (
          <video src={import.meta.env.VITE_BACKEND_URI_VALUE+`${src}`} controls className='file_view_video'/>
        )}
        <br/>
        {actionLink}
      </div>)
} else if (data.file.type === 'audio') {
        content = (<div>
        {locked ? (
          <div className='purchase-locked'><span>구매 후 재생할 수 있습니다.</span></div>
        ) : (
          <audio src={import.meta.env.VITE_BACKEND_URI_VALUE+`${src}`} controls className='file_view_audio'/>
        )}
        <br/>
        {actionLink}
      </div>)
} else if (data.file.type === 'document') {
    content = (<div>
        {actionLink}
        <br/>
      </div>)
} else if (data.file.type === 'app') {
    content = (<div>
       {actionLink}
        <br />
      </div>)
}


//if()

    const typeLabel = data.file.type === 'image'
        ? '이미지'
        : data.file.type === 'video'
        ? '비디오'
        : data.file.type === 'audio'
        ? '오디오'
        : data.file.type === 'document'
        ? '문서'
        : '프로그램/앱';

    return (
        <div className='page'>
            <div className='card'>
                <h1 className='page-title'>{data.file.title}</h1>
                <div className='view-meta'>
                    <span>{typeLabel}</span>
                    <span>{"크기: " + data.file.size}</span>
                    <span>업로더: <a className='profile-link' href={`/profile/${encodeURIComponent(data.file.uploader)}`}>{data.file.uploader}</a></span>
                    <span>{"다운로드 횟수: " + data.file.download_count + "회"}</span>
                    {data.writer_is_me && (
                        <span>
                            <a className='file-edit' href={`/file_upload/edit/${download_type}/${type}/${id}`}>수정</a>
                            &nbsp;&nbsp;
                            <a className='file-del' onClick={() => deleteFile(id)}>삭제</a>
                        </span>
                    )}
                </div>
                {content}
                <span className='view-desc'>{data.file.description}</span>
            </div>
        </div>
    )
}
export default FileView