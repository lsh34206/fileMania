import { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function FilePurchase() {
  type DataType = {
    file: any
    writer_is_me: boolean
    purchased: boolean
  }
  const [data, setData] = useState<DataType>({ file: null, writer_is_me: false, purchased: false })
  const [point, setPoint] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const pathParts = window.location.pathname.split('/').filter((item) => item !== '')
  const type = pathParts[pathParts.length - 2]
  const id = pathParts[pathParts.length - 1]

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const [viewRes, meRes] = await Promise.all([
          axios.get(`http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/download/paid/${type}/${id}`, { withCredentials: true }),
          axios.get('http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/mypage', { withCredentials: true }),
        ])
        if (cancelled) return
        setData(viewRes.data)
        setPoint(meRes.data.user?.point ?? null)
      } catch (error) {
        console.log(error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [type, id])

  const buy = async () => {
    setSubmitting(true)
    try {
      const res = await axios.post(`http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/purchase/${type}/${id}`, {}, { withCredentials: true })
      if (res.data.success) {
        alert(res.data.message)
        location.href = `/download/paid/${type}/${id}`
      } else {
        alert(res.data.message)
      }
    } catch (error) {
      alert('구매 처리 중 오류가 발생했습니다.')
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='page'>
        <h1 className='page-title'>파일 구매</h1>
        <div className='state'>로딩 중...</div>
      </div>
    )
  }

  if (point === null) {
    return (
      <div className='page'>
        <h1 className='page-title'>파일 구매</h1>
        <h3 className='state'>로그인 해주세요.</h3>
        <div style={{ textAlign: 'center' }}>
          <a className='btn btn-primary' href='/login'>로그인 하러 가기</a>
        </div>
      </div>
    )
  }

  if (!data.file) {
    return (
      <div className='page'>
        <h1 className='page-title'>파일 구매</h1>
        <div className='state state-error'>파일을 찾을 수 없습니다.</div>
      </div>
    )
  }

  if (data.purchased) {
    return (
      <div className='page'>
        <h1 className='page-title'>파일 구매</h1>
        <div className='card' style={{ textAlign: 'center' }}>
          <h2>이미 이용 가능한 파일입니다</h2>
          <a className='btn btn-primary' href={`/download/paid/${type}/${id}`}>파일로 이동</a>
        </div>
      </div>
    )
  }

  const enough = point >= data.file.price

  return (
    <div className='page'>
      <h1 className='page-title'>파일 구매</h1>

      <div className='card'>
        {(type === 'image' || type === 'video') && (
          <div className='purchase-preview'>
            <img
              src={`http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080/media/${type}/${id}/preview`}
              alt={data.file.title}
              className='file_view_image purchase-blur'
            />
            <div className='purchase-overlay'>
              <span>{type === 'video' ? '구매 후 재생 가능합니다' : '구매 후 확인 가능합니다'}</span>
            </div>
          </div>
        )}

        <h2 style={{ margin: '16px 0 4px' }}>{data.file.title}</h2>
        <span className='view-desc'>{data.file.description}</span>

        <div className='purchase-summary'>
          <span>결제 금액</span>
          <strong>{(data.file.price ?? 0).toLocaleString()} P</strong>
        </div>
        <div className='purchase-summary'>
          <span>보유 포인트</span>
          <strong>{point.toLocaleString()} P</strong>
        </div>

        {enough ? (
          <button className='btn btn-primary btn-block' style={{ marginTop: 16 }} disabled={submitting} onClick={buy}>
            {submitting ? '처리 중...' : `${(data.file.price ?? 0).toLocaleString()}P로 구매하기`}
          </button>
        ) : (
          <div style={{ marginTop: 16 }}>
            <p className='state-error' style={{ padding: '4px 0 12px', textAlign: 'center' }}>포인트가 부족합니다.</p>
            <a className='btn btn-primary btn-block' href='/point/charge'>포인트 충전하러 가기</a>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilePurchase
