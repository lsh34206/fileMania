import { useEffect, useState } from 'react'
import axios from 'axios'
import '../App.css'

function StatsBanner() {
    const [stats, setStats] = useState({ userCount: 0, postCount: 0, fileCount: 0 })

    useEffect(() => {
        let cancelled = false
        axios.get(import.meta.env.VITE_API_VALUE + '/home_stats', { withCredentials: true })
            .then((res) => {
                if (cancelled) return
                setStats({
                    userCount: res.data.userCount ?? 0,
                    postCount: res.data.postCount ?? 0,
                    fileCount: res.data.fileCount ?? 0,
                })
            })
            .catch((err) => console.log(err))
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <div className='stats-banner'>
            <div className='stats-banner-item'>
                <span className='stats-banner-value'>{stats.userCount.toLocaleString()}</span>
                <span className='stats-banner-label'>회원</span>
            </div>
            <div className='stats-banner-item'>
                <span className='stats-banner-value'>{stats.postCount.toLocaleString()}</span>
                <span className='stats-banner-label'>누적 게시글</span>
            </div>
            <div className='stats-banner-item'>
                <span className='stats-banner-value'>{stats.fileCount.toLocaleString()}</span>
                <span className='stats-banner-label'>업로드 파일</span>
            </div>
        </div>
    )
}

export default StatsBanner
