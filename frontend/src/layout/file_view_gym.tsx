import { useEffect, useRef, useState, type CSSProperties } from 'react'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'
import '../App.css'
import { DateUtils } from '../../../backend/src/utils/dateUtils'
const ngrok = "https://2359-124-194-149-252.ngrok-free.app";
const socket: Socket = io( import.meta.env.VITE_SOCKETIO_URI_VALUE,{
  withCredentials: true
})

type FileDataType = {
  file: any
  writer_is_me: boolean
  name: string
  id: string
  user_id?: string
  gym: any,
  bidsList: any[],
  chatList: any[],
}

type ChatType = {
  gym_id?: string
  sender_id?: string
  sender_name?: string
  message: string
  message_type: 'chat' | 'system' | 'bid'
  bid_price?: number
  createdAt?: string
  time?: string
}

function FileViewGym() {
  const [data, setData] = useState<FileDataType>({
    file: null,
    writer_is_me: false,
    name: '',
    id: '',
    gym: null,
    bidsList: [],
    chatList: [],
  })

  const [chatList, setChatList] = useState<ChatType[]>([])
  const [message, setMessage] = useState('')
  const [bidPrice, setBidPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState(0)
  const [highestBidder, setHighestBidder] = useState('')
  const [bidsList, setBidsList] = useState<any[]>([])
  const [gym, setGym] = useState<any>(null)
  const [roomUsers, setRoomUsers] = useState<{ name: string; level: number }[]>([])
  const [time,setTime] = useState<Number>(0);
  const [endTime, setEndTime] = useState<string>('')
  const joinedRef = useRef(false)

  const pathParts = window.location.pathname.split('/').filter((item) => item !== '')
  const type = pathParts[pathParts.length - 2]
  const id = pathParts[pathParts.length - 1]

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_VALUE+`/download/gym/${type}/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data)

        if (res.data.file) {
          setCurrentPrice(res.data.gym.current_price ?? res.data.gym.start_price ?? 0)
          setHighestBidder(res.data.gym.highest_bidder_name ?? '')
          setChatList(res.data.chatList)
          setBidsList(res.data.bidsList)
          setEndTime(res.data.gym.end_time)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [type, id])

  useEffect(() => {
    if (!data.name || joinedRef.current) return
    if (data.gym.status === 'ended') {
      alert('종료된 경매입니다.');
    location.href = '/download/gym';
    
    }
    joinedRef.current = true

    socket.emit('join_gym_room', {
      gymId: id,
      userId: data.user_id,
    })
  }, [data.name, id])

  useEffect(() => {
    const receiveChat = (chat: ChatType) => {
      setChatList((prev) => [...prev, chat])
    }

    const receiveBid = (bidData: any) => {
      setCurrentPrice(bidData.current_price)
      setHighestBidder(bidData.highest_bidder_name)
    }

    const receiveSystem = (msg: ChatType) => {
      setChatList((prev) => [
        ...prev,
        {
          ...msg,
          message_type: 'system',
        },
      ])
    }

    const receiveRoomUsers = (users: { name: string; level: number }[]) => {
      setRoomUsers(users)
    }

    socket.on('receive_chat', receiveChat)
    socket.on('receive_bid', receiveBid)
    socket.on('receive_system', receiveSystem)
    socket.on('receive_room_users', receiveRoomUsers)

    return () => {
      socket.off('receive_chat', receiveChat)
      socket.off('receive_bid', receiveBid)
      socket.off('receive_system', receiveSystem)
      socket.off('receive_room_users', receiveRoomUsers)

    }
  }, [])

  const sendMessage = () => {
    if (!message.trim()) return

    socket.emit('send_chat', {
      gymId: id,
      userId: data.user_id,
      message,
    })

    setMessage('')
  }

  const sendBid = () => {
    const price = Number(bidPrice)

    if (!price || price <= 0) {
      alert('입찰가를 입력해라')
      return
    }

    if (price <= currentPrice) {
      alert('현재가보다 높게 입찰해야 함')
      return
    }

    socket.emit(
      'send_bid',
      {
        gymId: id,
        userId: data.user_id,
        bidPrice: price,
      },
      (res: any) => {
        if (res && !res.success) {
          alert(res.message)
        }
      },
    )

    setBidPrice('')
  }

  const deleteFile = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_VALUE+`/writer_delete/gym/${type}/${id}`, {
        withCredentials: true,
      })

      if (res.data.success) {
        alert('파일 삭제 완료')
        location.href = '/download/gym'
      }
    } catch (e) {
      alert(e)
    }
  }

  if (!data.file) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
        <span style={styles.loadingText}>loading...</span>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* 좌측: 경매 정보 + 입찰 */}
        <section style={styles.mainCol}>
          <header style={styles.titleBar}>
            <span style={styles.badge}>경매</span>
            <h1 style={styles.title}>{data.file.title}</h1>
          </header>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <span style={styles.infoLabel}>크기</span>
              <span style={styles.infoValue}>{data.file.size}</span>
            </div>
            <div style={styles.infoCard}>
              <span style={styles.infoLabel}>주최자</span>
              <span style={styles.infoValue}>{data.gym.seller_name}</span>
            </div>
            <div style={styles.infoCard}>
              <span style={styles.infoLabel}>시작가</span>
              <span style={styles.infoValue}>{data.gym.start_price}원</span>
            </div>
            <div style={styles.infoCard}>
              <span style={styles.infoLabel}>최고 입찰자</span>
              <span style={styles.infoValue}>{highestBidder || '없음'}</span>
            </div>
          </div>

          <div style={styles.pricePanel}>
            <div style={styles.priceBlock}>
              <span style={styles.priceLabel}>현재가</span>
              <span style={styles.priceValue}>{currentPrice}원</span>
            </div>
            <div style={styles.timeBlock}>
              <span style={styles.priceLabel}>종료까지</span>
              <span className='time' style={styles.timeValue}>{time.toString()}</span>
            </div>
          </div>

          {setInterval(()=>{
            const end = Math.floor(new Date(endTime).getTime() /1000);
            const now = Math.floor(Date.now()/1000);
            setTime(end-now);
          },1000)
          }


          <p style={styles.deadline}>마감시간: {DateUtils.date_to_string(endTime)}</p>

          {data.writer_is_me && (
            <button style={styles.dangerBtn} onClick={deleteFile}>경매 폐쇄</button>
          )}

          <div style={styles.divider} />

          <h2 style={styles.sectionTitle}>입찰</h2>
          <div style={styles.bidRow}>
            <input
              style={styles.input}
              type="number"
              placeholder="입찰가"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
            />
            <button style={styles.primaryBtn} onClick={sendBid}>입찰하기</button>
          </div>

          <p style={styles.notice}>
            제시단위: 1원 / 입찰 취소 불가 / 마감시간 전까지 입찰 가능 / 마감 후 낙찰자 결제
          </p>
        </section>

        {/* 우측: 채팅방 */}
        <section id="Chat" style={styles.chatCol}>
          <h2 style={styles.sectionTitle}>채팅방</h2>

          <div style={styles.roomUsersRow}>
            <span style={styles.roomUsersLabel}>👀 접속자 {roomUsers.length}명</span>
            <div style={styles.roomUsersChips}>
              {roomUsers.map((u, i) => (
                <span key={i} style={styles.roomUserChip}>{u.name} <span style={styles.roomUserLevel}>Lv.{u.level ?? 1}</span></span>
              ))}
            </div>
          </div>

          <div style={styles.chatList}>
            {chatList.map((chat, index) => (
              <div key={index} style={styles.chatItem}>
                {chat.message_type === 'system' ? (
                  <span style={styles.systemMsg}>[시스템] {chat.message}</span>
                ) : chat.message_type === 'bid' ? (
                  <strong style={styles.bidMsg}>[입찰] {chat.message}</strong>
                ) : (
                  <span style={styles.chatMsg}>
                    <b style={styles.chatSender}>{chat.sender_name || data.name}</b>
                    {chat.message}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={styles.chatInputRow}>
            <input
              style={styles.input}
              placeholder="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage()
              }}
            />
            <button style={styles.primaryBtn} onClick={sendMessage}>전송</button>
          </div>
        </section>
      </div>
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: '100vh',
    padding: '32px 16px',
    background: 'linear-gradient(160deg, #f5f7fb 0%, #e9edf5 100%)',
    boxSizing: 'border-box',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 24,
    maxWidth: 1100,
    margin: '0 auto',
    alignItems: 'flex-start',
  },
  mainCol: {
    flex: '1 1 480px',
    background: '#ffffff',
    borderRadius: 16,
    padding: 28,
    boxShadow: '0 8px 30px rgba(20, 30, 60, 0.08)',
    textAlign: 'left',
  },
  chatCol: {
    flex: '1 1 360px',
    background: '#ffffff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 8px 30px rgba(20, 30, 60, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  badge: {
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
    background: '#5b6cff',
    padding: '4px 10px',
    borderRadius: 999,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: '#1b2440',
    margin: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '12px 14px',
    background: '#f6f8fc',
    borderRadius: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8a93a8',
    fontWeight: 600,
  },
  infoValue: {
    fontSize: 15,
    color: '#1b2440',
    fontWeight: 700,
  },
  pricePanel: {
    display: 'flex',
    gap: 16,
    padding: 20,
    background: 'linear-gradient(135deg, #5b6cff 0%, #7a5bff 100%)',
    borderRadius: 14,
    color: '#fff',
    marginBottom: 16,
  },
  priceBlock: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  timeBlock: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    borderLeft: '1px solid rgba(255,255,255,0.25)',
    paddingLeft: 16,
  },
  priceLabel: {
    fontSize: 13,
    opacity: 0.85,
    fontWeight: 600,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 800,
  },
  timeValue: {
    fontSize: 28,
    fontWeight: 800,
  },
  deadline: {
    fontSize: 13,
    color: '#8a93a8',
    margin: '0 0 16px',
  },
  divider: {
    height: 1,
    background: '#eef1f6',
    margin: '20px 0',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: '#1b2440',
    margin: '0 0 14px',
  },
  bidRow: {
    display: 'flex',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: '11px 14px',
    border: '1px solid #dfe4ee',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    background: '#fbfcfe',
    color: '#1b2440',
  },
  primaryBtn: {
    padding: '11px 18px',
    border: 'none',
    borderRadius: 10,
    background: '#5b6cff',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  dangerBtn: {
    padding: '9px 16px',
    border: '1px solid #ffd0d0',
    borderRadius: 10,
    background: '#fff5f5',
    color: '#e53e3e',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  notice: {
    fontSize: 12,
    color: '#9aa3b5',
    marginTop: 12,
    lineHeight: 1.6,
  },
  roomUsersRow: {
    marginBottom: 12,
  },
  roomUsersLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#8a93a8',
  },
  roomUsersChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  roomUserChip: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1b2440',
    background: '#f6f8fc',
    padding: '4px 10px',
    borderRadius: 999,
  },
  roomUserLevel: {
    color: '#5b6cff',
    fontWeight: 700,
  },
  chatList: {
    flex: 1,
    minHeight: 320,
    maxHeight: 600,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 12,
    background: '#f6f8fc',
    borderRadius: 12,
    marginBottom: 12,
  },
  chatItem: {
    fontSize: 14,
    lineHeight: 1.5,
  },
  systemMsg: {
    display: 'inline-block',
    fontSize: 12,
    color: '#8a93a8',
    fontStyle: 'italic',
  },
  bidMsg: {
    display: 'inline-block',
    color: '#5b6cff',
  },
  chatMsg: {
    color: '#1b2440',
  },
  chatSender: {
    marginRight: 6,
    color: '#5b6cff',
  },
  chatInputRow: {
    display: 'flex',
    gap: 10,
  },
  loadingWrap: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    background: '#f5f7fb',
  },
  spinner: {
    width: 36,
    height: 36,
    border: '4px solid #dfe4ee',
    borderTopColor: '#5b6cff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#8a93a8',
    fontWeight: 600,
  },
}

export default FileViewGym