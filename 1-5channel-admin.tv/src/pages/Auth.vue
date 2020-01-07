<template>
  <div class="comp-root">
    <div class="form-header">Аутентификация</div>
    <div class="form-container">
      <div class="form-item-container">
        <span class="label">Логин</span>
        <InputText type="text" v-model="login" maxlength="50" />
      </div>
      <div class="form-item-container">
        <span class="label">Пароль</span>
        <InputText type="password" v-model="password" />
      </div>

      <Button icon="pi pi-sign-in" label="Войти" @click="onLoginBtnClick()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import authS from "../services/auth.service";
import { CommonSettingsData } from "../dataTypes";

@Component
export default class Auth extends Vue {
  login = "";
  password = "";

  onLoginBtnClick() {
    authS.login(this.login, this.password, this);
  }
}
</script>

<style scoped lang="scss">
.comp-root {
  height: 250px;
  width: 250px;
  position: absolute;
  top: calc(50vh - 100px);
  left: calc(50vw - 100px);
  .form-header {
    text-align: center;
    background-color: rgba(128, 128, 128, 0.1);
    border: solid rgba(128, 128, 128, 0.3) 1px;
    padding: 10px;
  }
  .form-container {
    border: solid rgba(128, 128, 128, 0.3) 1px;
    border-top: none;
    padding: 10px;
    > button {
      display: block;
      margin: auto;
    }
  }
}
</style>