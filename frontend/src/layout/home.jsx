import { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function Home() {
    const [post, setPost] = useState(null)
    const [kind, setKind] = useState(null)
    const [loading, setLoading] = useState(true)
    const [onlineUsers, setOnlineUsers] = useState([])

    useEffect(() => {
        let cancelled = false
        axios.get('http://localhost:8080/community_featured', { withCredentials: true })
            .then((res) => {
                if (cancelled) return
                setPost(res.data.post ?? null)
                setKind(res.data.kind ?? null)
            })
            .catch((err) => console.log(err))
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false
        const fetchOnline = () => {
            axios.get('http://localhost:8080/online_users', { withCredentials: true })
                .then((res) => {
                    if (!cancelled) setOnlineUsers(res.data.users ?? [])
                })
                .catch((err) => console.log(err))
        }
        fetchOnline()
        const interval = setInterval(fetchOnline, 20000)
        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [])

    return (
        <div className='page'>
            <h1 className='page-title'>파일매니아에 오신 것을 환영합니다</h1>

            {loading && <div className='state'>로딩 중...</div>}

            {!loading && post && (
                <a
                    className={`featured-post${kind === 'notice' ? ' featured-notice' : ''}`}
                    href={`/community/${post.category}/${post._id}`}
                >
                    <span className='featured-tag'>{kind === 'notice' ? '공지' : '인기글'}</span>
                    <span className='featured-title'>{post.title}</span>
                    <span className='featured-meta'>
                        {post.writer} &nbsp;·&nbsp; ♥ {post.like_count ?? 0} &nbsp;·&nbsp; 💬 {post.comment_count ?? 0}
                    </span>
                </a>
            )}

            {!loading && !post && (
                <div className='state'>표시할 게시글이 없습니다.</div>
            )}

            <div className='card' style={{ marginTop: 20 }}>
                <h2>접속자 목록 ({onlineUsers.length}명)</h2>
                {onlineUsers.length === 0 ? (
                    <div className='state'>현재 접속중인 사용자가 없습니다.</div>
                ) : (
                    <div className='online-user-list'>
                        {onlineUsers.map((u, i) => (
                            <a key={i} className='online-user-chip' href={`/profile/${encodeURIComponent(u.name)}`}>
                                <span className='online-dot' />
                                {u.name}
                                <span className='level-tag'>Lv.{u.level ?? 1}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
