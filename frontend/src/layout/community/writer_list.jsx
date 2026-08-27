import { useEffect, useState } from 'react'
import axios from 'axios'
import '../../App.css'

function WriterList() {

    const [category, setCategory] = useState('talk')
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [keywordInput, setKeywordInput] = useState('')
    const [keyword, setKeyword] = useState('')
    const [sort, setSort] = useState('latest')

    useEffect(() => {
        let cancelled = false
        const fetchList = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.post(
                   import.meta.env.VITE_API_VALUE+`/community/${category}`,
                    { keyword, sort },
                    { withCredentials: true },
                )
                if (!cancelled) {
                    setPosts(res.data.posts ?? [])
                }
                console.log(res.data);
            } catch(error) {
                if (!cancelled) {
                    setError('목록을 불러오지 못했습니다.')
                    console.log(error);
                    setPosts([])
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        fetchList()
        return () => {
            cancelled = true
        }
    }, [category, keyword, sort])

    const handleSearch = (e) => {
        e.preventDefault()
        setKeyword(keywordInput.trim())
    }

    return (
        <div className='page'>
            <h1 className='page-title'>게시글 목록</h1>

            <div className='tabs'>
               
                <button className='tab' onClick={() => setCategory('talk')}>수다</button>
                <button className='tab'  onClick={() => setCategory('share')}>자료공유</button>
                <button className='tab'  onClick={() => setCategory('question')}>질문</button>
            </div>

            <form className='search-row' onSubmit={handleSearch}>
                <input
                    className='field'
                    type='text'
                    placeholder='제목 또는 내용 검색'
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                />
                <button className='btn' type='submit'>검색</button>
                {keyword && (
                    <button
                        type='button'
                        className='btn'
                        onClick={() => { setKeywordInput(''); setKeyword('') }}
                    >
                        초기화
                    </button>
                )}
            </form>

            <div className='tabs'>
                <button className={`tab${sort === 'latest' ? ' tab-active' : ''}`} onClick={() => setSort('latest')}>최신순</button>
                <button className={`tab${sort === 'likes' ? ' tab-active' : ''}`} onClick={() => setSort('likes')}>좋아요순</button>
                <button className={`tab${sort === 'comments' ? ' tab-active' : ''}`} onClick={() => setSort('comments')}>댓글순</button>
                <button className={`tab${sort === 'views' ? ' tab-active' : ''}`} onClick={() => setSort('views')}>조회수순</button>
            </div>

            <div style={{ textAlign: 'right', margin: '12px 0' }}>
                <a className='btn btn-primary' href='/community/write'>글 작성</a>
            </div>

            {loading && <div className='state'>로딩 중...</div>}
            {error && <div className='state state-error'>{error}</div>}
            {!loading && posts.length === 0 && (
                <h3 className='state'>{keyword ? `'${keyword}'에 대한 검색 결과가 없습니다.` : '게시글이 없습니다.'}</h3>
            )}

            {!loading && posts.length > 0 && (
                <div className='file-list'>
                    {posts.map((p, i) => (
                        <div className='file-item' key={p._id ?? i}>
                            <a href={`/community/${category}/${p._id}`}>
                                [{p.category}]&nbsp;&nbsp;&nbsp;{p.title}
                            </a>
                            <span className='post-meta-right'>
                                <a className='profile-link' href={`/profile/${encodeURIComponent(p.writer)}`}>{p.writer}</a>
                                <span className='post-stats'>
                                    ♥ {p.like_count ?? 0}&nbsp;&nbsp;💬 {p.comment_count ?? 0}&nbsp;&nbsp;👁 {p.view_count ?? 0}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default WriterList
