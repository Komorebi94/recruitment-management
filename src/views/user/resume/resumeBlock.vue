<template>
    <div
        class="resume-section"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
    >
        <div class="section-header">
            <h3>{{ title }}</h3>
            <el-button
                v-if="hovering && !isEditing"
                type="primary"
                size="small"
                @click="$emit('edit')"
            >
                编辑
            </el-button>
        </div>

        <div v-if="isEditing" class="section-content edit-mode">
            <slot name="form" />
        </div>
        <div v-else class="section-content view-mode">
            <slot name="view" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    title: String,
    isEditing: Boolean,
});
const hovering = ref(false);
</script>

<style scoped lang="scss">
.resume-section {
    border-bottom: 1px solid #eee;
    padding: 20px 0;
    transition: background 0.3s ease;
}
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.section-content {
    margin-top: 10px;
}
</style>
