import { useEffect, useState } from 'react'
import axios from 'axios'
import '../App.css'

function FileListPaid() {
	const [category, setCategory] = useState('image')
	const [data, setData] = useState({ files: [], id: [] } as any)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false
		const fetchList = async () => {
			setLoading(true)
			setError(null)
			try {
				const res = await axios.post(
					`http://localhost:8080/download/paid/${category}`,
					{},
					{ withCredentials: true },
				)
				if (!cancelled) {
					setData(res.data ?? { files: [], id: [] })
					
				}
			} catch {
				if (!cancelled) {
					setError('목록을 불러오지 못했습니다.')
					setData({ files: [], id: [] })
				}
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		console.log(data)
		fetchList()
		return () => {
			cancelled = true
		}
	}, [category])

	const deleteFile = async (id: string) => {
		try {
			await axios
				.get(`http://localhost:8080/writer_delete/paid/${category}/${id}`, {
					withCredentials: true,
				})
				.then((res) => {
					if (res.data.success) {
						alert('파일 삭제 완료')
						location.href = '/download/paid'
					}
				})
		} catch (e) {
			alert(e as any)
		} finally {
			location.href = '/download/paid'
		}
	}

	return (
		<div>
			<h1>유료 다운로드</h1>
			<div>
				<button onClick={() => setCategory('image')}>이미지&nbsp;&nbsp;</button>
				<button onClick={() => setCategory('video')}>비디오&nbsp;&nbsp;</button>
				<button onClick={() => setCategory('audio')}>오디오&nbsp;&nbsp;</button>
				<button onClick={() => setCategory('document')}>문서&nbsp;&nbsp;</button>
				<button onClick={() => setCategory('app')}>프로그램/앱</button>
			</div>

			{loading && <div>로딩 중...</div>}
			{error && <div>{error}</div>}
			{!loading && (!data || !data.files || data.files.length === 0) && (
				<h3>업로드된 파일이 없습니다.</h3>
			)}

			{!loading && data && data.files && data.files.length > 0 && (
				<div className={`fileList_${category}`}>
					{data.files.map((f: any, i: number) => (
						<div key={data.id?.[i] ?? i}>
							<a href={`/download/paid/${category}/${data.id?.[i]}`}>
								No.{i + 1}&nbsp;&nbsp;&nbsp;{f.title}&nbsp;&nbsp;&nbsp;{f.size}
								&nbsp;&nbsp;&nbsp;{f.price}원
							</a>{' '}
							&nbsp;&nbsp;&nbsp;
							{!data.writer_is_me ? (
								<span />
							) : (
								<a onClick={() => deleteFile(data.id?.[i])}>삭제</a>
							)}
							<br />
							<br />
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default FileListPaid;