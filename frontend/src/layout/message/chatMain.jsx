import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'

const TYPE_LABEL = {
    gym: '경매',
    trade: '일반',
}

function formatChatTime(date) {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''

    const now = new Date()
    const isToday = d.getFullYear() === now.getFullYear()
        && d.getMonth() === now.getMonth()
        && d.getDate() === now.getDate()

    if (isToday) {
        return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function ChatRoomItem({ room }) {
    return (
        <a className='chat-room' href={`/chat/${room._id}`}>
            <span className='chat-room-type'>{TYPE_LABEL[room.type] ?? room.type}</span>
            <span className='chat-room-body'>
                <span className='chat-room-title'>{room.title ?? '채팅방'}</span>
                <span className='chat-room-msg'>{room.last_message || '아직 메시지가 없습니다.'}</span>
            </span>
            <span className='chat-room-time'>{formatChatTime(room.last_message_time)}</span>
        </a>
    )
}

function ChatMain() {
    const [name, setName] = useState(null)
    const [chatList, setChatList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        const fetchChatList = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.get(import.meta.env.VITE_API_VALUE+'/chat', { withCredentials: true })
                if (cancelled) return

                setName(res.data.name ?? null)

                const payload = res.data.data
                if (payload?.success) {
                    setChatList(payload.data?.chatList ?? [])
                } else if (res.data.name != null) {
                    setError(payload?.message ?? '채팅 목록을 불러오지 못했습니다.')
                }
                console.log(res.data)
            } catch (error) {
                if (!cancelled) {
                    setError('채팅 목록을 불러오지 못했습니다.')
                    console.log(error)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        fetchChatList()
        return () => {
            cancelled = true
        }
    }, [])

    if (loading) {
        return (
            <div className='page'>
                <h1 className='page-title'>채팅방 목록</h1>
                <div className='state'>로딩 중...</div>
            </div>
        )
    }

    if (name === null) {
        return (
            <div className='page'>
                <h1 className='page-title'>채팅방 목록</h1>
                <h3 className='state'>로그인 해주세요.</h3>
                <div style={{ textAlign: 'center' }}>
                    <a className='btn btn-primary' href='/login'>로그인 하러 가기</a>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='page'>
                <h1 className='page-title'>채팅방 목록</h1>
                <div className='state state-error'>{error}</div>
            </div>
        )
    }

    return (
        <div className='page'>
            <h1 className='page-title'>{name}님의 채팅방</h1>

            <div className='card'>
                {chatList.length === 0 && (
                    <h3 className='state'>참여중인 채팅방이 없습니다.</h3>
                )}
                {chatList.length > 0 && (
                    <div className='chat-list'>
                        {chatList.map((room, i) => (
                            <ChatRoomItem key={room._id ?? i} room={room} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatMain;
