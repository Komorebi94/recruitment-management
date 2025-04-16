import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        redirect: "/home",
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/auth/login.vue"), // 登录页面
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("@/views/auth/register.vue"), // 注册页面
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/index.vue"), // 首页（公共访问）
    },
    {
        path: "/admin",
        component: () => import("@/layout/adminLayout.vue"),
        children: [
            {
                path: "post-job",
                component: () => import("@/views/admin/job-create/index.vue"),
            },
            {
                path: "job-list",
                component: () => import("@/views/admin/job-list/index.vue"),
            },
            {
                path: "drafts",
                component: () => import("@/views/admin/job-drafts/index.vue"),
            },
            {
                path: "applications",
                component: () =>
                    import("@/views/admin/job-application-list/index.vue"),
            },
            {
                path: 'resume-preview',
                component: () => import('@/views/admin/resume-preview/index.vue')
            },
            {
                path: 'interviews',
                component: () => import('@/views/admin/interviews/index.vue')
            },
            { path: "", redirect: "/admin/post-job" },
        ],
    },
    {
        path: "/user",
        component: () => import("@/layout/userLayout.vue"), // 求职者 layout
        children: [
            {
                path: "profile",
                component: () => import("@/views/user/profile/index.vue"),
            },
            {
                path: "resume",
                component: () => import("@/views/user/resume/index.vue"),
            },
            {
                path: "applied",
                component: () => import("@/views/user/applied/index.vue"),
            },
            {
                path: "",
                redirect: "profile",
            },
        ],
    },
    {
        path: "/job/:id",
        name: "JobDetail",
        component: () => import("@/views/common/job-detail.vue"),
    },
    {
        path: "",
        redirect: "/home",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 简单的本地登录状态存储方式（可换 pinia）
const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.role
}

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('user')

    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login')
    } else if (to.meta.role && to.meta.role !== getUserRole()) {
        next('/') // 非法角色访问跳转主页
    } else {
        next()
    }
})

export default router;
