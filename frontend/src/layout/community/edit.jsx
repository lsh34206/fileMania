import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'

function Edit() {
    const pathParts = window.location.pathname.split('/').filter(item => item !== '')
    const category = pathParts[pathParts.length - 2]
    const id = pathParts[pathParts.length - 1]

    const [loading, setLoading] = useState(true)
    const [writerIsMe, setWriterIsMe] = useState(false)
    const [formData, setFormData] = useState({
        category: category,
        title: '',
        content: '',
    })

    useEffect(() => {
        let cancelled = false
        axios.get(`http://localhost:8080/community/${category}/${id}`, { withCredentials: true })
            .then((res) => {
                if (cancelled) return
                const post = res.data.post
                if (post) {
                    setFormData({
                        category: post.category ?? category,
                        title: post.title ?? '',
                        content: post.content ?? '',
                    })
                }
                setWriterIsMe(!!res.data.writer_is_me)
            })
            .catch((err) => console.log(err))
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [category, id])

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

            const res = await axios.post(
                `http://localhost:8080/community/edit_ok/${category}/${id}`,
                { data: JSON.stringify(formData) },
                { withCredentials: true },
            )

            if (res.data.success) {
                alert(res.data.message)
                window.location.href = `/community/${res.data.category ?? formData.category}/${id}`
            } else {
                alert(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    if (loading) {
        return (
            <div className='page'>
                <div className='state'>로딩 중...</div>
            </div>
        )
    }

    if (!writerIsMe) {
        return (
            <div className='page'>
                <h3 className='state'>수정 권한이 없습니다.</h3>
            </div>
        )
    }

    return (
        <div className='page'>
            <div className='card' style={{ maxWidth: 520, margin: '0 auto' }}>
                <h1 className='page-title'>글 수정</h1>
                <form onSubmit={handleSubmit} className='form-stack'>
                    <select className='field' value={formData.category} name="category" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="talk">수다</option>
                        <option value="share">자료공유</option>
                        <option value="question">질문</option>
                    </select>
                    <input className='field' type="text" name="title" size={30} placeholder="제목" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    <textarea className='field' name="content" rows={10} cols={30} placeholder="내용" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                    <button className='btn btn-primary btn-block' type="submit">수정 완료</button>
                </form>
            </div>
        </div>
    )
}
export default Edit
