import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'

function Write() {

    const [isAdmin, setIsAdmin] = useState(false)

    const [formData, setFormData] = useState({
        category: 'talk',
        title: '',
        content: '',

    })

    useEffect(() => {
        let cancelled = false
        axios.get('http://localhost:8080/mypage', { withCredentials: true })
            .then((res) => {
                if (!cancelled) setIsAdmin(res.data.user?.role === 'admin')
            })
            .catch((err) => console.log(err))
        return () => {
            cancelled = true
        }
    }, [])


    const handleSubmit = async (e) => {
        try {
            e.preventDefault()

            if (!formData.title.trim()) {
                alert('제목을 입력해주세요.')
                return
            }
            if (!formData.content.trim()) {
                alert('내용을 입력해주세요.')
                return
            }

            const res = await axios.post(`http://localhost:8080/community/write_ok/${formData.category}`, {data:JSON.stringify(formData)},
                {
                    withCredentials: true
                })

            console.log(res.data)
            if (res.data.success) {
                alert(res.data.message)
                window.location.href = `/community/${formData.category}`
            } else {
                alert(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='page'>
            <div className='card' style={{ maxWidth: 520, margin: '0 auto' }}>
                <h1 className='page-title'>글 작성</h1>
                <form onSubmit={handleSubmit} className='form-stack'>
                    <select className='field' value={formData.category} name="category" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="talk">수다</option>
                        <option value="share">자료공유</option>
                        <option value="question">질문</option>
                        {isAdmin && <option value="notice">공지사항</option>}
                    </select>
                    <input className='field' type="text" name="title" size={30} placeholder="제목" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    <textarea className='field' name="content" rows={10} cols={30} placeholder="내용" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                    <button className='btn btn-primary btn-block' type="submit">작성</button>
                </form>
            </div>
        </div>
    )
}
export default Write
