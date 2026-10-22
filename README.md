# usage-band

Claude Code 입력창 바로 위에 사용량을 한 줄로 보여주는 mod예요.

```
사용량 · 5시간 42% (2시간 10분 후 초기화) · 7일 18% (3일 후 초기화) · 컨텍스트 35% · $1.20
```

- 5시간 / 7일 사용량 한도를 몇 % 썼는지와 초기화까지 남은 시간
- 현재 대화의 컨텍스트 사용률
- 이 세션의 비용
- 한도 중 하나라도 70%를 넘으면 노란색, 90%를 넘으면 빨간색으로 표시돼요.
- 응답이 끝날 때마다, 그리고 한도 사용률이 1%p 바뀔 때마다 갱신돼요.

터미널이나 데스크톱 앱의 로컬 세션에서 동작해요. 클라우드 세션 화면에는 표시되지 않아요.

## 설치

Claude Code 터미널 세션의 입력창에서:

```
/plugin install usage-band --marketplace spacefactoryarchitects/usage-band
```

셸에서:

```
claude plugin install usage-band --marketplace spacefactoryarchitects/usage-band
```

데스크톱 앱에서 `/plugin`이 동작하지 않으면: 입력창 옆 + 버튼 → Plugins → Add marketplace에 `spacefactoryarchitects/usage-band` 입력 → Add plugin.

"Add marketplace?"가 뜨면 `y`, 범위는 기본값(user)을 Enter로 고르면 돼요.

비공개 저장소라서, 설치하는 컴퓨터에 github.com용 git 인증이 있어야 해요 (SSH 키, 또는 `gh auth login` 후 `gh auth setup-git`). 설치 중에 따로 물어보지 않아요.
