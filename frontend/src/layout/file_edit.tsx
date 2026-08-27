import { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function FileEdit() {
    const pathParts = window.location.pathname.split('/').filter((item) => item !== '')
    const download_type = pathParts[pathParts.length - 3]
    const type = pathParts[pathParts.length - 2]
    const id = pathParts[pathParts.length - 1]

    const [loading, setLoading] = useState(true)
    const [writerIsMe, setWriterIsMe] = useState(false)
    const [fileDownloadType, setFileDownloadType] = useState('free')
    const [formData, setFormData] = useState({ title: '', description: '', price: 0 })

    useEffect(() => {
        let cancelled = false
        axios.get(import.meta.env.API_VALUE+`/download/${download_type}/${type}/${id}`, { withCredentials: true })
            .then((res) => {
                if (cancelled) return
                const file = res.data.file
                if (file) {
                    setFormData({
                        title: file.title ?? '',
                        description: file.description ?? '',
                        price: file.price ?? 0,
                    })
                    setFileDownloadType(file.download_type ?? 'free')
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
    }, [download_type, type, id])

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()

            if (!formData.title.trim()) {
                alert('제목을 입력해주세요.')
                return
            }
            if (!formData.description.trim()) {
                alert('설명을 입력해주세요.')
                return
            }

            const res = await axios.post(
                import.meta.env.API_VALUE+`/file_edit_ok/${type}/${id}`,
                { data: JSON.stringify(formData) },
                { withCredentials: true },
            )

            if (res.data.success) {
                alert(res.data.message)
                window.location.href = `/download/${download_type}/${type}/${id}`
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
                <h1 className='page-title'>파일 정보 수정</h1>
                <form onSubmit={handleSubmit} className='form-stack'>
                    <input
                        className='field'
                        type="text"
                        placeholder="제목"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <textarea
                        className='field'
                        rows={5}
                        placeholder="설명"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {fileDownloadType === 'paid' && (
                        <input
                            className='field'
                            type="number"
                            placeholder="가격"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                    )}
                    <button className='btn btn-primary btn-block' type="submit">수정 완료</button>
                </form>
            </div>
        </div>
    )
}
export default FileEdit
