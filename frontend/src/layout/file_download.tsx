import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function FileDownload() {
  type DataType={
    data:any
   }
    const [data, setData] = useState<DataType>({data:null})
    const pathParts = window.location.pathname.split("/").filter(item => item !== '');
    const type = pathParts[pathParts.length - 2];
    const id = pathParts[pathParts.length - 1];
    console.log(type,id)
   useEffect(() => {
    axios.get(`http://localhost:8080/download/file/${type}/${id}`, {
      withCredentials: true
    }).then(res => setData(res.data))
}, [type, id])

    console.log(data)

var content =(<h1>다운로드</h1>);



    return (
        <div>
             {content}
            
         
        </div>
    )
}
export default FileDownload