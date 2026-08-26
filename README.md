# fileMania (파일매니아)

파일 공유 · 실시간 경매 · 커뮤니티 · 메시징 · 레벨 시스템 · 관리자 도구를 갖춘 풀스택 웹 애플리케이션입니다.

## 주요 기능

### 회원 / 계정
- 회원가입 / 로그인 / 로그아웃 (세션 쿠키 기반), 아이디·이름 중복 방지
- 마이페이지: 내 정보, 자기소개 수정, 포인트 현황, 우편함
- **레벨 / 경험치(XP)**: 활동에 따라 XP 획득 → 레벨업. 임계값은 10부터 레벨당 +10씩 증가하다가 100을 넘어서면 이후로는 ×1.2배씩 증가
  - 글 작성 +3 · 댓글 작성 +1 · 글 좋아요 받음 +3(자기 글 자기 좋아요는 제외) · 파일 업로드 +3 · 파일 구매 +5 · 포인트 충전 +30 · 경매 낙찰 +15
  - 레벨업 시 우편함으로 알림 발송
  - 마이페이지 · 프로필 페이지 · 파일 목록(업로더)에 레벨 표시
- **프로필 페이지** (`/profile/:name`): 글 작성자·댓글 작성자·파일 업로더 이름 클릭 시 이동. 레벨/XP, 자기소개, 가입일, 작성 글 수 등 공개 정보만 노출(이메일·연락처·포인트 등은 비공개)

### 파일 업로드·다운로드
- 이미지 / 비디오 / 오디오 / 문서 / 프로그램·앱, 각각 무료 / 유료 / 경매 방식 지원
- **무료**: 로그인 없이도 열람 가능
- **유료**: 구매 전에는 원본 접근이 서버에서 차단됨
  - 이미지·비디오는 실시간으로 저해상도 블러 미리보기(32px + 블러, `sharp`/`ffmpeg-static`로 생성)만 제공하고, 원본은 구매자(또는 업로더 본인)에게만 스트리밍
  - 강제 다운로드 라우트도 동일하게 구매 여부를 검증
  - 전용 구매 페이지에서 가격·보유 포인트 확인 후 포인트로 결제(구매 금액은 업로더에게 적립)
- **경매(gym)**: 종료 시각이 있는 실시간 경매. Socket.IO로 입찰/채팅을 실시간 중계, 스케줄러(cron)가 종료된 경매를 정산하고 낙찰자에게 우편함 알림 발송
- 파일 목록(무료/유료/경매) 제목 검색, 업로더 본인 항목에 수정·삭제(경매는 폐쇄) 버튼 표시
- 파일 정보(제목/설명/가격) 수정 기능

### 포인트 결제
- 토스페이먼츠(TossPayments) 연동으로 실제 결제 → 포인트 충전 (1P = 1원)

### 커뮤니티
- 게시판: 수다 / 자료 공유 / 질문 / **공지사항**(관리자만 작성 가능)
- 댓글 · 답글, 좋아요, 조회수
- 글 제목·내용 검색, **최신순 / 좋아요순 / 댓글순 / 조회수순** 정렬
- 본인 글·댓글 수정/삭제 (관리자는 타인의 글·댓글도 삭제 가능)

### 메시징
- 우편함: 경매 낙찰·레벨업 등 시스템 알림 메시지 목록, 개별 삭제
- 1:1 채팅방 목록 및 채팅창: Socket.IO 기반 실시간 메시지 송수신

### 홈 화면 & 실시간 접속자
- 대표 글 미리보기: 관리자 공지가 있으면 최신 공지, 없으면 좋아요+댓글 기준 인기글
- 사이트 전체 실시간 접속자 목록
- 경매 진행 화면에 해당 경매방 실시간 접속자 목록

### 관리자 페이지 (`/admin`)
- 회원 관리: 전체 회원 목록, **정지**(기간 지정, 자동 해제), **차단**, **제재 해제**
- 제재된 계정은 로그인 자체가 거부되며, 이미 로그인되어 있던 세션도 **다음 요청 즉시 + Socket.IO를 통한 실시간 강제 연결 종료**로 즉시 로그아웃 처리
- 다른 사용자의 글/댓글 삭제 권한
- 공지사항 작성 권한

## 기술 스택

| 영역 | 스택 |
|---|---|
| Backend | NestJS, MongoDB + Mongoose, Socket.IO, Multer(파일 업로드), sharp + ffmpeg-static(미리보기 생성), bcrypt |
| Frontend | React 19, Vite, TypeScript/JSX, React Router, Axios, socket.io-client, @tosspayments/tosspayments-sdk |
| DB | MongoDB Atlas |

## 프로젝트 구조

```
fileMania/
├── backend/          # NestJS API 서버 (포트 8080)
│   ├── src/
│   │   ├── controller/   # 라우트 핸들러
│   │   ├── service/      # 비즈니스 로직
│   │   ├── module/       # NestJS 모듈 구성
│   │   ├── middleware/   # 전역 미들웨어 (정지/차단 세션 검증 등)
│   │   ├── db/           # Mongoose 스키마
│   │   └── utils/        # 공통 유틸 (레벨 계산 등 프론트와 공유되는 순수 함수 포함)
│   └── files/            # 업로드된 실제 파일 저장 위치 (image/video/audio/document/app)
└── frontend/         # React + Vite 클라이언트 (포트 5173)
    └── src/
        ├── layout/        # 페이지 컴포넌트 (admin/, community/, message/, point/ 등 하위 폴더 포함)
        └── App.tsx        # 라우팅 정의
```

> 일부 프론트엔드 컴포넌트는 `backend/src/utils/*.ts`의 순수 함수(날짜 포맷, 레벨 계산)를 상대 경로로 직접 import해서 재사용합니다. 로직 중복을 피하기 위한 의도적인 구조입니다.

## 시작하기

### 사전 준비

- Node.js 20+
- MongoDB Atlas 연결 문자열 (현재 `backend/src/module/module.ts`에 하드코딩되어 있음)
- 포인트 충전 기능을 쓰려면 [TossPayments 개발자센터](https://developers.tosspayments.com)에서 발급받은 테스트 클라이언트 키 / 시크릿 키

### 설치

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 환경 변수

`backend/.env` (`backend/.env.example` 참고):

```
TOSS_SECRET_KEY=발급받은_시크릿_키
```

`frontend/.env` (`frontend/.env.example` 참고):

```
VITE_TOSS_CLIENT_KEY=발급받은_클라이언트_키
```

두 값이 없어도 포인트 충전 기능만 동작하지 않을 뿐 나머지 기능은 정상 작동합니다.

### 실행

```bash
# 백엔드 (http://localhost:8080)
cd backend
npm run start:debug

# 프론트엔드 (http://localhost:5173)
cd frontend
npm run dev
```

### 관리자 계정

`role: 'admin'`인 계정만 `/admin` 페이지와 공지사항 작성, 타인 글/댓글 삭제 권한을 갖습니다. 현재는 DB에서 직접 `users.role`을 `'admin'`으로 지정하는 방식이며, 별도의 승격 UI는 없습니다.

## 스크립트

**backend**
- `npm run start:debug` — 파일 변경 감지(watch) 개발 서버
- `npm run build` / `npm run start:prod` — 빌드 후 실행
- `npm run test` — 유닛 테스트

**frontend**
- `npm run dev` — Vite 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint
