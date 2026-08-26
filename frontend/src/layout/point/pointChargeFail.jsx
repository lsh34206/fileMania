import '../../App.css'

function PointChargeFail() {
    const params = new URLSearchParams(window.location.search)
    const message = params.get('message') ?? '결제가 취소되었습니다.'

    return (
        <div className='page'>
            <h1 className='page-title'>포인트 충전 결과</h1>
            <div className='card' style={{ textAlign: 'center' }}>
                <h2>충전 실패</h2>
                <p className='state-error'>{message}</p>
                <a className='btn btn-primary' href='/point/charge'>다시 시도하기</a>
            </div>
        </div>
    )
}

export default PointChargeFail
