import { useEffect, useState } from 'react'
import axios from 'axios'
import '../App.css'

function FileListFree() {
	const [category, setCategory] = useState('image')
	const [data, setData] = useState({ files: [], id: [] } as any)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [keywordInput, setKeywordInput] = useState('')
	const [keyword, setKeyword] = useState('')

	useEffect(() => {
		let cancelled = false
		const fetchList = async () => {
			setLoading(true)
			setError(null)
			try {
				const res = await axios.post(
					import.meta.env.VITE_API_VALUE+`/download/free/${category}`,
					{ keyword },
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
		fetchList()
		return () => {
			cancelled = true
		}
	}, [category, keyword])

	const handleSearch = (e: any) => {
		e.preventDefault()
		setKeyword(keywordInput.trim())
	}

	const deleteFile = async (id: string) => {
		try {
			await axios
				.get(import.meta.env.VITE_API_VALUE+`/writer_delete/free/${category}/${id}`, {
					withCredentials: true,
				})
				.then((res) => {
					if (res.data.success) {
						alert('파일 삭제 완료')
						location.href = '/download/free'
					}
				})
		} catch (e) {
			alert(e as any)
		} finally {
			location.href = '/download/free'
		}
	}

	return (
		<div className='page'>
			<h1 className='page-title'>무료 다운로드</h1>
			<div className='tabs'>
				<button className='tab' onClick={() => setCategory('image')}>이미지</button>
				<button className='tab' onClick={() => setCategory('video')}>비디오</button>
				<button className='tab' onClick={() => setCategory('audio')}>오디오</button>
				<button className='tab' onClick={() => setCategory('document')}>문서</button>
				<button className='tab' onClick={() => setCategory('app')}>프로그램/앱</button>
			</div>

			<form className='search-row' onSubmit={handleSearch}>
				<input
					className='field'
					type='text'
					placeholder='제목 검색'
					value={keywordInput}
					onChange={(e) => setKeywordInput(e.target.value)}
				/>
				<button className='btn' type='submit'>검색</button>
				{keyword && (
					<button type='button' className='btn' onClick={() => { setKeywordInput(''); setKeyword('') }}>초기화</button>
				)}
			</form>

			{loading && <div className='state'>로딩 중...</div>}
			{error && <div className='state state-error'>{error}</div>}
			{!loading && (!data || !data.files || data.files.length === 0) && (
				<h3 className='state'>{keyword ? `'${keyword}'에 대한 검색 결과가 없습니다.` : '업로드된 파일이 없습니다.'}</h3>
			)}

			{!loading && data && data.files && data.files.length > 0 && (
				<div className={`fileList_${category} file-list`}>
					{data.files.map((f: any, i: number) => (
						<div className='file-item' key={data.id?.[i] ?? i}>
							<a href={`/download/free/${category}/${data.id?.[i]}`}>
								No.{i + 1}&nbsp;&nbsp;&nbsp;{f.title}&nbsp;&nbsp;&nbsp;{f.size}
							</a>
							<span className='file-item-right'>
								<a className='profile-link' href={`/profile/${encodeURIComponent(f.uploader)}`}>
									{f.uploader}&nbsp;<span className='level-tag'>Lv.{f.uploader_level ?? 1}</span>
								</a>
								{data.writer_is_me?.[i] && (
									<>
										<a className='file-edit' href={`/file_upload/edit/free/${category}/${data.id?.[i]}`}>수정</a>
										<a className='file-del' onClick={() => deleteFile(data.id?.[i])}>삭제</a>
									</>
								)}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default FileListFree;