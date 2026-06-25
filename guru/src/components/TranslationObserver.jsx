import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const exactTranslations = {
  "경력을 입력해주세요.": "Enter your experience.",
  "면허 / 자격증을 입력해주세요.": "Enter licenses or certifications.",
  "재능 / 스킬을 입력해주세요.": "Enter talents or skills.",
  "시간을 입력해주세요.": "Enter available time.",
  "자기소개를 입력해주세요.": "Enter your introduction.",
  "기타 의견을 작성해 주세요": "Write additional feedback.",
  "임금": "Pay",
  "우리 댕댕이 산책이 필요할때": "When your dog needs a walk",
  "원데이 집사를 찾아야 할때": "When you need a one-day helper",
  "초단기 알바를 구할때": "When you need short-term work",
  "체험단": "Review Crew",
  "참여형": "Participation",
  "대행업무": "Agency Work",
  "서비스": "Service",
  "등록된 온라인 일자리가 없습니다.": "No online jobs have been posted yet.",
  "새로운 일자리가 등록되면 이곳에서 확인할 수 있어요.": "New jobs will appear here once they are posted.",
  "등록된 오프라인 일자리가 없습니다.": "No offline jobs have been posted yet.",
  "위치 주변의 새 일자리가 등록되면 이곳에서 확인할 수 있어요.": "Nearby jobs will appear here once they are posted.",
  "일자리찾기": "Find Jobs",
  "일자리 찾기": "Find Jobs",
  "지원목록": "Applications",
  "구인관리": "Manage Jobs",
  "구인글 작성": "Post a Job",
  "구인글 수정": "Edit Job",
  "로그인": "Login",
  "로그아웃": "Logout",
  "회원가입": "Sign Up",
  "회원가입 완료": "Sign Up Complete",
  "아이디/비밀번호 찾기": "Find ID/Password",
  "임시 로그인": "Dev Login",
  "아이디나 비밀번호를 다시 확인해주세요.": "Please check your ID or password again.",
  "비밀번호 재설정": "Reset Password",
  "재설정하기": "Reset Password",
  "재설정이 완료되지 않았습니다.": "Password reset was not completed.",
  "비밀번호가 일치하지 않습니다.": "Passwords do not match.",
  "비밀번호는 4자 이상으로 만들어주세요.": "Please use a password of at least 4 characters.",
  "비밀번호가 재설정되었습니다. 다시 로그인해주세요.": "Your password has been reset. Please log in again.",
  "회원탈퇴": "Delete Account",
  "회원탈퇴 완료": "Account Deleted",
  "메인으로": "Go Home",
  "현재 로그인 계정": "Signed in as",
  "빠른메뉴": "Quick Menu",
  "메뉴": "Menu",
  "프로필 수정": "Edit Profile",
  "회원정보 수정": "Account Settings",
  "닉네임을 설정해주세요": "Set your nickname",
  "유형선택": "Type",
  "모집상태": "Status",
  "근로시간": "Work Hours",
  "재능": "Talent",
  "분야": "Category",
  "전체": "All",
  "온라인": "Online",
  "오프라인": "Offline",
  "재능무관": "Any Talent",
  "디자인": "Design",
  "IT·기술": "IT/Tech",
  "교육·강사": "Education",
  "분야무관": "Any Category",
  "배포/체험단": "Sampling/Review",
  "SNS": "SNS",
  "모집중": "Recruiting",
  "지원마감": "Closed",
  "예약중": "Reserved",
  "완료대기": "Awaiting Completion",
  "완료": "Complete",
  "취소": "Cancel",
  "취소완료": "Canceled",
  "검색": "Search",
  "조건에 맞는 일자리가 없습니다.": "No jobs match your filters.",
  "등록된 구인글이 없습니다.": "No posted jobs yet.",
  "지원한 이력이 없습니다.": "No applications yet.",
  "이미지 없음": "No image",
  "프로필 이미지": "Profile image",
  "변경된 이미지": "Updated image",
  "등록된 이미지": "Uploaded image",
  "프로필 등록": "Create Profile",
  "이미지 등록": "Upload Image",
  "댓글": "Comments",
  "등록": "Submit",
  "저장": "Save",
  "삭제": "Delete",
  "수정": "Edit",
  "삭제하기": "Delete",
  "수정하기": "Edit",
  "뒤로가기": "Back",
  "지원하기": "Apply",
  "지원취소": "Cancel Application",
  "지원자 확인": "View Applicants",
  "지원한 사람이 없습니다.": "No one has applied yet.",
  "상세보기": "Details",
  "상세설명": "Details",
  "신뢰도": "Trust Score",
  "금액": "Pay",
  "모집마감": "Deadline",
  "약속날짜": "Date",
  "약속시간": "Time",
  "약속장소": "Location",
  "약속 예정일": "Scheduled Date",
  "근무형태": "Work Type",
  "주소": "Address",
  "결제하기": "Pay",
  "결제 및 완료": "Pay and Complete",
  "만족도조사 및 완료": "Survey and Complete",
  "상대방이 완료처리 전입니다.": "The other party has not completed yet.",
  "상세페이지 메시지": "Detail Page Message",
  "삭제 메시지": "Delete Message",
  "구인관리 메시지": "Manage Jobs Message",
  "정말 삭제하시겠습니까?": "Are you sure you want to delete this?",
  "구인글이 삭제되었습니다.": "The job post has been deleted.",
  "잘못된 접근입니다.": "Invalid access.",
  "지원이 정상적으로 처리되었습니다.": "Your application has been submitted.",
  "지원취소가 정상적으로 처리되었습니다.": "Your application has been canceled.",
  "조금더 기다려주세요.": "Please wait a little longer.",
  "로그인이 필요한 페이지입니다.": "Please log in to view this page.",
  "로그인이 필요합니다.": "Please log in.",
  "확인": "OK",
  "닫기": "Close",
  "이메일": "Email",
  "이메일(아이디)": "Email (ID)",
  "비밀번호": "Password",
  "비밀번호 확인": "Confirm Password",
  "이름": "Name",
  "닉네임": "Nickname",
  "연락처": "Phone",
  "계좌번호": "Account Number",
  "인증하기": "Send Code",
  "인증번호": "Verification Code",
  "아이디": "ID",
  "비밀번호 찾기": "Find Password",
  "아이디 찾기": "Find ID",
  "※ 회원가입시 입력한 이름과 연락처를 입력해주세요.": "Enter the name and phone number you used to sign up.",
  "※ 회원가입시 입력한 이메일아이디를 입력해주세요.": "Enter the email ID you used to sign up.",
  "비밀번호 재설정을 위한 이메일이 전송됩니다.": "A password reset email will be sent.",
  "입력하신 정보를 다시 확인해주세요.": "Please check the information you entered.",
  "약관동의": "Terms Agreement",
  "이용약관에 동의합니다.": "I agree to the Terms of Service.",
  "개인정보취급방침에 동의합니다.": "I agree to the Privacy Policy.",
  "마케팅 활용에 동의합니다.": "I agree to marketing use.",
  "(필수)": "(Required)",
  "(선택)": "(Optional)",
  "[전문보기]": "[View Full Text]",
  "이용약관": "Terms of Service",
  "개인정보 약관": "Privacy Policy",
  "마케팅 활용 동의": "Marketing Consent",
  "하이픈(-) 제외 숫자만 입력": "Numbers only, no hyphens",
  "회원가입을 진심으로 환영합니다.": "Welcome to GURU.",
  "GURU 회원가입을 진심으로 환영합니다.": "Welcome to GURU.",
  "회원탈퇴가 정상적으로 처리되었습니다.": "Your account has been deleted.",
  "그동안 저희 GURU를 이용해주셔서 감사합니다.": "Thank you for using GURU.",
  "주소검색": "Address Search",
  "제목": "Title",
  "제목 입력": "Enter a title",
  "설명": "Description",
  "자세한 설명을 작성해주세요.": "Enter a detailed description.",
  "구인 마감": "Application Deadline",
  "입금": "Pay",
  "필요한 재능": "Required Talent",
  "필요한 분야": "Required Category",
  "근로 날짜": "Work Date",
  "근로 시간": "Work Hours",
  "구인 마감 날짜 선택": "Select deadline",
  "근로 날짜 선택": "Select work date",
  "시작": "Start",
  "마감": "End",
  "시작시간": "Start time",
  "마감시간": "End time",
  "장소": "Location",
  "우편번호": "Postal Code",
  "주소찾기": "Find Address",
  "상세주소를 입력해주세요.": "Enter detailed address.",
  "상세한 설명을 작성해주세요.": "Enter a detailed description.",
  "금액 입력": "Enter pay",
  "재능 선택": "Select talent",
  "분야 선택": "Select category",
  "댓글 내용을 작성해주세요.": "Write a comment.",
  "댓글을 작성하시려면 내용을 작성해주세요..": "Please write a comment.",
  "댓글이 정상적으로 등록 되었습니다.": "Your comment has been posted.",
  "댓글 등록 중 오류가 생겼습니다.": "An error occurred while posting your comment.",
  "댓글이 삭제되었습니다.": "The comment has been deleted.",
  "댓글이 수정되었습니다.": "The comment has been updated.",
  "댓글 수정 중 오류가 발생했습니다.": "An error occurred while updating the comment.",
  "지도를 표시할 수 없습니다.": "The map cannot be displayed.",
  "카카오 지도 앱키가 설정되면 이 영역에 지도가 표시됩니다.": "The map will appear here after the Kakao map key is configured.",
  "리스트로 이동 >": "Go to list >",
};

