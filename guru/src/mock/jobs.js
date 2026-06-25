const mockAuthor = {
  _id: "mock-user-owner",
  emailID: "mock@guru.local",
  userName: "Demo Owner",
  nickName: "Guru Demo",
  certified: true,
  image: "",
  auth: "user",
  trust: 82,
};

const mockWorkers = [
  {
    _id: "mock-user-jiyoon",
    emailID: "jiyoon@guru.local",
    userName: "Jiyoon Kim",
    nickName: "Jiyoon",
    phone: "01012345678",
    status: 1,
    matched: false,
    image: "",
    trust: 76,
  },
  {
    _id: "mock-user-minho",
    emailID: "minho@guru.local",
    userName: "Minho Park",
    nickName: "Minho",
    phone: "01087654321",
    status: 2,
    matched: true,
    image: "",
    trust: 91,
  },
];

const authorUsers = [
  mockAuthor,
  {
    _id: "mock-user-designer",
    emailID: "designer@guru.local",
    userName: "Design Lab",
    nickName: "Design Lab",
    certified: true,
    image: "",
    auth: "user",
    trust: 88,
  },
  {
    _id: "mock-user-edu",
    emailID: "edu@guru.local",
    userName: "Edu Crew",
    nickName: "Edu Crew",
    certified: true,
    image: "",
    auth: "user",
    trust: 84,
  },
  {
    _id: "mock-user-service",
    emailID: "service@guru.local",
    userName: "Service Team",
    nickName: "Service Team",
    certified: true,
    image: "",
    auth: "user",
    trust: 79,
  },
];

export const mockJobs = [
  {
    _id: "mock-job-001",
    emailID: "mock@guru.local",
    nickName: "Guru Demo",
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
    nickName: "Guru Demo",
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
    nickName: "Design Lab",
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
    nickName: "Edu Crew",
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
    nickName: "Guru Demo",
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
    nickName: "Service Team",
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
