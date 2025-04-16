import Mock from "mockjs";

export const mockResume = Mock.mock({
    name: "@cname",
    email: "@email",
    phone: /^1[3-9]\d{9}$/, // 随机手机号
    gender: "@pick(['男', '女'])",
    age: "@integer(20, 35)",
    location: "@city(true)",
    expectPosition: "@pick(['前端开发', '后端开发', '产品经理', 'UI设计师', '测试工程师'])",
    expectSalary: "@pick(['8k-12k', '12k-20k', '15k-25k', '20k-30k'])",
    "skills|3-6": ["@pick(['JavaScript', 'Vue', 'React', 'Node.js', 'Python', 'CSS', 'HTML', 'MySQL', 'TypeScript'])"],
    introduction: "@cparagraph(1)",

    "educationExperiences|1-2": [
        {
            school: "@ctitle(5, 10)大学",
            major: "@pick(['计算机科学与技术', '软件工程', '信息管理', '电子信息'])",
            degree: "@pick(['大专', '本科', '硕士'])",
            dateRange: ["@date('yyyy-MM')", "@date('yyyy-MM')"],
        },
    ],

    "projectExperiences|1-3": [
        {
            name: "@ctitle(5, 10)项目",
            role: "@pick(['前端开发', '后端开发', '项目负责人', '全栈开发'])",
            description: "@cparagraph(1)",
            dateRange: ["@date('yyyy-MM')", "@date('yyyy-MM')"],
        },
    ],

    "workExperiences|1-3": [
        {
            company: "@ctitle(5, 10)科技有限公司",
            position: "@pick(['前端开发工程师', '后端开发工程师', '产品经理'])",
            description: "@cparagraph(1)",
            dateRange: ["@date('yyyy-MM')", "@date('yyyy-MM')"],
        },
    ],
});
