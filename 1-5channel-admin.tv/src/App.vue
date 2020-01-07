<template>
  <div class="app-root">
    <Toast />
    <ProgressSpinner v-if="!authS.isAuth && mainRouter.currentRoute.path !== '/auth'" />
    <div class="menu-container" v-if="authS.isAuth">
      <Menu :model="navItems" />
      <Button icon="pi pi-sign-out" class="logout-btn" @click="logout()" />
    </div>
    <div class="page-container" v-if="authS.isAuth || mainRouter.currentRoute.path === '/auth'">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import authS from "./services/auth.service";
import httpS from "./services/http.service";
import { HttpResponse } from "vue-resource/types/vue_resource";
import mainRouter from "./main.router";

@Component({
  components: {}
})
export default class App extends Vue {
  authS = authS;
  mainRouter = mainRouter;
  navItems = [
    {
      label: "Баннеры",
      to: "/banners"
    },
    {
      label: "Телепередачи",
      to: "/programs"
    },
    {
      label: "Расписание",
      to: "/scheldule"
    },
    {
      label: "Страницы",
      to: "/pages"
    },
    {
      label: "Общие настройки",
      to: "/common_settings"
    }
  ];

  created() {
    if (mainRouter.currentRoute.path !== "/auth") authS.checkToken(this);
  }

  logout() {
    authS.logout(this);
  }
}
</script>

<style scoped lang="scss">
body {
  margin: 10px;
  .app-root {
    display: flex;
    .menu-container {
      .p-menu {
        .p-menitem {
          .p-menuitem-link {
            &:focus {
              box-shadow: none;
            }
            &.router-link-active,
            &.router-link-active:hover {
              background-color: #007ad9;
              .p-menuitem-text {
                color: white;
              }
            }
          }
        }
      }
      .logout-btn {
        display: block;
        margin: 5px auto 0;
      }
    }

    .page-container {
      flex-grow: 1;
      margin-left: 10px;
      height: calc(100vh - 20px);
    }

    .p-progress-spinner {
      width: 200px;
      height: 200px;
      position: absolute;
      top: calc(50vh - 100px);
      left: calc(50vw - 100px);
    }
  }
}
</style>

<style lang="scss">
.form-item-container {
  > .label {
    display: block;
    margin-bottom: 3px;
  }
  > input {
    display: block;
    width: 100%;
  }
  margin-bottom: 10px;
}

.menu-container {
  .p-menu {
    .p-menitem {
      .p-menuitem-link {
        &:focus {
          box-shadow: none;
        }
        &.router-link-active,
        &.router-link-active:hover {
          background-color: #007ad9;
          .p-menuitem-text {
            color: white;
          }
        }
      }
    }
  }
}
</style>