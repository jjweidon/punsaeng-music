# 풍생 음악 신청 시스템

간단한 웹 기반 음악 신청 시스템입니다. 학생들이 노래를 신청하고 방송반이 신청 목록을 확인할 수 있습니다.

## 기술 스택

- 프론트엔드: HTML, CSS (Tailwind CSS), Vanilla JavaScript
- 백엔드: Node.js, Express.js
- 데이터베이스: MongoDB

## 설치 방법

1. MongoDB 설치
   - [MongoDB 공식 사이트](https://www.mongodb.com/try/download/community)에서 MongoDB를 다운로드하고 설치합니다.
   - MongoDB 서버를 실행합니다.

2. 프로젝트 설정
   ```bash
   # 의존성 설치
   npm install

   # 서버 실행
   node src/server.js
   ```

3. 웹 브라우저에서 `http://localhost:3000`으로 접속합니다.

## 주요 기능

- 노래 신청하기 (제목, 가수, 신청 이유)
- 신청된 노래 목록 확인
- 실시간 목록 업데이트

## 학습 포인트

1. HTML/CSS
   - HTML 구조 이해
   - CSS를 통한 스타일링
   - Tailwind CSS 사용법

2. JavaScript
   - DOM 조작
   - 이벤트 처리
   - 비동기 프로그래밍 (async/await)
   - Fetch API 사용

3. 백엔드
   - Express.js로 서버 구축
   - REST API 구현
   - MongoDB를 통한 데이터 관리 