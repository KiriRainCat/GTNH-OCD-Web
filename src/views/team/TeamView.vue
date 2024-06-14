<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { API } from "@/pkg/services/api";
import { TeamDetail } from "@/pkg/services/api_types";
import { useDataStore } from "@/pkg/stores/data";
import { Input, Snackbar } from "@varlet/ui";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";

const store = useDataStore();
const { selectedTeamId } = storeToRefs(useDataStore());

// 创建团队相关
const teamNameInputRef = ref<Input>();
const teamName = ref("");
async function createTeam() {
  if (!(await teamNameInputRef.value?.validate())) return;

  API.createTeam(teamName.value)
    .then(() => {
      Snackbar.success("创建成功");
      teamName.value = "";
      API.refreshTeams().catch(() => {});
    })
    .catch(() => {});
}

// 团队管理相关
const isFetching = ref(true);
const teamDetail = ref<TeamDetail>();
onBeforeMount(() => {
  API.getTeamDetail(selectedTeamId.value)
    .then((detail) => (teamDetail.value = detail))
    .catch(() => {})
    .finally(() => (isFetching.value = false));

  // 监听团队切换
  watch(selectedTeamId, (id) => {
    isFetching.value = true;
    API.getTeamDetail(id)
      .then((detail) => (teamDetail.value = detail))
      .catch(() => {})
      .finally(() => (isFetching.value = false));
  });
});

// 团队加入相关
const joinTokenInputRef = ref<Input>();
const joinToken = ref("");
async function joinTeam() {
  if (!(await joinTokenInputRef.value?.validate()) || !store.user?.id) return;

  API.joinTeam(joinToken.value!)
    .then(() => {
      Snackbar.success("加入成功");
      API.refreshTeams().catch(() => {});
    })
    .catch(() => {});
}

// 入团码相关
const isFetchingJoinKey = ref(false);
const teamJoinToken = ref("");
async function fetchJoinKey() {
  isFetchingJoinKey.value = true;
  API.generateTeamJoinCode(selectedTeamId.value!)
    .then((token) => (teamJoinToken.value = token))
    .catch(() => {})
    .finally(() => (isFetchingJoinKey.value = false));
}

const showDataToken = ref(false);
</script>

