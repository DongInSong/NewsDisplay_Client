# 탁상 뉴스 디스플레이 클라이언트

## 프로젝트 정보

개발 기간: 2023. 02 - 2023. 06
개발 인원: 3명
개인 역할: 백엔드 설계 및 개발

  주요 기여 및 담당 업무
   * 클라이언트
     - webContents, ipcMain, ipcRender  이용한 IPC 통신 구현 (receive, send, invoke)
     - 기능 구현
        디지털 시계 타임존 실시간 변경
        트랜드 뉴스 카테고리 실시간 변경
        트랜드 뉴스 키워드 실시간 변경
        사용자 정보 실시간 변경
        하드웨어 디스플레이 화면 밝기 변경
     - 로컬 설정 관리 시스템

## 예상도

![창융설2  Copy of Untitled (1)](https://github.com/user-attachments/assets/222deb10-46d5-4371-82f9-5f795a9786c3)

# 구현

## 1. 기기

![KakaoTalk_20241122_183547486](https://github.com/user-attachments/assets/340dff7e-8435-4a60-84b8-9afe46ea422a)

## 2. 메인메뉴

![Screenshot_20230615_003553](https://github.com/user-attachments/assets/f4a1a904-f3a9-41d8-afcc-8c48e059cb3a)

## 3. 설정 (타임존)

![Screenshot_20230615_003113](https://github.com/user-attachments/assets/b5bd6266-8074-4409-84c4-2edd5a7d76d5)

## 4. 설정 (기기 밝기 15 ~ 255)

![Screenshot_20230615_003204](https://github.com/user-attachments/assets/75189f79-e0e6-46e4-8888-07af3813b74c)

## 5. 엔지니어링 페어 2023 출품

![KakaoTalk_20241122_183547252](https://github.com/user-attachments/assets/6da7ae80-5e2c-47fb-b31e-5e36b61cd375)

## 6. 설치 및 실행 방법

```bash
npm install
npm start
```
