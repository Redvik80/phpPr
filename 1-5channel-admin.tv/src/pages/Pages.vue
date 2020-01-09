<template>
  <div class="pages-comp-root">
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
              <button class="ql-link"></button>
              <select class="ql-color"></select>
              <select class="ql-align"></select>
              <button class="ql-clean"></button>
            </span>
          </template>
        </Editor>
      </div>
      <div class="banners-select-header">
        <div>Баннеры (выбранно {{getQuantitySelectedBanners(page.banners)}} из {{page.banners.length}})</div>
        <div>
          <div class="id-cell">id</div>
          <div class="title-cell">Заголовок</div>
        </div>
      </div>
      <div class="banners-select-items-container">
        <div class="banners-select-item" v-for="banner in page.banners" :key="banner.id">
          <div class="id-cell">{{banner.id}}</div>
          <div class="title-cell">{{banner.title}}</div>
          <Button
            icon="pi pi-arrow-down"
            v-if="banner.order !== Infinity"
            @click="onOrderPlusBtnClick(page, banner)"
          />
          <Button
            icon="pi pi-arrow-up"
            v-if="banner.order !== Infinity"
            @click="onOrderMinusBtnClick(page, banner)"
          />
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
    const pr1 = this.$http.get(httpS.api.page.get);
    const pr2 = this.$http.get(httpS.api.banner.get, {
      params: { cuted: "true" }
    });
    Promise.all([pr1, pr2]).then(async data => {
      let banners = (await data[1].json())["data"] as CutedBanner[];
      this.pages = await data[0].json();

      setTimeout(() => {
        this.updatePagesBackup();
        this.panelsToAccordion();
      });

      for (let page of this.pages) {
        const oldBanners = page.banners;
        page.banners = [];
        for (let banner of banners) {
          const newBanner = { ...banner };
          page.banners.push(newBanner);
          const oldBanner = oldBanners.find(item => item.id === newBanner.id);
          if (oldBanner) {
            newBanner.checked = true;
            newBanner.order = oldBanner.order;
          } else {
            newBanner.checked = false;
            newBanner.order = Infinity;
          }
        }
        this.sortBanners(page.banners);
      }
    });
  }

  panelsToAccordion() {
    const panels = document.getElementsByClassName("p-panel-titlebar");
    for (let panel of panels) {
      const btn = panel.getElementsByClassName(
        "p-panel-titlebar-toggler"
      )[0] as HTMLElement;
      panel.addEventListener("click", event => {
        if (
          event.target === btn ||
          (event.target as HTMLElement).classList.contains("pi")
        ) {
          return;
        }
        btn.click();

        if (btn.firstElementChild.classList.contains("pi-plus")) {
          for (let panel of panels) {
            const btn = panel.getElementsByClassName(
              "p-panel-titlebar-toggler"
            )[0] as HTMLElement;
            if (btn.firstElementChild.classList.contains("pi-minus")) {
              btn.click();
            }
          }
        }
      });
    }
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
        httpS.api.page.change,
        this.pages.map(page => {
          const newPage = JSON.parse(JSON.stringify(page)) as Page;
          newPage.banners = newPage.banners
            .filter(banner => banner.checked)
            .map(banner => {
              delete banner.title;
              delete banner.checked;
              return banner;
            });
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

  sortBanners(banners: CutedBanner[]) {
    banners.sort((item1, item2) =>
      item1.order === item2.order ? 0 : item1.order - item2.order
    );
  }

  getQuantitySelectedBanners(banners: CutedBanner[]) {
    let quantity = 0;
    for (let banner of banners) if (banner.checked) quantity++;
    return quantity;
  }

  onChangeBanner(page: Page, banner: CutedBanner) {
    if (banner.checked) {
      banner.order = this.getQuantitySelectedBanners(page.banners) - 1;
      this.sortBanners(page.banners);
    } else {
      for (let item of page.banners) {
        if (item.order > banner.order) item.order--;
      }
      banner.order = Infinity;
      this.sortBanners(page.banners);
    }
  }

  onOrderPlusBtnClick(page: Page, bunner: CutedBanner) {
    const bunner2 = page.banners.find(item => item.order === bunner.order + 1);
    if (bunner2) {
      bunner2.order--;
      bunner.order++;
      this.sortBanners(page.banners);
    }
  }

  onOrderMinusBtnClick(page: Page, bunner: CutedBanner) {
    const bunner2 = page.banners.find(item => item.order === bunner.order - 1);
    if (bunner2) {
      bunner2.order++;
      bunner.order--;
      this.sortBanners(page.banners);
    }
  }
}
</script>

<style scoped lang="scss">
.pages-comp-root {
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
      .p-button {
        width: 20px;
        height: 20px;
        font-size: 12px;
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

<style lang="scss">
.pages-comp-root {
  .p-editor-container .p-editor-content {
    height: 150px;
  }
}
</style>