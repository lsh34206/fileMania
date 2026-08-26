import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { LevelUtils } from '../../../backend/src/utils/levelUtils'
import '../App.css'

const TAB_BY_PATH = { myInfo: 'info', payManage: 'point', susin: 'mail' }

function MyPage() {
    const { tab: tabParam } = useParams()

    const [tab, setTab] = useState(TAB_BY_PATH[tabParam] ?? 'info')
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [editingBio, setEditingBio] = useState(false)
    const [bio, setBio] = useState('')
    const [savingBio, setSavingBio] = useState(false)

    useEffect(() => {
        setTab(TAB_BY_PATH[tabParam] ?? 'info')
    }, [tabParam])

    useEffect(() => {
        let cancelled = false
        const fetchUser = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.get('http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/mypage', { withCredentials: true })
                if (!cancelled) {
                    setUser(res.data.user ?? null)
                    setBio(res.data.user?.bio ?? '')
                }
            } catch (error) {
                if (!cancelled) {
                    setError('내 정보를 불러오지 못했습니다.')
                    console.log(error)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        fetchUser()
        return () => {
            cancelled = true
        }
    }, [])

    if (loading) {
        return (
            <div className='page'>
                <h1 className='page-title'>마이페이지</h1>
                <div className='state'>로딩 중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='page'>
                <h1 className='page-title'>마이페이지</h1>
                <div className='state state-error'>{error}</div>
            </div>
        )
    }

    if (user === null) {
        return (
            <div className='page'>
                <h1 className='page-title'>마이페이지</h1>
                <h3 className='state'>로그인 해주세요.</h3>
                <div style={{ textAlign: 'center' }}>
                    <a className='btn btn-primary' href='/login'>로그인 하러 가기</a>
                </div>
            </div>
        )
    }

    const messages = user.massege_list ?? []

    const saveBio = async () => {
        setSavingBio(true)
        try {
            const res = await axios.post('http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/mypage/bio', { bio }, { withCredentials: true })
            if (res.data.success) {
                setUser({ ...user, bio: res.data.user?.bio ?? bio })
                setEditingBio(false)
            } else {
                alert(res.data.message || '자기소개 저장에 실패했습니다.')
            }
        } catch (error) {
            alert('자기소개 저장에 실패했습니다.')
            console.log(error)
        } finally {
            setSavingBio(false)
        }
    }

    const cancelBio = () => {
        setBio(user.bio ?? '')
        setEditingBio(false)
    }

    return (
        <div className='page'>
            <h1 className='page-title'>마이페이지</h1>

            <div className='tabs'>
                <button className='tab' onClick={() => setTab('info')}>내 정보</button>
                <button className='tab' onClick={() => setTab('point')}>포인트 현황</button>
                <button className='tab' onClick={() => setTab('mail')}>우편함</button>
            </div>

            {tab === 'info' && (() => {
                const xp = user.xp ?? 0
                const { level, maxXp } = LevelUtils.computeLevel(xp)
                const percent = Math.min(100, Math.round((xp / maxXp) * 100))
                return (
                    <div className='card level-card' style={{ marginBottom: 16 }}>
                        <div className='level-head'>
                            <span className='level-badge'>Lv.{level}</span>
                            <span className='level-xp'>{xp.toLocaleString()} / {maxXp.toLocaleString()} XP</span>
                        </div>
                        <div className='level-bar'>
                            <div className='level-bar-fill' style={{ width: `${percent}%` }} />
                        </div>
                    </div>
                )
            })()}

            {tab === 'info' && (
                <div className='card'>
                    <h2>내 정보</h2>
                    <table>
                        <tbody>
                            <tr>
                                <th>이름</th>
                                <td>{user.name}</td>
                            </tr>
                            <tr>
                                <th>아이디</th>
                                <td>{user.id}</td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <th>전화번호</th>
                                <td>{user.phone || '-'}</td>
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
            )}

            {tab === 'info' && (
                <div className='card' style={{ marginTop: 16 }}>
                    <h2>자기소개</h2>
                    {editingBio ? (
                        <div className='form-stack'>
                            <textarea
                                className='field'
                                rows={4}
                                maxLength={500}
                                placeholder='자기소개를 입력해주세요.'
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            <div>
                                <button className='btn btn-primary' onClick={saveBio} disabled={savingBio}>
                                    {savingBio ? '저장 중...' : '저장'}
                                </button>
                                &nbsp;
                                <button className='btn' onClick={cancelBio} disabled={savingBio}>취소</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{user.bio || '등록된 자기소개가 없습니다.'}</p>
                            <button className='btn btn-primary' onClick={() => setEditingBio(true)}>수정</button>
                        </div>
                    )}
                </div>
            )}

            {tab === 'point' && (
                <div className='card'>
                    <h2>포인트 현황</h2>
                    <h1>{(user.point ?? 0).toLocaleString()} P</h1>
                    <a className='btn btn-primary' href='/point/charge'>충전하기</a>
                </div>
            )}

            {tab === 'mail' && (
                <div>
                    <h2>우편함</h2>
                    {messages.length === 0 && (
                        <h3 className='state'>받은 우편이 없습니다.</h3>
                    )}
                    {messages.length > 0 && (
                        <div className='file-list'>
                            {messages.map((m, i) => (
                                <div className='file-item' key={i}>
                                    {typeof m === 'string'
                                        ? m
                                        : (
                                            <span>
                                                {m.title ?? m.content ?? m.message ?? JSON.stringify(m)}
                                                {m.createdAt && <span>&nbsp;&nbsp;&nbsp;{new Date(m.createdAt).toLocaleDateString()}</span>}
                                            </span>
                                        )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MyPage;
