import { useState, useEffect } from 'react'
import axios from 'axios'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import '../../App.css'

const clientKey = import.meta.env.VITE_VITE_TOSS_CLIENT_KEY
const PRESET_AMOUNTS = [10000, 30000, 50000, 100000]

function PointCharge() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [amount, setAmount] = useState(10000)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        let cancelled = false
        axios.get(import.meta.env.VITE_API_VALUE+'/mypage', { withCredentials: true })
            .then((res) => {
                if (!cancelled) setUser(res.data.user ?? null)
            })
            .catch((error) => console.log(error))
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    const charge = async () => {
        if (!user) return
        const value = Number(amount)
        if (!Number.isInteger(value) || value < 1000) {
            alert('충전 금액은 1,000원 이상, 1원 단위로 입력해주세요.')
            return
        }
        if (!clientKey) {
            alert('결제 설정이 완료되지 않았습니다. (VITE_TOSS_CLIENT_KEY 누락)')
            return
        }

        setSubmitting(true)
        try {
            const res = await axios.post(
               import.meta.env.VITE_API_VALUE+'/payment/point/order',
                { amount: value },
                { withCredentials: true },
            )
            if (!res.data.success) {
                alert(res.data.message)
                return
            }

            const tossPayments = await loadTossPayments(clientKey)
            const payment = tossPayments.payment({ customerKey: user._id })

            await payment.requestPayment({
                method: 'CARD',
                amount: { currency: 'KRW', value },
                orderId: res.data.orderId,
                orderName: res.data.orderName,
                customerName: res.data.customerName,
                successUrl: `${window.location.origin}/point/charge/success`,
                failUrl: `${window.location.origin}/point/charge/fail`,
            })
        } catch (error) {
            if (error?.code !== 'USER_CANCEL') {
                console.log(error)
                alert(error?.message ?? '결제 요청 중 오류가 발생했습니다.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className='page'>
                <h1 className='page-title'>포인트 충전</h1>
                <div className='state'>로딩 중...</div>
            </div>
        )
    }

    if (user === null) {
        return (
            <div className='page'>
                <h1 className='page-title'>포인트 충전</h1>
                <h3 className='state'>로그인 해주세요.</h3>
                <div style={{ textAlign: 'center' }}>
                    <a className='btn btn-primary' href='/login'>로그인 하러 가기</a>
                </div>
            </div>
        )
    }

    return (
        <div className='page'>
            <h1 className='page-title'>포인트 충전</h1>

            <div className='card'>
                <div className='point-balance'>
                    <span>현재 보유 포인트</span>
                    <strong>{(user.point ?? 0).toLocaleString()} P</strong>
                </div>

                <div className='point-presets'>
                    {PRESET_AMOUNTS.map((v) => (
                        <button
                            key={v}
                            type='button'
                            className={`tab${amount === v ? ' tab-active' : ''}`}
                            onClick={() => setAmount(v)}
                        >
                            {v.toLocaleString()}원
                        </button>
                    ))}
                </div>

                <input
                    className='field'
                    type='number'
                    min={1000}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />

                <button
                    className='btn btn-primary btn-block'
                    style={{ marginTop: 14 }}
                    disabled={submitting}
                    onClick={charge}
                >
                    {submitting ? '요청 중...' : `${Number(amount || 0).toLocaleString()}원 충전하기`}
                </button>

                <p className='point-notice'>1원 = 1포인트로 충전되며, 충전 후 취소/환불은 마이페이지에서 문의해주세요.</p>
            </div>
        </div>
    )
}

export default PointCharge
