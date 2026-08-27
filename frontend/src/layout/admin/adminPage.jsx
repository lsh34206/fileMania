import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'

const STATUS_LABEL = {
    active: '활성',
    suspended: '정지',
    banned: '차단',
}

function formatDate(date) {
    if (!date) return '-'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function AdminPage() {
    const [checking, setChecking] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        axios.get(import.meta.env.VITE_API_VALUE+'/mypage', { withCredentials: true })
            .then((res) => {
                if (cancelled) return
                setIsAdmin(res.data.user?.role === 'admin')
            })
            .catch((err) => console.log(err))
            .finally(() => {
                if (!cancelled) setChecking(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(import.meta.env.VITE_API_VALUE+'/admin/users', { withCredentials: true })
            if (res.data.success) {
                setUsers(res.data.users ?? [])
            } else {
                setError(res.data.message || '회원 목록을 불러오지 못했습니다.')
            }
        } catch (err) {
            setError('회원 목록을 불러오지 못했습니다.')
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin) fetchUsers()
    }, [isAdmin])

    const suspend = async (user) => {
        const daysInput = window.prompt(`${user.name}님을 몇 일간 정지할까요? (숫자만 입력)`, '7')
        if (daysInput === null) return
        const days = Number(daysInput)
        if (!Number.isFinite(days) || days <= 0) {
            alert('정지 기간을 올바르게 입력해주세요.')
            return
        }
        const reason = window.prompt('정지 사유 (선택)', '') ?? ''

        try {
            const res = await axios.post(
                import.meta.env.VITE_API_VALUE+`admin/users/${user._id}/suspend`,
                { days, reason },
                { withCredentials: true },
            )
            alert(res.data.message)
            if (res.data.success) fetchUsers()
        } catch (err) {
            alert('정지 처리에 실패했습니다.')
            console.log(err)
        }
    }

    const ban = async (user) => {
        if (!window.confirm(`${user.name}님을 차단하시겠습니까?`)) return
        const reason = window.prompt('차단 사유 (선택)', '') ?? ''

        try {
            const res = await axios.post(
                import.meta.env.VITE_API_VALUE+`/admin/users/${user._id}/ban`,
                { reason },
                { withCredentials: true },
            )
            alert(res.data.message)
            if (res.data.success) fetchUsers()
        } catch (err) {
            alert('차단 처리에 실패했습니다.')
            console.log(err)
        }
    }

    const restore = async (user) => {
        if (!window.confirm(`${user.name}님의 제재를 해제하시겠습니까?`)) return

        try {
            const res = await axios.post(
               import.meta.env.VITE_API_VALUE+`/admin/users/${user._id}/restore`,
                {},
                { withCredentials: true },
            )
            alert(res.data.message)
            if (res.data.success) fetchUsers()
        } catch (err) {
            alert('해제 처리에 실패했습니다.')
            console.log(err)
        }
    }

    if (checking) {
        return (
            <div className='page'>
                <h1 className='page-title'>관리자 페이지</h1>
                <div className='state'>로딩 중...</div>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className='page'>
                <h1 className='page-title'>관리자 페이지</h1>
                <h3 className='state'>관리자 권한이 없습니다.</h3>
            </div>
        )
    }

    return (
        <div className='page'>
            <h1 className='page-title'>관리자 페이지</h1>

            <div className='card'>
                <h2>회원 관리</h2>

                {loading && <div className='state'>로딩 중...</div>}
                {error && <div className='state state-error'>{error}</div>}

                {!loading && !error && (
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>이름</th>
                                    <th>아이디</th>
                                    <th>이메일</th>
                                    <th>역할</th>
                                    <th>레벨</th>
                                    <th>상태</th>
                                    <th>가입일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            <a className='profile-link' href={`/profile/${encodeURIComponent(u.name)}`}>{u.name}</a>
                                        </td>
                                        <td>{u.id}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role === 'admin' ? '관리자' : '일반'}</td>
                                        <td>Lv.{u.level ?? 1}</td>
                                        <td>
                                            {STATUS_LABEL[u.status] ?? u.status}
                                            {u.status === 'suspended' && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{formatDate(u.suspended_until)}까지</div>}
                                            {u.status === 'banned' && u.ban_reason && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{u.ban_reason}</div>}
                                        </td>
                                        <td>{formatDate(u.createdAt)}</td>
                                        <td>
                                            {u.role === 'admin' ? (
                                                <span style={{ color: 'var(--muted)', fontSize: 12 }}>-</span>
                                            ) : u.status === 'active' ? (
                                                <>
                                                    <a className='file-edit' onClick={() => suspend(u)}>정지</a>
                                                    &nbsp;&nbsp;
                                                    <a className='file-del' onClick={() => ban(u)}>차단</a>
                                                </>
                                            ) : (
                                                <a className='file-edit' onClick={() => restore(u)}>해제</a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPage
