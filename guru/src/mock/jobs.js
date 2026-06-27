const mockAuthor = {
  _id: "mock-user-owner",
  emailID: "mock@guru.local",
  userName: "Kim Seo-yoon",
  nickName: "Seo-yoon",
  certified: true,
  image: "img/mock/seo-yoon.jpg",
  auth: "user",
  trust: 82,
};

const mockWorkers = [
  {
    _id: "mock-user-jiyoon",
    emailID: "haneul.lee@guru.local",
    userName: "Lee Ha-neul",
    nickName: "Ha-neul",
    phone: "01012345678",
    status: 1,
    matched: false,
    image: "img/mock/ha-neul.jpg",
    trust: 76,
    career: "2 years of SNS content scheduling and cafe review writing",
    skill: "Instagram posting, short-form captions, simple photo edits",
    time: "Weekday evenings",
    introduce: "I work carefully and reply quickly during short projects.",
  },
  {
    _id: "mock-user-minho",
    emailID: "minjun.park@guru.local",
    userName: "Park Min-jun",
    nickName: "Min-jun",
    phone: "01087654321",
    status: 2,
    matched: true,
    image: "img/mock/min-jun.jpg",
    trust: 91,
    career: "4 years of event support and customer service",
    skill: "Queue management, customer guidance, field reporting",
    time: "Weekends and afternoons",
    introduce: "I am comfortable with on-site work and keep schedules precisely.",
  },
];

const authorUsers = [
  mockAuthor,
  {
    _id: "mock-user-designer",
    emailID: "designer@guru.local",
    userName: "Choi Da-in",
    nickName: "Da-in",
    certified: true,
    image: "img/mock/da-in.jpg",
    auth: "user",
    trust: 88,
  },
  {
    _id: "mock-user-edu",
    emailID: "edu@guru.local",
    userName: "Jung Yu-jin",
    nickName: "Yu-jin",
    certified: true,
    image: "img/mock/yu-jin.jpg",
    auth: "user",
    trust: 84,
  },
  {
    _id: "mock-user-service",
    emailID: "service@guru.local",
    userName: "Kang Tae-oh",
    nickName: "Tae-oh",
    certified: true,
    image: "img/mock/tae-oh.jpg",
    auth: "user",
    trust: 79,
  },
];

export const mockJobs = [
  {
    _id: "mock-job-001",
    emailID: "mock@guru.local",
    nickName: "Seo-yoon",
    title: "SNS content upload helper",
    desc: "Help organize short captions, check image order, and schedule three social posts for a brand account.",
    pay: 45000,
    status: 1,
    applicants: [mockWorkers[0]],
    category: { jobType: "onLine", talent: "SNS", field: "SNS" },
    location: { address: "", detailedAddress: "", mapX: 126.965706, mapY: 37.529325 },
    endDate: "2026-06-29T23:59:00.000Z",
    workStartDate: "2026-06-30T10:00:00.000Z",
    workEndDate: "2026-06-30T13:00:00.000Z",
  },
  {
    _id: "mock-job-002",
    emailID: "mock@guru.local",
    nickName: "Seo-yoon",
    title: "Cafe menu review crew",
    desc: "Try a new cafe menu, take three simple photos, and write a short review summary.",
    pay: 30000,
    status: 2,
    applicants: [mockWorkers[1]],
    category: { jobType: "onLine", talent: "Service", field: "Service" },
    location: { address: "", detailedAddress: "", mapX: 126.9721, mapY: 37.5563 },
    endDate: "2026-07-01T23:59:00.000Z",
    workStartDate: "2026-07-02T14:00:00.000Z",
    workEndDate: "2026-07-02T16:00:00.000Z",
  },
  {
    _id: "mock-job-003",
    emailID: "designer@guru.local",
    nickName: "Da-in",
    title: "Poster copy proofreading",
    desc: "Review a short event poster copy and suggest clearer wording before publishing.",
    pay: 25000,
    status: 1,
    applicants: [],
    category: { jobType: "onLine", talent: "Design", field: "Sampling" },
    location: { address: "", detailedAddress: "", mapX: 126.985, mapY: 37.54 },
    endDate: "2026-07-03T23:59:00.000Z",
    workStartDate: "2026-07-04T09:00:00.000Z",
    workEndDate: "2026-07-04T11:00:00.000Z",
  },
  {
    _id: "mock-job-004",
    emailID: "edu@guru.local",
    nickName: "Yu-jin",
    title: "Elementary English worksheet check",
    desc: "Check answer sheets for a short online worksheet and leave simple feedback notes.",
    pay: 52000,
    status: 1,
    applicants: [mockWorkers[0]],
    category: { jobType: "onLine", talent: "Education", field: "Participation" },
    location: { address: "", detailedAddress: "", mapX: 127.01, mapY: 37.52 },
    endDate: "2026-07-05T23:59:00.000Z",
    workStartDate: "2026-07-06T18:00:00.000Z",
    workEndDate: "2026-07-06T21:00:00.000Z",
  },
  {
    _id: "mock-job-005",
    emailID: "mock@guru.local",
    nickName: "Seo-yoon",
    title: "Popup store floor guide",
    desc: "Guide visitors, organize the waiting line, and help with simple event check-in at a popup store.",
    pay: 80000,
    status: 1,
    applicants: [],
    category: { jobType: "offLine", talent: "Service", field: "Service" },
    location: {
      address: "23 Hangang-daero, Yongsan-gu, Seoul",
      detailedAddress: "1F event hall",
      mapX: 126.965706,
      mapY: 37.529325,
    },
    endDate: "2026-07-02T23:59:00.000Z",
    workStartDate: "2026-07-03T13:00:00.000Z",
    workEndDate: "2026-07-03T18:00:00.000Z",
  },
  {
    _id: "mock-job-006",
    emailID: "service@guru.local",
    nickName: "Tae-oh",
    title: "Neighborhood dog walking support",
    desc: "Walk a friendly dog near the park for one hour and send a short completion note.",
    pay: 35000,
    status: 1,
    applicants: [mockWorkers[1]],
    category: { jobType: "offLine", talent: "Service", field: "Agency" },
    location: {
      address: "31 World Cup-ro, Mapo-gu, Seoul",
      detailedAddress: "Meet at the main gate",
      mapX: 126.9105,
      mapY: 37.5572,
    },
    endDate: "2026-07-04T23:59:00.000Z",
    workStartDate: "2026-07-05T16:00:00.000Z",
    workEndDate: "2026-07-05T17:00:00.000Z",
  },
  {
    _id: "mock-job-007",
    emailID: "designer@guru.local",
    nickName: "Da-in",
    title: "Popup booth photo check",
    desc: "Check visitor photo submissions at the popup booth and organize approved images for upload.",
    pay: 42000,
    status: 1,
    applicants: [mockWorkers[0]],
    category: { jobType: "offLine", talent: "Design", field: "Participation" },
    location: {
      address: "23 Hangang-daero, Yongsan-gu, Seoul",
      detailedAddress: "1F photo booth",
      mapX: 126.965706,
      mapY: 37.529325,
    },
    endDate: "2026-07-02T23:59:00.000Z",
    workStartDate: "2026-07-03T15:00:00.000Z",
    workEndDate: "2026-07-03T18:00:00.000Z",
  },
];

export const mockUsers = [...authorUsers, ...mockWorkers];

export const getMockUser = (emailID) => mockUsers.find((user) => user.emailID === emailID) || mockAuthor;

export const getMockUsers = (applicants = []) =>
  applicants.map((applicant) => ({
    ...getMockUser(applicant.emailID),
    ...applicant,
  }));

export const getMockFindJobs = ({ jobType = "onLine", talent = "all", field = "all", titleText = "" } = {}) =>
  mockJobs.filter((job) => {
    const matchesType = job.category.jobType === jobType;
    const matchesTalent = talent === "all" || job.category.talent === talent;
    const matchesField = field === "all" || job.category.field === field;
    const matchesTitle = !titleText || job.title.toLowerCase().includes(titleText.toLowerCase());
    return matchesType && matchesTalent && matchesField && matchesTitle;
  });

export const getMockAppliedJobs = ({ jobType = "all", status = "all" } = {}) =>
  mockJobs.filter((job) => {
    const isApplied = job.applicants.length > 0;
    const matchesType = jobType === "all" || job.category.jobType === jobType;
    const matchesStatus = status === "all" || String(job.status) === String(status);
    return isApplied && matchesType && matchesStatus;
  });

export const getMockOfferJobs = ({ jobType = "all", status = "all" } = {}) =>
  mockJobs.filter((job) => {
    const isMine = job.emailID === mockAuthor.emailID;
    const matchesType = jobType === "all" || job.category.jobType === jobType;
    const matchesStatus = status === "all" || String(job.status) === String(status);
    return isMine && matchesType && matchesStatus;
  });
