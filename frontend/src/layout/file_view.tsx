import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function FileView() {
  type DataType={
    file:any,
    writer_is_me:Boolean,
    name:String,
    id:String
   }
    const [data, setData] = useState<DataType>({file:null,writer_is_me:false,name:"",id:""})
    const pathParts = window.location.pathname.split("/").filter(item => item !== '');
    const type = pathParts[pathParts.length - 2];
    const download_type = pathParts[pathParts.length - 3];
    const id = pathParts[pathParts.length - 1];
    console.log(type,id)
   useEffect(() => {
 

    axios.get(`http://localhost:8080/download/${download_type}/${type}/${id}`, {
      withCredentials: true
    }).then(res => setData(res.data))
}, [type, id])

    console.log(data)

    const deleteFile = async (id:string) => {
        try{

            const res = await axios.get(`http://localhost:8080/writer_delete/free/${type}/${id}`, { withCredentials: true }).then(res => {
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

    if (data.file === null) {
        return (
            <div>
                로딩중...
            </div>
        )
    }
    const fixedPath = (data.file.path || '').replace(/^\.\//, '/'); // 미리보기/플레이어용
    const src = `${fixedPath}`;
    console.log(src);
    const downloadHref = `/download/file/${type}/${id}`; // 강제 다운로드 라우트
    
 
var content = null;
if (data.file.type === 'image') {
    content = (<div>
        <img src={`http://localhost:8080${src}`} alt={data.file.title} width="500px" height="500px" className='file_view_image'/>
        <br />
        {data.file.download_type=="free"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드"}
        </a> : data.file.download_type=="paid"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드("+data.file.price+")원"}
        </a>:<span></span>}
      </div>)
} else if (data.file.type === 'video') {
    content = (<div>
        <video src={`http://localhost:8080${src}`} controls className='file_view_video'/>
        <br/>
        {data.file.download_type=="free"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드"}
        </a> : data.file.download_type=="paid"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드("+data.file.price+")원"}
        </a>:<span></span>}
      </div>)
} else if (data.file.type === 'audio') {
        content = (<div>
        <audio src={`http://localhost:8080${src}`} controls className='file_view_audio'/>
        <br/>
        {data.file.download_type=="free"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드"}
        </a> : data.file.download_type=="paid"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드("+data.file.price+")원"}
        </a>:<span></span>}
      </div>)
} else if (data.file.type === 'document') {
    content = (<div>
        {data.file.download_type=="free"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드"}
        </a> : data.file.download_type=="paid"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드("+data.file.price+")원"}
        </a>:<span></span>}
        <br/>
      </div>)
} else if (data.file.type === 'app') {
    content = (<div>
       {data.file.download_type=="free"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드"}
        </a> : data.file.download_type=="paid"?<a href={`http://localhost:8080/download_file/${type}/${id}`} className='file_view_image'>
          {data.file.title + "  다운로드("+data.file.price+")원"}
        </a>:<span></span>}
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
        <div>
            <h1>{data.file.title}</h1>
            <span>{typeLabel}</span>
            <span>&nbsp;&nbsp;{"크기:" + data.file.size}</span>
            <span>&nbsp;&nbsp;{"업로더:" + data.file.uploader}</span>
            <span>&nbsp;&nbsp;{"다운로드 횟수:" + data.file.download_count + "회"}</span>
            <span>&nbsp;&nbsp;{data.writer_is_me ?  <span></span>: <a onClick={() => deleteFile(id)}>삭제</a>}</span><br />
            {content}<br />
            <span>{data.file.description}</span>
         
        </div>
    )
}
export default FileView