const partialTranslations = [
  ["우리 댕댕이 산책이 필요할때", "When your dog needs a walk"],
  ["건당", "Per task"],
  ["원", "KRW"],
  ["님", ""],
  ["시간", "h"],
  ["총", "Total"],
  ["건의 일자리", "jobs"],
  ["결제", "Payment"],
  ["결제 성공", "Payment successful"],
  ["결제 실패", "Payment failed"],
  ["정산 실패", "Settlement failed"],
  ["정산 중 오류가 발생했습니다.", "An error occurred during settlement."],
  ["입력하신 정보를 확인해주세요!", "Please check the information you entered."],
  ["회원님의 아이디는", "Your ID is"],
  ["입니다.", "."],
  ["가입완료", "Sign up complete"],
  ["약관 필수사항을 모두 선택해주세요!", "Please agree to all required terms."],
  ["이미 존재하는 이메일아이디 입니다.", "This email ID already exists."],
  ["인증번호 전송이 완료되었습니다.", "The verification code has been sent."],
  ["입력하신 번호를 확인해주세요", "Please check the phone number."],
  ["인증이 완료되었습니다.", "Verification complete."],
  ["인증번호를 다시 확인해주세요.", "Please check the verification code again."],
  ["인증 확인 버튼을 눌러주세요.", "Please press the verification button."],
  ["구인글이 정상적으로 등록되었습니다.", "The job post has been created."],
  ["구인글 등록 중 오류가 발생했습니다.", "An error occurred while creating the job post."],
  ["구인글이 정상적으로 수정되었습니다.", "The job post has been updated."],
  ["구인글 수정 중 오류가 발생했습니다.", "An error occurred while updating the job post."],
  ["모든 입력값은 필수항목입니다.", "All fields are required."],
  ["키워드를 입력해주세요.", "Enter a keyword."],
];

