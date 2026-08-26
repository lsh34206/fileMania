import { useState, useEffect } from 'react'
import axios from 'axios'
import { LevelUtils } from '../../../backend/src/utils/levelUtils'
import '../App.css'

function Profile() {
    const pathParts = window.location.pathname.split('/').filter((item) => item !== '')
    const name = decodeURIComponent(pathParts[pathParts.length - 1] ?? '')

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        axios.get(`http://localhost:8080/profile/${encodeURIComponent(name)}`, { withCredentials: true })
            .then((res) => {
                if (!cancelled) setUser(res.data.user ?? null)
            })
            .catch((err) => console.log(err))
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [name])

    if (loading) {
        return (
            <div className='page'>
                <h1 className='page-title'>프로필</h1>
                <div className='state'>로딩 중...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className='page'>
                <h1 className='page-title'>프로필</h1>
                <h3 className='state'>존재하지 않는 사용자입니다.</h3>
            </div>
        )
    }

    const xp = user.xp ?? 0
    const { level, maxXp } = LevelUtils.computeLevel(xp)
    const percent = Math.min(100, Math.round((xp / maxXp) * 100))

    return (
        <div className='page'>
            <h1 className='page-title'>{user.name}님의 프로필</h1>

            <div className='card level-card' style={{ marginBottom: 16 }}>
                <div className='level-head'>
                    <span className='level-badge'>Lv.{level}</span>
                    <span className='level-xp'>{xp.toLocaleString()} / {maxXp.toLocaleString()} XP</span>
                </div>
                <div className='level-bar'>
                    <div className='level-bar-fill' style={{ width: `${percent}%` }} />
                </div>
            </div>

            <div className='card' style={{ marginBottom: 16 }}>
                <h2>자기소개</h2>
                <p style={{ whiteSpace: 'pre-wrap' }}>{user.bio || '등록된 자기소개가 없습니다.'}</p>
            </div>

            <div className='card'>
                <h2>정보</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>이름</th>
                            <td>{user.name}</td>
                        </tr>
                        <tr>
                            <th>가입일</th>
                            <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                        </tr>
                        <tr>
                            <th>작성 글 수</th>
                            <td>{user.writer_count ?? 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Profile
