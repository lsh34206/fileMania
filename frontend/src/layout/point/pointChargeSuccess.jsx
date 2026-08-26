import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'

function PointChargeSuccess() {
    const [status, setStatus] = useState('loading') // loading | success | error
    const [message, setMessage] = useState('')
    const [point, setPoint] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const paymentKey = params.get('paymentKey')
        const orderId = params.get('orderId')
        const amount = params.get('amount')

        if (!paymentKey || !orderId || !amount) {
            setStatus('error')
            setMessage('잘못된 접근입니다.')
            return
        }

        axios.post(
            'http://localhost:8080/payment/point/confirm',
            { paymentKey, orderId, amount: Number(amount) },
            { withCredentials: true },
        ).then((res) => {
            if (res.data.success) {
                setStatus('success')
                setMessage(res.data.message)
                setPoint(res.data.point ?? null)
            } else {
                setStatus('error')
                setMessage(res.data.message ?? '충전 승인에 실패했습니다.')
            }
        }).catch((error) => {
            console.log(error)
            setStatus('error')
            setMessage('충전 승인 중 오류가 발생했습니다.')
        })
    }, [])

    return (
        <div className='page'>
            <h1 className='page-title'>포인트 충전 결과</h1>
            <div className='card' style={{ textAlign: 'center' }}>
                {status === 'loading' && <div className='state'>결제 승인 중...</div>}
                {status === 'success' && (
                    <>
                        <h2>충전 완료</h2>
                        <p>{message}</p>
                        {point !== null && <p>현재 보유 포인트: {point.toLocaleString()} P</p>}
                        <a className='btn btn-primary' href='/mypage/payManage'>마이페이지로 이동</a>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2>충전 실패</h2>
                        <p className='state-error'>{message}</p>
                        <a className='btn btn-primary' href='/point/charge'>다시 시도하기</a>
                    </>
                )}
            </div>
        </div>
    )
}

export default PointChargeSuccess
