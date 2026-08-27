import { useEffect,useRef, useState } from 'react'
import {DateUtils} from '../../../../backend/src/utils/dateUtils';
import axios from 'axios'
import '../../App.css'

function View() {

    const pathParts = window.location.pathname.split('/').filter(item => item !== '')
    const category = pathParts[pathParts.length - 2]
    const id = pathParts[pathParts.length - 1]

    const [post, setPost] = useState(null)
    const [myName, setMyName] = useState(null)
    const [myId, setMyId] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [writeIsMe,setWriteIsMe] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);

    // 새 댓글 입력
    const [commentInput, setCommentInput] = useState('')
    // 답글 작성 대상 댓글 id (null 이면 답글 작성 중 아님)
    const [replyTo, setReplyTo] = useState(null)
    const [replyInput, setReplyInput] = useState('')
 
    const fetchPost = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(
               import.meta.env.API_VALUE+`/community/${category}/${id}`,
                { withCredentials: true },
            ).then(res => {
                console.log(res.data)
                
                setPost(res.data.post ?? null)
                setComments(res.data.post?.comment ?? [])
            setMyName(res.data.name)
            setMyId(res.data.viewer ?? null);
            setWriteIsMe(res.data.writer_is_me)
            setIsAdmin(res.data.is_admin ?? false)
                 
            })
            
           
            
        } catch (err) {
            console.log(err)
            setError('게시글을 불러오지 못했습니다.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [category, id])

    // 게시글 좋아요
    const likePost = async () => {
        try {
            const res = await axios.post(
               import.meta.env.API_VALUE+`/community/like/${id}`,
                {},
                { withCredentials: true },
            )
            if (res.data.success) {
                setPost({ ...post, like_count: res.data.like_count })

                window.location.reload()
            } else {
                alert(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    // 댓글 / 답글 작성 (parentId 가 있으면 답글)
    const submitComment = async (content, parentId) => {
        if (!content.trim()) {
            alert('내용을 입력해주세요.')
            return
        }
        try {
            const res = await axios.post(
                import.meta.env.API_VALUE+`/community/comment/${id}`,
                { content:content, parent_id: parentId ?? null ,writer:myId ?? null},
                { withCredentials: true },
            )
            if (res.data.success) {
                setCommentInput('')
                setReplyInput('')
                setReplyTo(null)
                fetchPost()
            } else {
                alert(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const deleteComment = async (commentId) => {
        try{
            const res = await axios.post(
                import.meta.env.API_VALUE+`/community/comment_delete/${id}/${category}/${commentId}`,
                { },
                { withCredentials: true },
            )
            if (res.data.success) {
             

                location.href=`/community/${category}/${id}`
            } else {
                alert(res.data.message)
            }
        }catch(error){
            console.log(error)
        }
    }

    const deletePost = async (postId) => {
        try{
            const res = await axios.post(
             import.meta.env.API_VALUE+`/community/post_delete/${postId}/${category}`,
                { },
                { withCredentials: true },
            )
            if (res.data.success) {
             

                location.href=`/community/${category}`
            } else {
                alert(res.data.message)
            }
        }catch(error){
            console.log(error)
        }
    }
    // 댓글 좋아요
    const likeComment = async (commentId) => {
        try {
            const res = await axios.post(
                import.meta.env.API_VALUE+`/community/comment_like/${id}/${commentId}`,
                { },
                { withCredentials: true },
            )
            if (res.data.success) {
                setComments(comments.map(c =>
                    c.comment_id === commentId ? { ...c, like_count: res.data.like_count } : c
                ))

                window.location.reload()
            } else {
                alert(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    if (loading) {
        return <div className='state'>로딩중...</div>
    }
    if (error) {
        return <div className='state state-error'>{error}</div>
    }
    if (!post) {
        return <h3 className='state'>게시글이 없습니다.</h3>
    }

    // 최상위 댓글과 답글 분리


    const repliesOf = (parentId) => comments.find(c => c.comment_id === parentId)?.reply_list ?? []

    const renderComment = (c) => c.map(comment => {
        console.log(myName);
        return(
        <div className='comment-item' key={comment.comment_id}>
            <div className='comment-head'>
                <span className='comment-writer'>
                    <a className='profile-link' href={`/profile/${encodeURIComponent(comment.writer)}`}>{comment.writer}</a>
                </span>
                <span className='comment-date'>{comment.createdAt}</span>
            </div>
            <div className='comment-content'>{comment.content}</div>
            <div className='comment-actions'>
                <a onClick={() => likeComment(comment.comment_id)}>좋아요 {comment.like_count ?? 0}</a>
                <a onClick={() => { setReplyTo(replyTo === comment.comment_id ? null : comment.comment_id); setReplyInput('') }}>답글 달기</a>
                {(comment.writer == myName || isAdmin) ? (<a onClick={() => deleteComment(comment.comment_id)}>삭제</a>) : (null)}
            </div>

            {/* 답글 입력창 */}
            {replyTo === comment.comment_id && (
                <div className='reply-form'>
                    <textarea
                        className='field'
                        rows={2}
                        placeholder='답글을 입력하세요'
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                    />
                    <button className='btn btn-primary' onClick={() => submitComment(replyInput, comment.comment_id)}>답글 작성</button>
                </div>
            )}

            {/* 답글 목록 */}
            {repliesOf(comment.comment_id).length > 0 && (
                <div className='reply-list'>
                    {repliesOf(comment.comment_id).map(r => (
                        <div className='comment-item reply-item' key={r.comment_id}>
                            <div className='comment-head'>
                                <span className='comment-writer'>
                                    <a className='profile-link' href={`/profile/${encodeURIComponent(r.writer)}`}>{r.writer}</a>
                                </span>
                                <span className='comment-date'>{r.createdAt}</span>
                            </div>
                            <div className='comment-content'>{r.content}</div>
                            <div className='comment-actions'>
                                <a onClick={() => likeComment(r.comment_id)}>좋아요 {r.like_count ?? 0}</a>
                                {(r.writer== myName || isAdmin)? ( <a onClick={() => deleteComment(r.comment_id)}>삭제</a>):(null)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

   ) });
        

    return (
        <div className='page'>
            <div className='card'>
                {/* 글 제목 / 작성자 / 작성시간 */}
                <h1 className='page-title'>{post.title}</h1>
                <div className='view-meta'>
                    <span>작성자: <a className='profile-link' href={`/profile/${encodeURIComponent(post.writer)}`}>{post.writer}</a></span>
                    <span>{'작성시간: ' +DateUtils.date_to_string(post.createdAt)}</span>
                    <span>{'조회수: ' + (post.view_count ?? 0)}</span>
                </div>

                {/* 글 내용 */}
                <div className='view-desc'>{post.content}</div>

                {/* 게시글 좋아요 */}
                <div className='view-action'>
                    <button className='btn btn-primary' onClick={likePost}>♥ 좋아요 {post.like_count ?? 0}</button>
                    { writeIsMe ? (<a className='btn' href={`/community/edit/${category}/${id}`}>수정</a>) : (null)}
                    { (writeIsMe || isAdmin) ? (<button className='btn btn-primary' onClick={() => deletePost(id)}>삭제</button>) : (null)}
                </div>

                <hr />

                {/* 댓글 영역 */}
                <h3 className='page-subtitle'>댓글 {comments.length}</h3>

                {/* 댓글 입력창 */}
                <div className='comment-form'>
                    <textarea
                        className='field'
                        rows={3}
                        placeholder='댓글을 입력하세요'
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button className='btn btn-primary' onClick={() => submitComment(commentInput, (null))}>댓글 작성</button>
                </div>

                {/* 댓글 목록 */}
                <div className='comment-list'>
                    {comments.length === 0 && <div className='state'>첫 댓글을 남겨보세요.</div>}
                    {renderComment(comments)}
                </div>
            </div>
        </div>
    )
}
export default View
