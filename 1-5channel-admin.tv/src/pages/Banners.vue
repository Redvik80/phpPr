<template>
  <div class="banners-comp-root">
    <div class="p-inputgroup find-container">
      <InputText
        placeholder="Введите название баннера или его часть"
        v-model="findText"
        @input="onInputFind()"
      />
      <Button icon="pi pi-search" @click="onFindBtnClick()" />
    </div>
    <div class="banners-list-header">
      <div class="id-cell">id</div>
      <div class="title-cell">Заголовок</div>
      <div class="buttons-cell">
        <Button icon="pi pi-plus" @click="onAddBtnClick()" />
      </div>
    </div>
    <div class="banners-list-container">
      <div v-for="banner in banners" :key="banner.id" class="banners-list-item">
        <div class="id-cell">{{banner.id}}</div>
        <div class="title-cell">{{banner.title}}</div>
        <div class="buttons-cell">
          <Button icon="pi pi-pencil" @click="onChangeBtnClick(banner)" />
          <Button icon="pi pi-trash" @click="onDelBtnClick(banner)" />
        </div>
      </div>
    </div>
    <Paginator
      :rows="10"
      :totalRecords="totalBannersQuantity"
      @page="onChangePage($event)"
      v-if="paginationShowFlag"
    ></Paginator>

    <Dialog
      :header="selectedBanner.id ? 'Изменение баннера' : 'Создание баннера'"
      :visible.sync="showChangeDialogFlag"
      :closable="false"
      :modal="true"
    >
      <div class="change-dialog-body">
        <div class="form-item-container" v-if="selectedBanner.id">
          <span class="label">id: {{selectedBanner.id}}</span>
        </div>
        <div class="form-item-container">
          <span class="label">Заголовок</span>
          <InputText type="text" v-model="selectedBanner.title" maxlength="200" />
        </div>
        <div class="form-item-container">
          <span class="label">Описание</span>

          <Editor v-model="selectedBanner.description">
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
        <img alt="banner image" :src="changeDialogImgSrc" class="change-dialog-img" />
        <InputFile fileType="image" @fileChange="onFileChange($event)" />
      </div>

      <template #footer>
        <Button icon="pi pi-save" label="Coxранить" @click="onSaveBtnClick()" />
        <Button icon="pi pi-times" label="Отмена" @click="onCancelBtnClick()" />
      </template>
    </Dialog>

    <Dialog
      header="Хорошо подумали?"
      :visible.sync="showConfirmDeleteDialogFlag"
      :closable="false"
      :modal="true"
    >
      <div>Вы действительно хотите удалить этот баннер?</div>
      <template #footer>
        <Button icon="pi pi-trash" label="Удалить" @click="onConfirmDeleteBtnClick()" />
        <Button icon="pi pi-times" label="Отмена" @click="onCancelDeleteBtnClick()" />
      </template>
    </Dialog>
  </div>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import httpS from "../services/http.service";
import { Banner, NewFile } from "../dataTypes";
import { delayDecorator } from "../utils/delayDecorator";

@Component
export default class Banners extends Vue {
  banners: Banner[] = [];
  totalBannersQuantity = 0;
  selectedPage = 1;
  showChangeDialogFlag = false;
  selectedBanner: Banner;

  showConfirmDeleteDialogFlag = false;

  findText = "";
  paginationShowFlag = true;

  changeDialogImgSrc: string = "";

  created() {
    this.getBanners();
    this.setDefaultSelectedBanner();
  }

  setDefaultSelectedBanner() {
    this.selectedBanner = {
      id: null,
      title: "",
      description: "",
      file_name: ""
    };
  }

  getBanners() {
    this.$http
      .get(httpS.api.banner.get, {
        params: { find_str: this.findText.trim(), page: this.selectedPage }
      })
      .then(async (res: any) => {
        res = await res.json();
        this.banners = res.data;
        this.totalBannersQuantity = res.totalQuantity;
      });
  }

  onChangeBtnClick(banner: Banner) {
    this.selectedBanner = JSON.parse(JSON.stringify(banner));
    this.showChangeDialog();
  }

  showChangeDialog() {
    this.showChangeDialogFlag = true;
    this.changeDialogImgSrc = httpS.getImgSrc(this.selectedBanner.file_name);
  }

  onFileChange(value: NewFile) {
    this.changeDialogImgSrc = value.dataUrl;
    this.selectedBanner.newFile = value;
  }

  onDelBtnClick(banner: Banner) {
    this.showConfirmDeleteDialogFlag = true;
    this.selectedBanner = banner;
  }

  onConfirmDeleteBtnClick() {
    const id = this.selectedBanner.id;
    this.$http
      .delete(httpS.api.banner.delete, {
        params: { id }
      })
      .then(async () => {
        this.showConfirmDeleteDialogFlag = false;
        this.setDefaultSelectedBanner();
        this.totalBannersQuantity--;
        if (this.totalBannersQuantity < (this.selectedPage - 1) * 10 + 1) {
          this.selectFirstPage();
        }
        this.getBanners();
      });
  }

  onCancelDeleteBtnClick() {
    this.showConfirmDeleteDialogFlag = false;
    this.setDefaultSelectedBanner();
  }

  onAddBtnClick() {
    this.setDefaultSelectedBanner();
    this.showChangeDialog();
  }

  onSaveBtnClick() {
    if (this.selectedBanner.id) {
      this.$http
        .put(httpS.api.banner.change, this.selectedBanner)
        .then(async (res: any) => {
          const newBanner = await res.body;
          this.banners = this.banners.map(item =>
            item.id === newBanner.id ? newBanner : item
          );
          this.showChangeDialogFlag = false;
        });
    } else {
      this.$http
        .post(httpS.api.banner.add, this.selectedBanner)
        .then(async () => {
          this.showChangeDialogFlag = false;
          this.getBanners();
        });
    }
  }

  onCancelBtnClick() {
    this.showChangeDialogFlag = false;
    this.setDefaultSelectedBanner();
  }

  onFindBtnClick() {
    this.selectFirstPage();
    this.getBanners();
  }

  onInputFind = delayDecorator(this.onFindBtnClick.bind(this), 500);

  onChangePage(event) {
    this.selectedPage = event.page + 1;
    this.getBanners();
  }

  selectFirstPage() {
    this.selectedPage = 1;
    this.paginationShowFlag = false;
    setTimeout(() => (this.paginationShowFlag = true));
  }
}
</script>



<style scoped lang="scss">
.banners-comp-root {
  .find-container {
    margin-bottom: 5px;
    input {
      flex-grow: 1;
    }
    button {
      margin-right: 3px;
    }
  }
  .banners-list-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .banners-list-container {
    min-height: 380px;
    .banners-list-item {
      display: flex;
      align-items: center;
      margin: 5px 0;
      &:hover {
        background-color: rgba(128, 128, 128, 0.2);
      }
    }
  }
  .id-cell {
    width: 100px;
  }
  .title-cell {
    flex-grow: 1;
  }
  .buttons-cell {
    button {
      margin: 0 3px;
    }
  }
  .change-dialog-body {
    width: 50vw;
    min-width: 300px;
    .p-selectbutton {
      display: flex;
      justify-content: center;
      margin-bottom: 5px;
    }
    .change-dialog-img {
      width: 100%;
      height: 100px;
      object-fit: contain;
    }
  }
}
</style>

<style lang="scss">
.banners-comp-root {
  .p-editor-container .p-editor-content {
    height: 150px;
  }
}
</style>