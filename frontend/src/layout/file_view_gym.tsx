import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'
import '../App.css'
import { DateUtils } from '../../../backend/src/utils/dateUtils'
const ngrok = "https://2359-124-194-149-252.ngrok-free.app";
const socket: Socket = io(ngrok, {
  withCredentials: true
})

type FileDataType = {
  file: any
  writer_is_me: boolean
  name: string
  id: string
  user_id?: string
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
  })

  const [chatList, setChatList] = useState<ChatType[]>([])
  const [message, setMessage] = useState('')
  const [bidPrice, setBidPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState(0)
  const [highestBidder, setHighestBidder] = useState('')

  const joinedRef = useRef(false)

  const pathParts = window.location.pathname.split('/').filter((item) => item !== '')
  const type = pathParts[pathParts.length - 2]
  const id = pathParts[pathParts.length - 1]

  useEffect(() => {
    axios
      .get(`http://localhost:8080/download/gym/${type}/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data)

        if (res.data.file) {
          setCurrentPrice(res.data.file.current_price ?? res.data.file.start_price ?? 0)
          setHighestBidder(res.data.file.highest_bidder_name ?? '')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [type, id])

  useEffect(() => {
    if (!data.name || joinedRef.current) return

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

    socket.on('receive_chat', receiveChat)
    socket.on('receive_bid', receiveBid)
    socket.on('receive_system', receiveSystem)

    return () => {
      socket.off('receive_chat', receiveChat)
      socket.off('receive_bid', receiveBid)
      socket.off('receive_system', receiveSystem)
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
      const res = await axios.get(`http://localhost:8080/writer_delete/gym/${type}/${id}`, {
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
    return <div>loading...</div>
  }

  return (
    <div>
      <h1>{data.file.title}</h1>

      <p>크기: {data.file.size}</p>
      <p>주최자: {data.file.uploader}</p>
      <p>시작가: {data.file.start_price}원</p>

      <p>현재가: {currentPrice}원</p>
      <p>최고 입찰자: {highestBidder || '없음'}</p>
      <p>마감시간: {DateUtils.date_to_string(data.file.end_time)}</p>

      {data.writer_is_me && <button onClick={deleteFile}>경매 폐쇄</button>}

      <hr />

      <h2>입찰</h2>
      <input
        type="number"
        placeholder="입찰가"
        value={bidPrice}
        onChange={(e) => setBidPrice(e.target.value)}
      />
      <button onClick={sendBid}>입찰하기</button>

      <p>
        제시단위: 100원 / 입찰 취소 불가 / 마감시간 전까지 입찰 가능 / 마감 후 낙찰자 결제
      </p>

      <hr />

      <div id="Chat">
        <h2>채팅방</h2>

        <div>
          {chatList.map((chat, index) => (
            <div key={index}>
              {chat.message_type === 'system' ? (
                <span>[시스템] {chat.message}</span>
              ) : chat.message_type === 'bid' ? (
                <strong>[입찰] {chat.message}</strong>
              ) : (
                <span>
                  {chat.sender_name || data.name}: {chat.message}
                </span>
              )}
            </div>
          ))}
        </div>

        <input
          placeholder="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
        />

        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  )
}

export default FileViewGym