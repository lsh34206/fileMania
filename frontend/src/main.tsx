import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App.tsx'

// 커스텀 헤더: 폼 전송이나 타 출처 요청은 이 헤더를 실어보낼 수 없어 경량 CSRF 방어로 사용된다.
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
