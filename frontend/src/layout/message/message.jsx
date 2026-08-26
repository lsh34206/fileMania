import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'

const MAIL_PAGE_SIZE = 5

function formatMailDate(date) {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    })
}

function MailItem({ mail, open, onToggle, onDelete }) {
    if (typeof mail === 'string') {
        return <div className='mail-item'><div className='mail-content'>{mail}</div></div>
    }
    return (
        <div className={`mail-item${open ? ' mail-item-open' : ''}`} onClick={onToggle}>
            <div className='mail-head'>
                <span className='mail-name'>{mail.sender_name ?? '알 수 없음'}</span>
                <span className='mail-arrow'>→</span>
                <span className='mail-name'>{mail.receiver_name ?? '알 수 없음'}</span>
                <span className='mail-date'>{formatMailDate(mail.createAt ?? mail.createdAt)}</span>
                {mail.id && (
                    <span
                        className='mail-del'
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete()
                        }}
                    >
                        삭제
                    </span>
                )}
            </div>
            {open ? (
                <div className='mail-content'>{mail.message}</div>
            ) : (
                <div className='mail-preview'>{mail.message}</div>
            )}
        </div>
    )
}

function Message() {
    const [name, setName] = useState(null)
    const [mailList, setMailList] = useState([])
    const [chatRooms, setChatRooms] = useState([])
    const [tradeRooms, setTradeRooms] = useState([])
    const [mailCount, setMailCount] = useState(MAIL_PAGE_SIZE)
    const [openMailId, setOpenMailId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        const fetchMessage = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.get('http://localhost:8080/message', { withCredentials: true })
                if (!cancelled) {
                    setName(res.data.name ?? null)
                    setMailList(res.data.mailList ?? [])
                    setChatRooms(res.data.chatRooms ?? [])
                    setTradeRooms(res.data.tradeRooms ?? [])
                }
                console.log(res.data)
            } catch (error) {
                if (!cancelled) {
                    setError('채팅을 불러오지 못했습니다.')
                    console.log(error)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        fetchMessage()
        return () => {
            cancelled = true
        }
    }, [])

    const deleteMail = async (mailId) => {
        if (!window.confirm('이 우편을 삭제하시겠습니까?')) return
        try {
            const res = await axios.delete(`http://localhost:8080/message/${mailId}`, { withCredentials: true })
            if (!res.data.success) {
                alert(res.data.message)
                return
            }
            setMailList((prev) => prev.filter((m) => (typeof m === 'string' ? true : m.id !== mailId)))
            setOpenMailId((prev) => (prev === mailId ? null : prev))
        } catch (error) {
            alert('우편 삭제에 실패했습니다.')
            console.log(error)
        }
    }

    if (loading) {
        return (
            <div className='page'>
                <h1 className='page-title'>채팅</h1>
                <div className='state'>로딩 중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='page'>
                <h1 className='page-title'>채팅</h1>
                <div className='state state-error'>{error}</div>
            </div>
        )
    }

    if (name === null) {
        return (
            <div className='page'>
                <h1 className='page-title'>채팅</h1>
                <h3 className='state'>로그인 해주세요.</h3>
                <div style={{ textAlign: 'center' }}>
                    <a className='btn btn-primary' href='/login'>로그인 하러 가기</a>
                </div>
            </div>
        )
    }

  
    const visibleMails = mailList.slice(0, mailCount)

    return (
        <div className='page'>
            <h1 className='page-title'>{name}님의 채팅</h1>

            <div className='card'>
                <h2>우편함</h2>
                {mailList.length === 0 && (
                    <h3 className='state'>받은 우편이 없습니다.</h3>
                )}
                {mailList.length > 0 && (
                    <div className='mail-list'>
                        {visibleMails.map((mail, i) => {
                            const key = mail.id ?? i
                            return (
                                <MailItem
                                    key={key}
                                    mail={mail}
                                    open={openMailId === key}
                                    onToggle={() => setOpenMailId(openMailId === key ? null : key)}
                                    onDelete={() => deleteMail(key)}
                                />
                            )
                        })}
                    </div>
                )}
                {mailCount < mailList.length && (
                    <div style={{ textAlign: 'center', margin: '12px 0' }}>
                        <button className='btn' onClick={() => setMailCount(mailCount + MAIL_PAGE_SIZE)}>
                            더보기 ({mailCount}/{mailList.length})
                        </button>
                    </div>
                )}
            </div>

            <div className='card'>
                <h2>채팅방 목록</h2>
                {chatRooms.length === 0 && (
                    <h3 className='state'>참여중인 채팅방이 없습니다.</h3>
                )}
                {chatRooms.length > 0 && (
                    <div className='file-list'>
                        {chatRooms.map((room, i) => (
                            <div className='file-item' key={room._id ?? i}>
                                <a href={`/download/gym/${room.file_type}/${room.file_id}`}>
                                    [경매]&nbsp;&nbsp;&nbsp;{room.title}
                                    &nbsp;&nbsp;&nbsp;현재가 {(room.current_price ?? 0).toLocaleString()}P
                                    &nbsp;&nbsp;&nbsp;{room.highest_bidder_name ? `최고 입찰자 ${room.highest_bidder_name}` : '입찰자 없음'}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='card'>
                <h2>거래채팅방 목록</h2>
                {tradeRooms.length === 0 && (
                    <h3 className='state'>진행중인 거래가 없습니다.</h3>
                )}
                {tradeRooms.length > 0 && (
                    <div className='file-list'>
                        {tradeRooms.map((room, i) => (
                            <div className='file-item' key={room._id ?? i}>
                                <a href={`/download/gym/${room.file_type}/${room.file_id}`}>
                                    [{room.status === 'paid' ? '거래완료' : '거래중'}]&nbsp;&nbsp;&nbsp;{room.title}
                                    &nbsp;&nbsp;&nbsp;낙찰가 {(room.current_price ?? 0).toLocaleString()}P
                                    &nbsp;&nbsp;&nbsp;{room.highest_bidder_name ? `낙찰자 ${room.highest_bidder_name}` : '유찰'}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Message;
