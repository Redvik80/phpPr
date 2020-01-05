<template>
  <div class="app-root">
    <Toast />

    <div class="menu-container">
      <Menu :model="navItems" />
      <Button icon="pi pi-sign-out" class="logout-btn" />
    </div>
    <div class="page-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class App extends Vue {
  navItems = [
    {
      label: "Главная",
      to: "/home"
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
      label: "Общие настройки",
      to: "/common_settings"
    }
  ];
}
</script>

<style lang="scss">
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
  }

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
}
</style>
