import { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import {DateUtils} from '../../../backend/src/utils/dateUtils'


function FileListGym() {
	const [category, setCategory] = useState('image')
	
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	type dataType = {
		files:[],
		id:[],
		name:String,
		end_time:Number,
		start_price:[]

	}
	const [data, setData] = useState<dataType>({ files: [], id:[] ,name:"",end_time:0,start_price:[] })
	const [keywordInput, setKeywordInput] = useState('')
	const [keyword, setKeyword] = useState('')

	useEffect(() => {
		let cancelled = false
		const fetchList = async () => {
			setLoading(true)
			setError(null)
			try{
				const res = await axios.post(import.meta.env.API_VALUE+`/download/gym/${category}`, { keyword }, { withCredentials: true })
				if(!cancelled){
				  setData(res.data ?? { files: [], id: [] ,name:"",end_time:0,start_price:0
				  })
				}
			}catch(e){
				if(!cancelled){
					setError('목록을 불러오지 못했습니다.')
					setData({files: [], id: [] ,name:"",end_time:0,start_price:[]})
				}
			}finally{
				if(!cancelled) setLoading(false)
			}
		}
		fetchList()
		return () => { cancelled = true }
	}, [category, keyword])

	const handleSearch = (e:any) => {
		e.preventDefault()
		setKeyword(keywordInput.trim())
	}
	const deleteFile = async (id:string) => {
		try{
			const res = await axios.get(import.meta.env.API_VALUE+`/writer_delete/gym/${category}/${id}`, { withCredentials: true }).then(res => {
				if(res.data.success){
					alert('파일 삭제 완료')
				location.href = '/download/gym';
				}
			})
		}catch(e){
			alert(e)
		}finally{
			location.href = '/download/gym';
		}
	}
	return (
		<div className='page'>
			<h1 className='page-title'>경매 다운로드</h1>
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
			{!loading && (!data || !data.files || data.files.length === 0) && <h3 className='state'>{keyword ? `'${keyword}'에 대한 검색 결과가 없습니다.` : '업로드된 파일이 없습니다.'}</h3>}

			{!loading && data && data.files && data.files.length > 0 && (
				<div className={`fileList_${category} file-list`}>
					{data.files.map((f:any, i: number) => (
						<div className='file-item' key={data.id?.[i] ?? i}>
							<a href={`/download/gym/${category}/${data.id?.[i]}`}>No.{i+1}&nbsp;&nbsp;&nbsp;{f.title}&nbsp;&nbsp;&nbsp;{f.size}&nbsp;&nbsp;&nbsp;입찰가:{f.start_price*100}원&nbsp;&nbsp;&nbsp;마감시간:{DateUtils.date_to_string(f.end_time)}
							</a>
							<span className='file-item-right'>
								<a className='profile-link' href={`/profile/${encodeURIComponent(f.uploader)}`}>
									{f.uploader}&nbsp;<span className='level-tag'>Lv.{f.uploader_level ?? 1}</span>
								</a>
								{f.uploader!==data.name && <a className='file-del' onClick={() => deleteFile(data.id?.[i])}>폐쇄</a>}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default FileListGym