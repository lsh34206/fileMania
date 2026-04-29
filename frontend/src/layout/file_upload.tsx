import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function FileUpload() {

    const [file, setFile] = useState<any>(null)
   
    const [formData, setFormData] = useState({
        type: 'image',
        title: '',
        description: '',
        download_type: 'free',
        price:0,
        start_price:0,
        end_time:0
    })

  
    const handleSubmit = async (e:any) => {
        try{
        e.preventDefault()
        const sendFormData = new FormData()
        sendFormData.append('file', file)
        sendFormData.append('type', formData.type)
        sendFormData.append('data', JSON.stringify(formData))
console.log(formData);



        const res = await axios.post('http://localhost:8080/file_upload_ok/'+formData.type, sendFormData,
            {
              withCredentials: true
            });

      

          console.log(res.data)
     if(res.data.success){
        alert(res.data.message)
        window.location.href = '/download/free';
     }else{
        alert(res.data.message)
        window.location.href = '/file_upload';
     }
        }catch(err){
            console.log(err)
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" name="file" onChange={(e:any) => setFile(e.target.files[0])} />
                <select  value={formData.type} name="type" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="image" >Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                    <option value="app">App</option>
                </select>
                <select  value={formData.download_type} name="download_type" onChange={(e) => setFormData({...formData, download_type: e.target.value})}>
                    <option value="free" >무료</option>
                    <option value="paid">유료</option>
                    <option value="gym">경매</option>
                </select>{
                     formData.download_type === 'paid' && <input type="number" name="price" placeholder="가격" onChange={(e:any) => setFormData({...formData, price: e.target.value})} />
                     }
                     <input type="text" name="title" size={30} placeholder="제목" onChange={(e) => setFormData({...formData, title: e.target.value})} />
                     <textarea name="description" rows={5} cols={30} placeholder="설명" onChange={(e) => setFormData({...formData, description: e.target.value})} /><br />
                     {formData.download_type === 'gym' && <input type="number" name="start_price" placeholder="입찰가" onChange={(e:any) => setFormData({...formData, start_price: e.target.value})} />}
                     {formData.download_type === 'gym' && <input type="number" name="end_time" placeholder="마감시간(분)" onChange={(e:any) => setFormData({...formData, end_time: e.target.value})} />}
                    <button type="submit">Upload</button>
            </form>
        </div>
    )
}
export default FileUpload