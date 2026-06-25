import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ko: {
    translation: {
      nav: {
        findJob: "일자리찾기",
        appliedList: "지원목록",
        jobOffer: "구인관리",
        jobWrite: "구인글 작성",
        login: "로그인",
        logout: "로그아웃",
      },
      page: {
        findJob: "일자리찾기",
        findJobEn: "Find Job",
        appliedList: "지원목록",
        appliedListEn: "Application List",
        jobOffer: "구인관리",
        jobOfferEn: "Job Offer",
        jobWrite: "구인글 작성",
        jobWriteEn: "Job Write",
        jobEdit: "구인글 수정",
        jobEditEn: "Job Offer",
      },
      menu: {
        currentAccount: "현재 로그인 계정",
        quickMenu: "빠른메뉴",
        menu: "메뉴",
        profileEdit: "프로필 수정",
        personalEdit: "회원정보 수정",
        noNickname: "닉네임을 설정해주세요",
      },
      filter: {
        type: "유형선택",
        status: "모집상태",
        workTime: "근로시간",
        talent: "재능",
        field: "분야",
        all: "전체",
        online: "온라인",
        offline: "오프라인",
        anyTalent: "재능무관",
        design: "디자인",
        itTech: "IT·기술",
        education: "교육·강사",
        service: "서비스",
        anyField: "분야무관",
        sampling: "배포/체험단",
        sns: "SNS",
        agency: "대행업무",
        participation: "참여형",
        recruiting: "모집중",
        closed: "지원마감",
        reserved: "예약중",
        waitingComplete: "완료대기",
        complete: "완료",
        canceled: "취소",
        search: "검색",
      },
      common: {
        imageMissing: "이미지 없음",
        profileImage: "프로필 이미지",
        requiredNotice: "※ 모든 입력값은 필수항목입니다.",
        loginRequired: "로그인이 필요한 페이지입니다.",
        loginError: "로그인 중 오류가 발생했습니다.",
        registeredJobEmpty: "등록된 구인글이 없습니다.",
        appliedJobEmpty: "지원한 이력이 없습니다.",
        jobEmpty: "조건에 맞는 일자리가 없습니다.",
        keywordPlaceholder: "키워드를 입력해주세요.",
        hour: "시간",
        more: "더보기 +",
        perTask: "건당",
        currency: "원",
      },
      form: {
        title: "제목",
        titlePlaceholder: "제목 입력",
        type: "유형선택",
        address: "주소",
        postalCode: "우편번호",
        addressSearch: "주소검색",
        detailAddressPlaceholder: "상세주소를 입력해주세요.",
        addressRequired: "주소는 필수 입력값입니다.",
        deadline: "구인 마감",
        deadlinePlaceholder: "구인 마감 날짜 선택",
        workDate: "근로 날짜",
        workDatePlaceholder: "근로 날짜 선택",
        workHours: "근로 시간",
        startTime: "시작시간",
        endTime: "마감시간",
        workHoursRequired: "근로시간은 필수 선택입니다.",
        pay: "임금",
        payPlaceholder: "금액 입력",
        talent: "필요한 재능",
        talentPlaceholder: "재능 선택",
        category: "필요한 분야",
        categoryPlaceholder: "분야 선택",
        description: "설명",
        descriptionPlaceholder: "자세한 설명을 작성해주세요.",
        validation: {
          titleRequired: "제목은 필수 입력값입니다.",
          addressRequired: "주소는 필수 입력값입니다.",
          deadlineRequired: "구인 마감 날짜는 필수 입력값입니다.",
          workDateRequired: "근로 날짜는 필수 입력값입니다.",
          workHoursRequired: "근로시간은 필수 선택입니다.",
          payRequired: "임금은 필수 입력 값입니다.",
          talentRequired: "필요한 재능은 필수 선택입니다.",
          categoryRequired: "필요한 분야는 필수 선택입니다.",
          descriptionRequired: "설명은 필수 입력값입니다.",
        },
      },
      main: {
        slideHelper: "원데이 집사를 찾아야 할때",
        slideShortJob: "초단기 알바를 구할때",
        slideDogWalk: "우리 댕댕이 산책이 필요할때",
        reviewCrew: "체험단",
        talentCategory: "재능별 카테고리",
        talentCategoryDesc: "당신의 전문성을 기반으로 다양한 일거리를 찾아보세요",
        webMobileDesign: "# 웹·모바일 디자인",
        graphicVideoEdit: "# 그래픽·영상·편집",
        programming: "# 프로그래밍",
        systemNetwork: "# 시스템·네트워크",
        entranceForeign: "# 입시 #외국어",
        dispatchedInstructor: "# 파견강사",
        deliveryAgency: "# 배달 # 대행업무",
        cs: "#CS",
        bannerTitle: "하루만에 끝낼 수 있는 부업을 찾으세요.",
        bannerBody: "하루 만에 완료할 수 있는 빠르고 쉬운 사이드잡을 찾을 수 있는 초단기 매칭 플랫폼 GURU를 만나보세요. 여가 시간에 돈을 벌고 싶은 사람들에게 유연하게 돈을 벌 수 있는 기회를 제공합니다.",
        findJobCta: "일자리 찾기 →",
        emptyOnlineTitle: "등록된 온라인 일자리가 없습니다.",
        emptyOnlineDesc: "새로운 일자리가 등록되면 이곳에서 확인할 수 있어요.",
        emptyOfflineTitle: "등록된 오프라인 일자리가 없습니다.",
        emptyOfflineDesc: "위치 주변의 새 일자리가 등록되면 이곳에서 확인할 수 있어요.",
      },
      language: {
        label: "언어",
        ko: "한국어",
        en: "English",
      },
      legal: {
        privacyPolicy: "개인정보취급방침",
        termsOfService: "서비스이용약관",
        serviceTitle: "이용약관",
        privacyTitle: "개인정보 약관",
        marketingTitle: "마케팅 활용 동의",
        serviceText: `[GURU] 이용약관
제1조 목적: 본 약관은 GURU 서비스 이용과 관련한 회사와 이용자의 권리, 의무 및 책임사항을 규정합니다.
제2조 회원은 정확한 정보를 제공해야 하며, 타인의 정보를 도용할 수 없습니다.
제3조 회사는 안정적인 서비스 제공을 위해 서비스를 변경하거나 일시 중단할 수 있습니다.
제4조 이용자는 공공질서 및 미풍양속에 반하는 행위를 해서는 안 됩니다.
제5조 개인정보 보호는 개인정보처리방침에 따릅니다.
본 약관은 2024년 1월 1일부터 적용됩니다.`,
        privacyText: `개인정보 수집 및 이용에 대한 안내
GURU는 서비스 제공, 회원 관리, 본인 확인, 고객 지원을 위해 필요한 개인정보를 수집하고 이용합니다.
필수 항목에는 이름, 이메일, 비밀번호, 휴대전화번호 등이 포함될 수 있습니다.
수집된 개인정보는 회원 탈퇴 시까지 보관되며, 관련 법령에 따라 일정 기간 보존될 수 있습니다.
이용자는 언제든지 개인정보 조회, 수정, 삭제 또는 회원 탈퇴를 요청할 수 있습니다.
개인정보 보호 책임자: privacy@guru.com`,
        marketingText: `마케팅 활용 동의 안내
GURU는 신규 서비스, 이벤트, 프로모션 안내 및 맞춤형 정보 제공을 위해 개인정보를 활용할 수 있습니다.
수집 항목에는 이름, 이메일, 전화번호, 서비스 이용 기록이 포함될 수 있습니다.
마케팅 동의는 선택 사항이며, 동의하지 않아도 기본 서비스 이용에는 제한이 없습니다.
이용자는 언제든지 마케팅 수신 동의를 철회할 수 있습니다.`,
      },
    },
  },
  en: {
    translation: {
      nav: {
        findJob: "Find Jobs",
        appliedList: "Applications",
        jobOffer: "Manage Jobs",
        jobWrite: "Post a Job",
        login: "Login",
        logout: "Logout",
      },
      page: {
        findJob: "Find Jobs",
        findJobEn: "Find Job",
        appliedList: "Applications",
        appliedListEn: "Application List",
        jobOffer: "Manage Jobs",
        jobOfferEn: "Job Offer",
        jobWrite: "Post a Job",
        jobWriteEn: "Job Write",
        jobEdit: "Edit Job",
        jobEditEn: "Job Offer",
      },
      menu: {
        currentAccount: "Signed in as",
        quickMenu: "Quick Menu",
        menu: "Menu",
        profileEdit: "Edit Profile",
        personalEdit: "Account Settings",
        noNickname: "Set your nickname",
      },
      filter: {
        type: "Type",
        status: "Status",
        workTime: "Work Hours",
        talent: "Talent",
        field: "Category",
        all: "All",
        online: "Online",
        offline: "Offline",
        anyTalent: "Any Talent",
        design: "Design",
        itTech: "IT/Tech",
        education: "Education",
        service: "Service",
        anyField: "Any Category",
        sampling: "Sampling/Review",
        sns: "SNS",
        agency: "Agency Work",
        participation: "Participation",
        recruiting: "Recruiting",
        closed: "Closed",
        reserved: "Reserved",
        waitingComplete: "Awaiting Completion",
        complete: "Complete",
        canceled: "Canceled",
        search: "Search",
      },
      common: {
        imageMissing: "No image",
        profileImage: "Profile image",
        requiredNotice: "All fields are required.",
        loginRequired: "Please log in to view this page.",
        loginError: "An error occurred while logging in.",
        registeredJobEmpty: "No posted jobs yet.",
        appliedJobEmpty: "No applications yet.",
        jobEmpty: "No jobs match your filters.",
        keywordPlaceholder: "Enter a keyword.",
        hour: "h",
        more: "More +",
        perTask: "Per task",
        currency: "KRW",
      },
      form: {
        title: "Title",
        titlePlaceholder: "Enter a title",
        type: "Type",
        address: "Address",
        postalCode: "Postal Code",
        addressSearch: "Address Search",
        detailAddressPlaceholder: "Enter detailed address.",
        addressRequired: "Address is required.",
        deadline: "Application Deadline",
        deadlinePlaceholder: "Select deadline",
        workDate: "Work Date",
        workDatePlaceholder: "Select work date",
        workHours: "Work Hours",
        startTime: "Start time",
        endTime: "End time",
        workHoursRequired: "Work hours are required.",
        pay: "Pay",
        payPlaceholder: "Enter pay",
        talent: "Required Talent",
        talentPlaceholder: "Select talent",
        category: "Required Category",
        categoryPlaceholder: "Select category",
        description: "Description",
        descriptionPlaceholder: "Enter a detailed description.",
        validation: {
          titleRequired: "Title is required.",
          addressRequired: "Address is required.",
          deadlineRequired: "Application deadline is required.",
          workDateRequired: "Work date is required.",
          workHoursRequired: "Work hours are required.",
          payRequired: "Pay is required.",
          talentRequired: "Required talent is required.",
          categoryRequired: "Required category is required.",
          descriptionRequired: "Description is required.",
        },
      },
      main: {
        slideHelper: "When you need a one-day helper",
        slideShortJob: "When you need short-term work",
        slideDogWalk: "When your dog needs a walk",
        reviewCrew: "Review Crew",
        talentCategory: "Categories by Talent",
        talentCategoryDesc: "Find jobs that match your expertise",
        webMobileDesign: "# Web/Mobile Design",
        graphicVideoEdit: "# Graphic/Video Editing",
        programming: "# Programming",
        systemNetwork: "# System/Network",
        entranceForeign: "# Entrance Exams #Languages",
        dispatchedInstructor: "# Visiting Instructor",
        deliveryAgency: "# Delivery #Agency Work",
        cs: "#CS",
        bannerTitle: "Find side jobs you can finish in a day.",
        bannerBody: "Meet GURU, a short-term matching platform where you can find quick and easy side jobs that can be completed in a day. It gives people who want to earn during spare time flexible opportunities to make money.",
        findJobCta: "Find Jobs →",
        emptyOnlineTitle: "No online jobs have been posted yet.",
        emptyOnlineDesc: "New jobs will appear here once they are posted.",
        emptyOfflineTitle: "No offline jobs have been posted yet.",
        emptyOfflineDesc: "Nearby jobs will appear here once they are posted.",
      },
      language: {
        label: "Language",
        ko: "한국어",
        en: "English",
      },
      legal: {
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        serviceTitle: "Terms of Service",
        privacyTitle: "Privacy Policy",
        marketingTitle: "Marketing Consent",
        serviceText: `[GURU] Terms of Service
Article 1. Purpose: These terms define the rights, obligations, and responsibilities between GURU and its users.
Article 2. Users must provide accurate information and may not use another person's information.
Article 3. GURU may change or temporarily suspend services to maintain stable operations.
Article 4. Users must not engage in illegal, unfair, or publicly inappropriate behavior.
Article 5. Personal information is handled according to the Privacy Policy.
These terms are effective from January 1, 2024.`,
        privacyText: `Privacy Policy
GURU collects and uses personal information necessary to provide services, manage accounts, verify identity, and support customers.
Required information may include name, email, password, and mobile phone number.
Personal information is retained until account deletion, unless applicable laws require longer retention.
Users may request access, correction, deletion, or account withdrawal at any time.
Privacy contact: privacy@guru.com`,
        marketingText: `Marketing Consent
GURU may use personal information to provide information about new services, events, promotions, and personalized content.
Collected information may include name, email, phone number, and service usage records.
Marketing consent is optional and does not limit basic service usage.
Users may withdraw marketing consent at any time.`,
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "ko",
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
  i18n.on("languageChanged", (language) => {
    document.documentElement.lang = language;
  });
}

export default i18n;
