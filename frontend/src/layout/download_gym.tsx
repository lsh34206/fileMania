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
	useEffect(() => {
		let cancelled = false
		const fetchList = async () => {
			setLoading(true)
			setError(null)
			try{
				const res = await axios.post(`http://localhost:8080/download/gym/${category}`, {}, { withCredentials: true })
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
	}, [category])
	const deleteFile = async (id:string) => {
		try{
			const res = await axios.get(`http://localhost:8080/writer_delete/gym/${category}/${id}`, { withCredentials: true }).then(res => {
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
		<div>
			<h1>경매 다운로드</h1>
			<div>
				<button onClick={() => setCategory('image')}>이미지&nbsp;&nbsp;</button>
				<button onClick={() => setCategory('video')}>비디오&nbsp;&nbsp;</button>
				<button onClick={() => setCategory('audio')}>오디오&nbsp;&nbsp;</button>
				<button onClick={() => setCategory('document')}>문서&nbsp;&nbsp;</button>
				<button onClick={() => setCategory('app')}>프로그램/앱</button>
			</div>

			{loading && <div>로딩 중...</div>}
			{error && <div>{error}</div>}
			{!loading && (!data || !data.files || data.files.length === 0) && <h3>업로드된 파일이 없습니다.</h3>}

			{!loading && data && data.files && data.files.length > 0 && (
				<div className={`fileList_${category}`}>
					{data.files.map((f:any, i: number) => (
						<div key={data.id?.[i] ?? i}>
							<a href={`/download/gym/${category}/${data.id?.[i]}`}>No.{i+1}&nbsp;&nbsp;&nbsp;{f.title}&nbsp;&nbsp;&nbsp;{f.size}&nbsp;&nbsp;&nbsp;입찰가:{data.start_price?.[i]}원&nbsp;&nbsp;&nbsp;마감시간:{DateUtils.date_to_string(f.end_time)}</a> &nbsp;&nbsp;&nbsp;{!f.writer_is_me ? <span></span> : <a onClick={() => deleteFile(data.id?.[i])}>폐쇄</a>}<br /><br />    
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default FileListGym