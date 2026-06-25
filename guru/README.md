<img src="guru.png"> <br/>
> 초단기 사이드잡 매칭 플랫폼, GURU
> 
<br />

* URL : https://hpe-guru.netlify.app/
* Test ID / PW : guru@guru / guru

<br />

## 목차
* [소개](#소개)
* [팀원](#팀원)
* [개발환경](#개발환경)
* [작업방식](#작업방식)
* [구조](#구조)
* [핵심기능](#핵심기능)
* [소감](#소감)

 
<br/>

## 소개
* 현대 사회에서는 직장인 10명 중 9명이 사이드잡을 하고 있거나 할 계획이 있다고 합니다. (출처: 리멤버 리서치) <br />
하지만 정규직, 계약직, 아르바이트, 프리랜서와 같은 일반 구직의 기회는 흔한 반면,
<br /> 사이드잡을 전문으로 다루는 서비스는 부족한 상황입니다.

* 일반적인 구직 사이트에서는 사이드잡을 찾기가 어렵고, 이를 찾기 위해서는 다양한 플랫폼을 활용해야 하는 불편함이 있습니다. <br />
또한, 사이드잡을 제공하는 구인자들 역시 적절한 인재를 찾는 데에 어려움을 겪고 있습니다.
<br />

* GURU는 이러한 문제점을 안고 시작했습니다. <br />
GURU는 초단기 사이드잡을 매칭해 구직자와 구인자 모두의 필요를 충족시키는 서비스입니다. <br />
구직자는 간편하게 사이드잡을 찾을 수 있고, 구인자는 신뢰할 수 있는 인재를 빠르게 찾을 수 있습니다.<br />

<br />

1. 매칭 시스템: 프로필을 통해 구직자의 스킬과 구인자의 요구사항을 기반으로 매칭을 제공합니다.<br />
2. 평가 시스템: 함께 일한 구직자와 구인자의 만족도 조사를 통해 신뢰성을 높입니다.<br />
3. 필터 기능: 위치, 시간, 카테고리별로 다양한 조건에 맞춰 사이드잡을 검색할 수 있습니다.<br />
4. 간편한 지원: 클릭 몇 번으로 사이드잡에 지원할 수 있는 간편한 지원 시스템을 제공합니다.<br />

<br/>

GURU를 통해 효율적으로 사이드잡을 찾고, 구인자들도 필요한 인재를 쉽게 찾을 수 있게 됩니다.
  
<br/>


## 팀원


|정성원|고서은|김채린|김채은|
| :------: |  :------: | :------: | :------: |
| [<img src="https://avatars.githubusercontent.com/shining-jung" height=180 width=180> <br/> @shining-jung](https://github.com/shining-jung) | [<img src="https://avatars.githubusercontent.com/blunyl" height=180 width=180> <br/> @blunyl](https://github.com/blunyl) | [<img src="https://avatars.githubusercontent.com/chaerin-kim" height=180 width=180> <br/> @chaerin-kim](https://github.com/chaerin-kim/chaerin-kim) | [<img src="https://avatars.githubusercontent.com/kche0220" height=180 width=180> <br/> @kche0220](https://github.com/kche0220) |
  
<br/>

## 개발환경

* 프론트엔드 : HTML, CSS,  React
* 백엔드 : javascript, express, node.js
* 데이터베이스 : mongoDB
* 디자인 : figma
* 버전관리 : github
* 이미지 : canva, microsoft designer
* 협업툴 : zeplin, slack, [notion](https://www.notion.so/HPE-2-Guru-4ef3dcdbaada44f5ae1f40bc4aa914a7?pvs=4)

  
<br/>

## 작업방식
* 멀티레포 (multi-repo) : 충돌 최소화와 독립적인 테스트를 위해 서비스별 개별적 레파지토리 생성
  + GURU : 프론트단
  + GURU_SERVER : 서버단
    
* 깃플로우 (git-flow)
  + Main : 배포용 브랜치
  + DEV : 개인 브랜치에서 작업 후 합치는 브랜치
  + 개인 브랜치 : 새 기능을 개발하는 브랜치

<br/>


## 구조

```
GURU
 ├ node_modules
 ├ public
 │ ├ img
 │ │ ├ common
 │ │ │ ├ Main_VIs1.jpg
 │ │ │ ├ Main_VIs2.jpg
 │ │ │ ├ Main_VIs3.jpg
 │ │ │ ├ VisLogo.png
 │ │ │ ├ cate1.png
 │ │ │ ├ cate2.png
 │ │ │ ├ cate3.png
 │ │ │ ├ cate4.png
 │ │ │ ├ cate5.png
         ...
 │ │ │ └ userSlide_arrow.svg
 │ ├ favicon.ico
 │ ├ index.html
 │ ├ logo192.png
 │ ├ logo512.png
 │ ├ manifest.json
 │ └ robots.txt
 ├ src
 │ ├ assets
 │ │ ├ images
 │ │ │ ├ email.png
 │ │ │ └ pw.svg
 │ │ ├ AuthContext.js
 │ │ ├ accountDelete.js
 │ │ ├ marketingConsent.js
 │ │ ├ privacyPolicy.js
 │ │ └ termsOfService.js
 │ ├ components
 │ │ ├ CommentForm.jsx
 │ │ ├ Detail.jsx
 │ │ ├ Filter.jsx
 │ │ ├ Footer.jsx
 │ │ ├ Header.jsx
 │ │ ├ JobItem.jsx
 │ │ ├ Lnb.jsx
 │ │ ├ Loading.jsx
 │ │ ├ MainJobItem.jsx
 │ │ ├ MainOffline.jsx
 │ │ ├ MainOnline.jsx
 │ │ ├ MainSlide.jsx
 │ │ ├ Modal.jsx
 │ │ ├ ModalAlert.jsx
 │ │ ├ PaymentModal.jsx
 │ │ ├ PrivateRoute.jsx
 │ │ ├ Profile.jsx
 │ │ ├ ProgressBar.jsx
 │ │ ├ SatisfactionModal.jsx
 │ │ ├ UserProfile.jsx
 │ │ └ UserSlide.jsx
 │ ├ css
 │ │ ├ Comment.module.css
 │ │ ├ Common.css
 │ │ ├ Detail.module.css
 │ │ ├ Findjob.css
 │ │ ├ Footer.module.css
 │ │ ├ Form.module.css
 │ │ ├ Header.module.css
 │ │ ├ JobItem.module.css
 │ │ ├ Lnb.module.css
 │ │ ├ Loading.module.css
 │ │ ├ Main.module.css
 │ │ ├ Map.module.css
 │ │ ├ Memb.module.css
 │ │ ├ Modal.module.css
 │ │ ├ PaymentModal.module.css
 │ │ ├ Reset.css
 │ │ ├ Swiper.css
 │ │ └ UserProfile.module.css
 │ ├ pages
 │ │ ├ AcctBye.jsx
 │ │ ├ AcctDelete.jsx
 │ │ ├ AppliedList.jsx
 │ │ ├ FindAcct.jsx
 │ │ ├ Findjob.jsx
 │ │ ├ JobDetail.jsx
 │ │ ├ JobEdit.jsx
 │ │ ├ JobOffer.jsx
 │ │ ├ JobWrite.jsx
 │ │ ├ Login.jsx
 │ │ ├ Main.jsx
 │ │ ├ Map.jsx
 │ │ ├ Mypage.jsx
 │ │ ├ PersonalEdit.jsx
 │ │ ├ ProfileEdit.jsx
 │ │ ├ ResetConfirm.jsx
 │ │ ├ ResetPassword.jsx
 │ │ ├ Signup.jsx
 │ │ └ SignupOk.jsx
 │ ├ store
 │ │ ├ filter.js
 │ │ ├ findjob.js
 │ │ ├ pageInfo.js
 │ │ ├ ref.js
 │ │ ├ store.js
 │ │ ├ updateItemStatus.js
 │ │ └ userStore.js
 │ ├ App.js
 │ ├ App.test.js
 │ ├ index.js
 │ ├ reportWebVitals.js
 │ └ setupTests.js
 ├ .env (.gitignore에 포함돼 있음)
 ├ .gitignore
 ├ package-lock.json
 ├ package.json
 └ README.md
```
```
GURU_SERVER
 ├ modules
 │ ├ Comment.js
 │ ├ JobPost.js
 │ ├ Satisfied.js
 │ └ User.js
 ├ node_modules
 ├ uploads
 ├ .env (.gitignore에 포함돼 있음)
 ├ .gitignore
 ├ index.js
 ├ job.js
 ├ package-lock.json
 └ package.json
```

<br/>


## 핵심기능
### 메인
| GURU 메인   |
|------------|
| <img src="https://github.com/FE-Guru/guru/assets/142004071/fb9f0c57-d6ec-4224-a308-b8e5d1f59d21" width="500"/> |
<br/>
메인 슬라이드에서 GURU 의 아이덴티티를 나타내려고 함
<br/>
<br/>

### 멤버십
| 로그인     |
|------------|
| <img src="https://github.com/FE-Guru/guru/assets/142004071/4e2a4d65-4212-4746-89e4-506fecc6b3c6" width="500"/> |
<br/>
가입한 이메일아이디와 비밀번호 입력, 로그인 후 헤더 변경됨<br/><br/>

| ID,PW 찾기  |
|------------|
| <img src="https://github.com/FE-Guru/guru/assets/142004071/0f961fbd-0694-42e8-b30b-18826b80bbd4" width="500"/> |
 <br/>
아이디는 가입시 입력한 이름과 연락처를 입력하면 바로 알려주고<br/>
비밀번호는 가입한 이메일 주소로 재설정 링크가 전송된다.<br/>
메일에서 재설정 링크로 들어가면 비밀번호 재설정이 가능하다.<br/>
<br/>
<br/>

### 사이드잡 매칭 구인/구직
| 일자리 찾기 |
|------------|
| <img src="https://github.com/FE-Guru/guru/assets/142004071/6c416460-e093-4fba-98b9-07eb84a91cef" width="500"/> |
 <br/>
구직자가 일자리를 찾는 과정
<br/><br/>

| 구직자 매칭 |
|------------|
| <img src="https://github.com/FE-Guru/guru/assets/142004071/a263152a-e1c9-4899-81b9-c52ed5913263" width="500"/> |
 <br/>
구직자가 지원한 일자리에 매칭되는 과정
<br/><br/>

| 지원목록 |
|------------|
| <img src="https://github.com/FE-Guru/guru/assets/142004071/560ff9e5-6493-49c0-9e53-2408869abd41" width="500"/> |
 <br/>
구직자가 지원한 일 목록
<br/><br/>

| 구인자 매칭 |
|------------|
| <img src="https://github.com/FE-Guru/guru/assets/142004071/424f69f5-bfb1-431c-9e09-3c68911dabf9" width="500"/> |
<br/>
구인자가 글 작성후 지원자(구직자)를 채용하고 <br/>
일 완료 후 구인자가 결제 및 만족도 평가
<br/><br/>

| 만족도와 결제 |
|------------|
| <img src="https://github.com/FE-Guru/guru/assets/142004071/6f1c7d48-5a1e-4d09-8802-218f99ce1214" width="500"/> |
<br/>
구직자, 구인자 서로 만족도 조사 / 구인자는 결제해 비용 지불
<br/><br/>

### 반응형
모바일 사용자를 고려한 반응형 적용
<br/>
<img src="https://github.com/FE-Guru/guru/assets/142004071/157108f9-ee48-4930-ab46-a35beee75749" width="500" />
<br/><br/>

### 접근권한설정
로그인하지 않았을 경우 헤더의 지원목록, 구인관리, 구인글 작성이 불가능함
<br/>
<img src="https://github.com/FE-Guru/guru/assets/142004071/769662aa-721e-4642-8793-bb4e542ca323" width="500" />
<br/><br/>

## 소감
🔥 **고서은** <br/>
혼자라면 불가능했을 GURU 개발을 완료해서 뿌듯합니다! <br/>
기획을 빨리  마치고 작업으로 들어가자는 팀장님의 말씀대로 잘한거같아요!  
<br/>그래서 많은 내용도 구현이 가능했던거 같습니다. 처음 해보는 문자API 사용과 세세한 에러를 처리하는 데 시행착오도
<br/> 있었지만 맡은 부분이 멤버십이라 수업 내용을 충분히 복기하면서  팀 협업도 할 수 있어서 좋았습니다.   
<br/> 다같이 앞으로 좋은 개발자로 다시 만나길 바라요! 🙌
<br/>

🌱 **김채린** <br/>
“왜 안되지?”를 입에 달고 살았습니다.  <br/>현재 위치 기준으로 리스트배치할 때, 만족도 데이터를 각 유저에게 전달할 때, 결제 API 토큰 확인과 송금 확인이 안될 때... 
 <br/> 힘든 순간도 많았지만, 그만큼 보람과 능력치 향상을 느낄 수 있었습니다. 문제가 생길 때마다 팀원들과 논의하고 해결하면서, <br/>
훌륭한 팀원들을 만났음을 실감했습니다. 기획, 디자인, 개발까지 직접 참여한 우리 'Guru'가 정말 자랑스럽습니다. 
 <br/>모두에게 감사드리며, 앞으로 더 열심히 나아가겠습니다.
<br/>

💧 **김채은** <br/>
기대반 두려움 반으로 시작했던 팀 프로젝트가 무사히 끝난 것 같아 정말 다행이라고 생각합니다. <br/>
아는게 많이 없고  경력도 없어 걱정했지만 팀프로젝트를 통해 많이 배웠습니다.<br/>
프로필 부분과, 여러 오류에 많은 어려움이 있었으나 팀원분들이 같이 도와주시고 알려주셔서 마무리 할 수 있게 <br/>
된 것 같습니다. 팀원분들에게 감사드립니다. <br/>

⚡️ **정성원** <br/>
처음 해보는 개발 프로젝트 이 정도면 절반 이상의 성공 아닐까?<br/>
빠른 주제선정과 빠른 기획 진행으로 첫 단추를 잘 꿰어서, 프로젝트가 좋은 흐름으로 흘러간 것 같습니다.<br/>
중간 멘토링 시간에 긍정적인 피드백도 받았고, 적극적인 저희 팀원들은<br/> “알아서 잘 딱 깔끔하고 센스있게” 여서 의견을 잘 제시해주고, <br/>
서로 검토하며 반영해 나가는 과정에서 좋은 아웃풋을 만들어낼 수 있었던 것 같습니다. <br/>
구인구직 로직을 설계하고 구현하는 과정에 많은 오류와 어려움이 있었지만<br/> 서로 공부하고, 해결방안을 찾아 나가는 과정에서 많은 것들을 배웠습니다.

<br/>
