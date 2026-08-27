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



        const res = await axios.post(import.meta.env.VITE_API_VALUE+'/file_upload_ok/'+formData.type, sendFormData,
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
        <div className='page'>
            <div className='card' style={{ maxWidth: 520, margin: '0 auto' }}>
                <h1 className='page-title'>파일 업로드</h1>
                <form onSubmit={handleSubmit} className='form-stack'>
                    <input className='field' type="file" name="file" onChange={(e:any) => setFile(e.target.files[0])} />
                    <select className='field' value={formData.type} name="type" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="image" >Image</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="document">Document</option>
                        <option value="app">App</option>
                    </select>
                    <select className='field' value={formData.download_type} name="download_type" onChange={(e) => setFormData({...formData, download_type: e.target.value})}>
                        <option value="free" >무료</option>
                        <option value="paid">유료</option>
                        <option value="gym">경매</option>
                    </select>
                    {formData.download_type === 'paid' && <input className='field' type="number" name="price" placeholder="가격" onChange={(e:any) => setFormData({...formData, price: e.target.value})} />}
                    <input className='field' type="text" name="title" size={30} placeholder="제목" onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    <textarea className='field' name="description" rows={5} cols={30} placeholder="설명" onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    {formData.download_type === 'gym' && <input className='field' type="number" name="start_price" placeholder="입찰가(100원 단위)" onChange={(e:any) => setFormData({...formData, start_price: e.target.value})} />}
                    {formData.download_type === 'gym' && <input className='field' type="number" name="end_time" placeholder="마감시간(분)" onChange={(e:any) => setFormData({...formData, end_time: e.target.value})} />}
                    <button className='btn btn-primary btn-block' type="submit">Upload</button>
                </form>
            </div>
        </div>
    )
}
export default FileUpload