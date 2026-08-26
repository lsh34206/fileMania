import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import '../../App.css'

const socket = io('http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080', {
    withCredentials: true,
})

function formatMessageTime(date) {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''

    const now = new Date()
    const isToday = d.getFullYear() === now.getFullYear()
        && d.getMonth() === now.getMonth()
        && d.getDate() === now.getDate()

    const time = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    if (isToday) return time
    return `${d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })} ${time}`
}

function ChatRoom() {
    const pathParts = window.location.pathname.split('/').filter((item) => item !== '')
    const roomId = pathParts[pathParts.length - 1]

    const [name, setName] = useState(null)
    const [userId, setUserId] = useState(null)
    const [room, setRoom] = useState(null)
    const [participants, setParticipants] = useState({})
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const joinedRef = useRef(false)
    const listRef = useRef(null)

    // 로그인 정보(userId) 로드
    useEffect(() => {
        let cancelled = false
        axios.get('http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/chat', { withCredentials: true })
            .then((res) => {
                if (cancelled) return
                setName(res.data.name ?? null)
                const payload = res.data.data
                if (payload?.success) {
                    setUserId(payload.data?.userId ?? null)
                }
                setLoading(false)
            })
            .catch((error) => {
                if (cancelled) return
                console.log(error)
                setError('채팅방을 불러오지 못했습니다.')
                setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    // 방 입장
    useEffect(() => {
        if (!userId || joinedRef.current) return
        joinedRef.current = true

        socket.emit('join_chat_room', { roomId, userId }, (res) => {
            if (res && !res.success) {
                setError(res.message)
            }
        })
    }, [userId, roomId])

    // 소켓 리스너
    useEffect(() => {
        const onHistory = (data) => {
            setRoom(data.room ?? null)
            setParticipants(data.participants ?? {})
            setMessages(data.messages ?? [])
        }
        const onReceive = (msg) => {
            setMessages((prev) => [...prev, msg])
        }

        socket.on('chat_history', onHistory)
        socket.on('receive_message', onReceive)

        return () => {
            socket.off('chat_history', onHistory)
            socket.off('receive_message', onReceive)
        }
    }, [])

    // 새 메시지 오면 맨 아래로 스크롤
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight
        }
    }, [messages])

    const sendMessage = () => {
        const text = input.trim()
        if (!text || !userId) return

        socket.emit('send_message', { roomId, userId, message: text }, (res) => {
            if (res && !res.success) {
                alert(res.message)
            }
        })
        setInput('')
    }

    if (loading) {
        return (
            <div className='page'>
                <h1 className='page-title'>채팅방</h1>
                <div className='state'>로딩 중...</div>
            </div>
        )
    }

    if (name === null) {
        return (
            <div className='page'>
                <h1 className='page-title'>채팅방</h1>
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
                <h1 className='page-title'>채팅방</h1>
                <div className='state state-error'>{error}</div>
            </div>
        )
    }

    const partnerName = Object.entries(participants)
        .filter(([pid]) => pid !== String(userId))
        .map(([, pname]) => pname)
        .join(', ')

    return (
        <div className='page'>
            <div className='chatroom-head'>
                <a className='chatroom-back' href='/chat'>←</a>
                <h1 className='page-title' style={{ margin: 0 }}>
                    {room?.title ?? (partnerName ? `${partnerName}님과의 채팅` : '채팅방')}
                </h1>
            </div>

            <div className='card'>
                <div className='chatroom-messages' ref={listRef}>
                    {messages.length === 0 && (
                        <div className='state'>아직 메시지가 없습니다. 첫 메시지를 보내보세요.</div>
                    )}
                    {messages.map((msg, i) => {
                        const mine = String(msg.sender_id) === String(userId)
                        return (
                            <div key={msg._id ?? i} className={`msg-row${mine ? ' msg-row-mine' : ''}`}>
                                {!mine && <span className='msg-sender'>{msg.sender_name ?? '알 수 없음'}</span>}
                                <div className='msg-bubble'>{msg.content}</div>
                                <span className='msg-time'>{formatMessageTime(msg.createdAt)}</span>
                            </div>
                        )
                    })}
                </div>

                <div className='chatroom-input-row'>
                    <input
                        className='field'
                        placeholder='메시지를 입력하세요'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') sendMessage()
                        }}
                    />
                    <button className='btn btn-primary' onClick={sendMessage}>전송</button>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;
