<template>
  <div class="comp-root">
    <div class="buttons-container">
      <Button
        icon="pi pi-save"
        label="Сохранить"
        @click="onSaveBtnClick()"
        :disabled="!pagesIsChanged()"
      />
      <Button
        icon="pi pi-times"
        label="Отмена"
        @click="onCancelBtnClick()"
        :disabled="!pagesIsChanged()"
      />
    </div>
    <Panel
      :header="page.navigation_name || 'Страница №' + page.id"
      :toggleable="true"
      :collapsed="true"
      v-for="page in pages"
      :key="page.id"
    >
      <div class="form-item-container">
        <span class="label">Название на навигационной панели</span>
        <InputText type="text" v-model="page.navigation_name" maxlength="100" />
      </div>
      <div class="form-item-container">
        <span class="label">Заголовок</span>
        <InputText type="text" v-model="page.title" maxlength="200" />
      </div>
      <div class="form-item-container">
        <span class="label">Описание</span>
        <Editor v-model="page.description">
          <template slot="toolbar">
            <select class="ql-size">
              <option value="small"></option>
              <option selected></option>
              <option value="large"></option>
            </select>
            <span class="ql-formats">
              <button class="ql-bold"></button>
              <button class="ql-italic"></button>
              <button class="ql-underline"></button>
              <button class="ql-strike"></button>
            </span>
            <span class="ql-formats">
              <select class="ql-color"></select>
              <select class="ql-align"></select>
              <button class="ql-clean"></button>
            </span>
          </template>
        </Editor>
      </div>
      <div class="banners-select-header">
        <div>Баннеры (выбранно {{page.banners_id.length}} из {{page.banners.length}})</div>
        <div>
          <div class="id-cell">id</div>
          <div class="title-cell">Заголовок</div>
        </div>
      </div>
      <div class="banners-select-items-container">
        <div class="banners-select-item" v-for="banner in page.banners" :key="banner.id">
          <div class="id-cell">{{banner.id}}</div>
          <div class="title-cell">{{banner.title}}</div>
          <Checkbox :binary="true" v-model="banner.checked" @change="onChangeBanner(page, banner)" />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Page, CutedBanner } from "../dataTypes";
import httpS from "../services/http.service";

@Component
export default class Pages extends Vue {
  pages: Page[] = [];
  pagesBackup = "[]";

  created() {
    const pr1 = this.$http.get(httpS.resources.page.get);
    const pr2 = this.$http.get(httpS.resources.banner.get, {
      params: { cuted: "true" }
    });
    Promise.all([pr1, pr2]).then(async data => {
      let banners = (await data[1].json())["data"];
      this.pages = await data[0].json();
      setTimeout(() => {
        this.updatePagesBackup();
      });
      for (let page of this.pages) {
        page.banners = [];
        for (let banner of banners) {
          const newBanner = { ...banner };
          page.banners.push(newBanner);
          newBanner.checked = page.banners_id.indexOf(banner.id) !== -1;
        }
      }
    });
  }

  pagesIsChanged() {
    return JSON.stringify(this.pages) !== this.pagesBackup;
  }

  updatePagesBackup() {
    this.pagesBackup = JSON.stringify(this.pages);
  }

  onSaveBtnClick() {
    this.$http
      .put(
        httpS.resources.page.change,
        this.pages.map(item => {
          const newPage = { ...item };
          delete newPage.banners;
          return newPage;
        })
      )
      .then(async () => {
        this.updatePagesBackup();
      });
  }

  onCancelBtnClick() {
    this.pages = JSON.parse(this.pagesBackup);
  }

  onChangeBanner(page: Page, banner: CutedBanner) {
    if (banner.checked) {
      page.banners_id.push(banner.id);
    } else {
      page.banners_id = page.banners_id.filter(item => item !== banner.id);
    }
  }
}
</script>

<style scoped lang="scss">
.comp-root {
  .buttons-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
    > button {
      margin: 0 3px;
    }
  }

  .banners-select-header {
    background-color: rgba(128, 128, 128, 0.1);
    border: solid rgba(128, 128, 128, 0.3) 1px;
    > *:nth-child(1) {
      text-align: center;
      font-weight: bold;
    }
    > *:nth-child(2) {
      display: flex;
    }
  }

  .banners-select-items-container {
    border: solid rgba(128, 128, 128, 0.3) 1px;
    border-top: none;
    max-height: 150px;
    overflow-y: auto;
    .banners-select-item {
      display: flex;
      margin: 3px 0;
      &:hover {
        background-color: rgba(128, 128, 128, 0.1);
      }

      .p-checkbox {
        margin: 0 3px;
      }
    }
  }

  .id-cell {
    margin: 0 3px;
    width: 100px;
  }
  .title-cell {
    margin: 0 3px;
    flex-grow: 1;
  }
}
</style>