<template>
  <div class="m-4 mt-[4.2rem] flex gap-4">
    <!-- 左侧基础栏 -->
    <div class="flex min-w-48 max-w-96 flex-1 flex-col gap-4">
      <!-- 团队创建 -->
      <var-paper elevation="2" class="p-4">
        <div class="flex justify-between">
          <div class="text-lg">创建团队</div>
          <div class="text-sm opacity-65">{{ store.teams?.filter((t) => t.owner_id == store.user?.id).length ?? 0 }}/3</div>
        </div>
        <div class="text-xs opacity-60">每个用户最多可创建 3 个团队</div>

        <div class="mx-4 my-1 flex flex-col gap-4">
          <var-input
            ref="teamNameInputRef"
            placeholder="团队名称"
            :rules="[(val) => val.length > 0 || '请输入团队名称']"
            v-model="teamName"
          />
          <var-button v-btn @click="createTeam">创建</var-button>
        </div>
      </var-paper>

      <!-- 团队加入 -->
      <var-paper elevation="2" class="p-4">
        <div class="text-lg">加入团队</div>
        <div class="text-xs opacity-60">入团秘钥找团队的创建者去要</div>

        <div class="mx-4 my-1 flex flex-col gap-4">
          <var-input
            ref="joinTokenInputRef"
            placeholder="入团秘钥"
            :rules="[(val) => val.length > 0 || '请输入入团秘钥']"
            v-model="joinToken"
          />
          <var-button v-btn @click="joinTeam">加入</var-button>
        </div>
      </var-paper>

      <!-- 图片占位符 -->
      <var-paper elevation="2" class="flex-1">
        <img src="@/assets/bg.webp" alt="" class="h-full object-cover" />
      </var-paper>
    </div>

    <!-- 团队管理 -->
    <var-paper elevation="2" class="flex-1 p-4">
      <div class="text-lg">管理团队</div>
      <div class="ml-0.5 text-xs opacity-60">调整右上角的下拉框以查看不同团队</div>

      <!-- 未选择团队时的提示 -->
      <div v-if="!store.selectedTeamId" class="flex h-full items-center justify-center">
        <var-loading type="disappear" description="还未选择团队" />
      </div>

      <!-- 团队详情 -->
      <div v-else class="mt-3 flex">
        <!-- 左半基本信息 -->
        <div class="flex-1">
          <!-- 团长名称 -->
          <div class="mb-1">
            <div class="text-lg">团长</div>
            <var-paper elevation="2" class="w-fit p-2">
              <var-loading v-if="isFetching" type="rect" />
              <div v-else>{{ teamDetail?.team?.owner?.username }}</div>
            </var-paper>
          </div>

          <!-- 成员列表 -->
          <div class="mb-1 mt-3 text-lg">成员</div>
          <div class="flex gap-1">
            <var-loading v-if="isFetching" class="m-8" />
            <var-paper v-else v-for="member in teamDetail?.members" :key="member.id" elevation="2" class="w-fit p-2">
              {{ member.username }}
            </var-paper>
          </div>
        </div>

        <!-- 右半敏感信息 & 特殊操作 -->
        <div class="flex-1">
          <!-- 数据秘钥区 -->
          <div class="mt-3">
            <div class="mb-1">
              <span class="mr-1 text-lg">数据秘钥</span>
              <span class="text-xs opacity-60">(用于游戏内 OC 脚本数据发送的校验)</span>
            </div>

            <div class="mt-1 flex items-center gap-1">
              <var-paper elevation="2" class="w-fit px-2 pt-2" :class="isFetching || showDataToken ? 'pb-2' : 'pb-1'">
                <var-loading v-if="isFetching" type="rect" />
                <div v-else>
                  <div v-if="showDataToken">{{ teamDetail?.team.data_token }}</div>
                  <div v-else>{{ "*".repeat(39) }}</div>
                </div>
              </var-paper>

              <var-button v-btn text size="mini" @click="() => (showDataToken = !showDataToken)" class="h-8">
                <Icon icon="mdi:eye-lock-open-outline" class="h-5 w-5" />
              </var-button>
            </div>
          </div>

          <!-- 入团秘钥区 -->
          <div class="mt-3">
            <div class="mb-1">
              <span class="mr-1 text-lg">入团秘钥</span>
              <span class="text-xs opacity-60">(每次揭开的秘钥都只有 1 小时有效期)</span>
            </div>

            <div class="mt-1 flex items-center gap-1">
              <var-paper elevation="2" class="w-fit px-2 pt-2" :class="isFetchingJoinKey || teamJoinToken.length > 0 ? 'pb-2' : 'pb-1'">
                <var-loading v-if="isFetchingJoinKey" type="rect" />
                <div v-else>
                  <div v-if="teamJoinToken.length > 0">{{ teamJoinToken }}</div>
                  <div v-else>{{ "*".repeat(39) }}</div>
                </div>
              </var-paper>

              <var-button v-btn text size="mini" @click="fetchJoinKey" class="h-8">
                <Icon icon="mdi:arrow-down-bold-hexagon-outline" class="h-5 w-5" />
              </var-button>
            </div>
          </div>

          <!-- 特殊操作区 -->
          <!-- TODO: 团队管理相关操作 -->
          <!-- <div class="mt-3">
            <div class="mb-1 text-lg">特殊操作</div>
            <var-button v-btn type="danger" size="small" class="mr-2">离开团队</var-button>
            <var-button v-btn type="danger" size="small">删除团队</var-button>
          </div> -->
        </div>
      </div>
    </var-paper>
  </div>
</template>

<style scoped></style>
