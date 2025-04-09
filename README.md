## 📌 招聘管理系统

### 项目简介
本项目是一个 **基于 Vue 3 + Element Plus + IndexedDB + Pinia** 的招聘管理系统，支持 **求职者** 和 **管理员** 两种角色：
- **求职者** 可以浏览职位、投递简历、管理个人信息。
- **管理员** 可以发布职位、筛选简历、安排面试。

---

## 🛠️ 技术栈
- **Vue 3** - 前端框架
- **Element Plus** - UI 组件库
- **Pinia** - 状态管理
- **IndexedDB** - 本地数据存储
- **Vue Router** - 路由管理
- **Vite** - 构建工具

---

## 📂 目录结构
```
recruitment-management/
│── public/                     # 静态资源
│── src/
│   ├── api/                     # API 接口封装（IndexedDB 相关操作）
│   ├── components/              # 组件
│   ├── pages/                   # 页面
│   │   ├── admin/               # 管理员相关页面
│   │   ├── job-seeker/          # 求职者相关页面
│   │   ├── auth/                # 登录注册页面
│   │   ├── jobs/                # 职位浏览页面
│   │   ├── home.vue             # 主页
│   ├── router/                  # Vue Router 配置
│   ├── store/                   # Pinia 状态管理
│   ├── utils/                   # 工具函数
│   ├── App.vue                  # 根组件
│   ├── main.js                  # 入口文件
│── index.html                    # 入口 HTML 文件
│── vite.config.js                 # Vite 配置
│── package.json                   # 依赖管理
│── README.md                      # 项目说明
```

---

## 🚀 安装 & 运行

### 1️⃣ 克隆项目
```sh
git clone https://github.com/your-repo/recruitment-management.git
cd recruitment-management
```

### 2️⃣ 安装依赖
```sh
yarn install
```

### 3️⃣ 运行项目
```sh
yarn dev
```
浏览器打开 [http://localhost:5173](http://localhost:5173)

---

## 🔑 功能模块
### ✅ 用户管理
- **求职者**：注册、登录、编辑个人信息、投递简历、筛选职位。
- **管理员**：发布职位、筛选简历、安排面试。

### ✅ 权限管理
- **未登录用户**：只能浏览职位信息。
- **求职者**：登录后可投递简历、修改信息。
- **管理员**：管理职位、筛选简历、安排面试。

### ✅ 数据存储
- IndexedDB 存储 **用户信息、简历、职位、面试安排**。


## 📜 未来计划
- ✅ **职位筛选**
- ✅ **求职者简历管理**
- ✅ **管理员面试安排**
- ⏳ **WebSocket 实时面试通知**
- ⏳ **优化 UI 界面**

---

## 🤝 贡献指南
如果你想贡献代码：
1. **Fork** 本仓库
2. 创建新 **feature 分支**
3. 提交 **Pull Request**

---

## 📄 许可证
MIT License

---

如果有任何问题，欢迎提 Issue 讨论！🚀