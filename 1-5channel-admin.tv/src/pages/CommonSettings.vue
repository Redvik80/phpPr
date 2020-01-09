<template>
  <div class="comp-root" v-if="data">
    <div class="buttons-container">
      <Button
        icon="pi pi-save"
        label="Сохранить"
        @click="onSaveBtnClick()"
        :disabled="!dataIsChanged()"
      />
      <Button
        icon="pi pi-times"
        label="Отмена"
        @click="onCancelBtnClick()"
        :disabled="!dataIsChanged()"
      />
    </div>
    <div class="form-item-container">
      <span class="label">Главный заголовок (надпись на вкладке браузера)</span>
      <InputText type="text" v-model="data.head_title" maxlength="200" />
    </div>
    <div class="input-file-container">
      <span class="label">Favicon (иконка на вкладке браузера)</span>
      <img alt="favicon" :src="faviconImgSrc" />
      <InputFile fileType="image" @fileChange="onFaviconChange($event)" />
    </div>
    <div class="input-file-container">
      <span class="label">Логотип</span>
      <img alt="logo" :src="logoImgSrc" />
      <InputFile fileType="image" @fileChange="onLogoChange($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import httpS from "../services/http.service";
import { CommonSettingsData } from "../dataTypes";

@Component
export default class CommonSettings extends Vue {
  data: CommonSettingsData = null;
  dataBackup = "null";
  faviconImgSrc = httpS.getImgSrc("");
  logoImgSrc = httpS.getImgSrc("");

  created() {
    this.$http.get(httpS.api.commonSettings.get).then(async data => {
      this.data = await data.json();
      this.faviconImgSrc = httpS.getImgSrc(this.data.favicon_file_name);
      this.logoImgSrc = httpS.getImgSrc(this.data.logo_file_name);
      this.updateDataBackup();
    });
  }

  dataIsChanged() {
    return JSON.stringify(this.data) !== this.dataBackup;
  }

  updateDataBackup() {
    this.dataBackup = JSON.stringify(this.data);
  }

  onFaviconChange(value) {
    this.data.newFavicon = value;
    this.faviconImgSrc = value.dataUrl;
  }

  onLogoChange(value) {
    this.data.newLogo = value;
    this.logoImgSrc = value.dataUrl;
  }

  onSaveBtnClick() {
    this.$http
      .put(httpS.api.commonSettings.change, this.data)
      .then(async res => {
        this.data = await res.json();
        this.faviconImgSrc = httpS.getImgSrc(this.data.favicon_file_name);
        this.logoImgSrc = httpS.getImgSrc(this.data.logo_file_name);
        this.updateDataBackup();
      });
  }

  onCancelBtnClick() {
    this.data = JSON.parse(this.dataBackup);
  }
}
</script>

<style scoped lang="scss">
.comp-root {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  > * {
    width: 100%;
  }
  .buttons-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
    > button {
      margin: 0 3px;
    }
  }
  .input-file-container {
    width: 50%;
    min-width: 200px;
    padding: 5px;
    > img {
      width: 100%;
      height: 100px;
      object-fit: contain;
    }
  }
}
</style>