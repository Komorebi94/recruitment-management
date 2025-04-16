import { addJob } from "@/services/jobService";
import Mock from "mockjs";

const Random = Mock.Random;

const jobTitles = [
  "前端开发",
  "java开发",
  "python开发",
  "数据分析师",
  "数据科学家",
  "产品经理",
  "项目经理",
  "ui设计师",
  "测试工程师",
  "运维工程师",
];

const salaryArray = ["8k-12k", "12k-20k", "15k-25k", "20k-30k", "面谈"];
const jobTypeArray = ["全职", "实习", "兼职"];
const educationArray = ["大专", "本科", "硕士", "博士"];
const experienceArray = ["1-3年", "3-5年", "5-10年", "10年以上"];
const locations = ["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "西安", "南京", "长春"];
const departments = ["会员事业部", "产品部", "技术部", "运营部", "市场部", "人力资源部"];
const companies = ["字节跳动", "腾讯", "阿里巴巴", "百度", "美团", "京东", "小米", "拼多多"];

const generateMockJob = () => {
  const job = Mock.mock({
    title: Random.pick(jobTitles),
    company: Random.pick(companies),
    department: Random.pick(departments),
    location: Random.pick(locations),
    salary: Random.pick(salaryArray),
    jobType: Random.pick(jobTypeArray),
    education: Random.pick(educationArray),
    experience: Random.pick(experienceArray),
    description: "@cparagraph(1)",
    requirement: "@cparagraph(1)",
    id: "@id",
    status: "published",
    createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
  });

  return job;
};

export const addMockJobs = (length = 50) => {
  const mockList = Array.from({ length }, () => generateMockJob());
  mockList.forEach((job) => {
    addJob(job); // 假设你有这个函数负责保存职位
  });
};