const textOriginals = new WeakMap();
const attributeOriginals = new WeakMap();
const attributeNames = ["placeholder", "alt", "title", "aria-label"];

const hasKorean = (value) => /[가-힣]/.test(value);

const translateText = (value) => {
  const trimmed = value.trim();
  if (!trimmed || !hasKorean(trimmed)) return value;

  const exact = exactTranslations[trimmed];
  if (exact) return value.replace(trimmed, exact);

  let translated = value;
  partialTranslations.forEach(([ko, en]) => {
    translated = translated.split(ko).join(en);
  });
  return translated;
};

const translateNode = (node, language) => {
  if (node.nodeType === Node.TEXT_NODE) {
    if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue);
    const original = textOriginals.get(node);
    const nextValue = language === "en" ? translateText(original) : original;
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (["SCRIPT", "STYLE"].includes(node.tagName)) return;

  attributeNames.forEach((name) => {
    if (!node.hasAttribute(name)) return;
    if (!attributeOriginals.has(node)) attributeOriginals.set(node, {});
    const originals = attributeOriginals.get(node);
    if (!originals[name]) originals[name] = node.getAttribute(name);
    const original = originals[name];
    const nextValue = language === "en" ? translateText(original) : original;
    if (node.getAttribute(name) !== nextValue) node.setAttribute(name, nextValue);
  });

  node.childNodes.forEach((child) => translateNode(child, language));
};

const TranslationObserver = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    const applyTranslation = () => translateNode(document.body, i18n.language);
    applyTranslation();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => translateNode(node, i18n.language));
        if (mutation.type === "characterData") translateNode(mutation.target, i18n.language);
        if (mutation.type === "attributes") translateNode(mutation.target, i18n.language);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: attributeNames,
    });

    return () => observer.disconnect();
  }, [i18n.language]);

  return null;
};

export default TranslationObserver;
