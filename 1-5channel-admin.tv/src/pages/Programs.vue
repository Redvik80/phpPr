<template>
  <div class="comp-root">
    <div class="p-inputgroup find-container">
      <InputText
        placeholder="Введите название телепередачи или его часть"
        v-model="findText"
        @input="onInputFind()"
      />
      <Button icon="pi pi-search" @click="onFindBtnClick()" />
    </div>
    <div class="programs-list-header">
      <div class="id-cell">id</div>
      <div class="name-cell">Название</div>
      <div class="buttons-cell">
        <Button icon="pi pi-plus" @click="onAddBtnClick()" />
      </div>
    </div>
    <div class="programs-list-container">
      <div v-for="program in programs" :key="program.id" class="programs-list-item">
        <div class="id-cell">{{program.id}}</div>
        <div class="name-cell">{{program.name}}</div>
        <div class="buttons-cell">
          <Button icon="pi pi-pencil" @click="onChangeBtnClick(program)" :disabled="!commonS.ytApiLoaded"/>
          <Button icon="pi pi-trash" @click="onDelBtnClick(program)" />
        </div>
      </div>
    </div>
    <Paginator
      :rows="10"
      :totalRecords="totalProgramsQuantity"
      @page="onChangePage($event)"
      v-if="paginationShowFlag"
    ></Paginator>

    <Dialog
      :header="selectedProgram.id ? 'Изменение телепередачи' : 'Создание телепередачи'"
      :visible.sync="showChangeDialogFlag"
      :closable="false"
      :modal="true"
    >
      <div class="change-dialog-body">
        <div class="form-item-container" v-if="selectedProgram.id">
          <span class="label">id: {{selectedProgram.id}}</span>
        </div>
        <div class="form-item-container">
          <span class="label">Название</span>
          <InputText type="text" v-model="selectedProgram.name" maxlength="200" />
        </div>

        <SelectButton
          v-model="selectedFromYtFlag"
          :options="fromYtFlags"
          optionLabel="title"
          optionValue="value"
          @input="onSelectFromYtFlag"
        />

        <div :style="{display: selectedProgram.from_youtube ? 'block' : 'none'}">
          <div ref="ytFrame"></div>

          <div class="form-item-container">
            <span class="label">Продолжительность: {{durationStr}}</span>
          </div>

          <div class="form-item-container">
            <span class="label">YouTube video id</span>
            <InputText
              type="text"
              v-model="selectedProgram.youtube_id"
              @input="onChangeYtId()"
              maxlength="50"
            />
          </div>
        </div>
        <div :style="{display: selectedProgram.from_youtube ? 'none' : 'block'}">
          <video
            width="300"
            height="200"
            controls
            preload="metadata"
            ref="videoPlayer"
            @loadedmetadata="onLoadVideoFileMetadata($event)"
          ></video>

          <div class="form-item-container">
            <span class="label">Продолжительность: {{durationStr}}</span>
          </div>

          <InputFile fileType="video" @fileChange="onFileChange($event)" />
        </div>
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
      <div>Вы действительно хотите удалить эту телепередачу?</div>
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
import commonS from "../services/common.service";
import { Program, NewFile } from "../dataTypes";
import { delayDecorator } from "../utils/delayDecorator";

declare var YT;

@Component
export default class Programs extends Vue {
  programs: Program[] = [];
  totalProgramsQuantity = 0;
  selectedPage = 1;
  showChangeDialogFlag = false;
  selectedProgram: Program;

  commonS = commonS;

  fromYtFlags = [
    {
      title: "YouTube",
      value: true
    },
    {
      title: "Файл",
      value: false
    }
  ];
  selectedFromYtFlag = false;
  durationStr = "0сек.";

  ytPlayer;
  ytPlayerWaitGetDuration = false;

  showConfirmDeleteDialogFlag = false;

  findText = "";
  paginationShowFlag = true;

  created() {
    this.getPrograms();
    this.setDefaultSelectedProgram();
  }

  setDefaultSelectedProgram() {
    this.selectedProgram = {
      id: null,
      name: "",
      duration: 0,
      from_youtube: false,
      file_name: "",
      youtube_id: "",
      newFile: {
        dataUrl: "",
        extension: ""
      }
    };
  }

  onSelectFromYtFlag(fromYoutube: boolean) {
    if (this.selectedFromYtFlag === null) {
      this.selectedFromYtFlag = this.selectedProgram.from_youtube;
      return;
    }
    this.selectedProgram.from_youtube = fromYoutube;
    this.selectedProgram.file_name = "";
    this.selectedProgram.youtube_id = "";
    this.selectedProgram.newFile = {
      dataUrl: "",
      extension: ""
    };
    this.durationStr = "0сек.";
    this.onChangeYtId();
    (this.$refs.videoPlayer as HTMLVideoElement).src = "";
  }

  getPrograms() {
    this.$http
      .get(httpS.api.program.get, {
        params: { find_str: this.findText.trim(), page: this.selectedPage }
      })
      .then(async (res: any) => {
        res = await res.json();
        this.programs = res.data;
        this.totalProgramsQuantity = res.totalQuantity;
      });
  }

  onChangeBtnClick(program: Program) {
    this.selectedProgram = JSON.parse(JSON.stringify(program));
    this.showChangeDialog();
  }

  showChangeDialog() {
    this.selectedFromYtFlag = this.selectedProgram.from_youtube;
    this.durationStr = this.convertDuration(this.selectedProgram.duration);
    this.showChangeDialogFlag = true;
    setTimeout(() => {
      if (!this.selectedProgram.from_youtube) {
        (this.$refs.videoPlayer as HTMLVideoElement).src = httpS.getVideoSrc(
          this.selectedProgram.file_name
        );
        (this.$refs.videoPlayer as HTMLVideoElement).load();
      }
      this.createYtPlayer();
    });
  }

  createYtPlayer() {
    this.ytPlayer = new YT.Player(this.$refs.ytFrame, {
      height: "200",
      width: "300",
      videoId: "",
      events: {
        onReady: () => {
          if (this.selectedProgram.from_youtube) this.onChangeYtId();
        },
        onStateChange: event => {
          if (
            event.data === YT.PlayerState.PLAYING &&
            this.ytPlayerWaitGetDuration
          ) {
            this.ytPlayerWaitGetDuration = false;
            this.selectedProgram.duration = Math.floor(
              this.ytPlayer.getDuration()
            );
            this.durationStr = this.convertDuration(
              this.selectedProgram.duration
            );
            this.ytPlayer.pauseVideo();
            this.$forceUpdate();
          }
        },
        onError: () => {
          if (this.ytPlayerWaitGetDuration) {
            this.ytPlayerWaitGetDuration = false;
            this.selectedProgram.duration = 0;
            this.durationStr = "0сек.";
            this.$forceUpdate();
          }
        }
      }
    });
  }

  onChangeYtId() {
    this.ytPlayer.loadVideoById(this.selectedProgram.youtube_id);
    this.ytPlayerWaitGetDuration = true;
  }

  onFileChange(value: NewFile) {
    (this.$refs.videoPlayer as HTMLVideoElement).src = value.dataUrl;
    (this.$refs.videoPlayer as HTMLVideoElement).load();
    this.selectedProgram.newFile = value;
  }

  onLoadVideoFileMetadata(event) {
    this.selectedProgram.duration = Math.floor(
      (this.$refs.videoPlayer as HTMLVideoElement).duration
    );
    this.durationStr = this.convertDuration(this.selectedProgram.duration);
    this.$forceUpdate();
  }

  onDelBtnClick(program: Program) {
    this.showConfirmDeleteDialogFlag = true;
    this.selectedProgram = program;
  }

  onConfirmDeleteBtnClick() {
    const id = this.selectedProgram.id;
    this.$http
      .delete(httpS.api.program.delete, {
        params: { id }
      })
      .then(async () => {
        this.showConfirmDeleteDialogFlag = false;
        this.setDefaultSelectedProgram();
        this.totalProgramsQuantity--;
        if (this.totalProgramsQuantity < (this.selectedPage - 1) * 10 + 1) {
          this.selectFirstPage();
        }
        this.getPrograms();
      });
  }

  onCancelDeleteBtnClick() {
    this.showConfirmDeleteDialogFlag = false;
    this.setDefaultSelectedProgram();
  }

  onAddBtnClick() {
    this.setDefaultSelectedProgram();
    this.showChangeDialog();
  }

  onSaveBtnClick() {
    if (this.selectedProgram.id) {
      this.$http
        .put(httpS.api.program.change, this.selectedProgram)
        .then(async (res: any) => {
          const newProgram = await res.body;
          this.programs = this.programs.map(item =>
            item.id === newProgram.id ? newProgram : item
          );
          this.showChangeDialogFlag = false;
        });
    } else {
      this.$http
        .post(httpS.api.program.add, this.selectedProgram)
        .then(async () => {
          this.showChangeDialogFlag = false;
          this.getPrograms();
        });
    }
  }

  onCancelBtnClick() {
    this.showChangeDialogFlag = false;
    this.setDefaultSelectedProgram();
  }

  convertDuration(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - hours * 3600) / 60);
    const seconds = Math.round(duration - hours * 3600 - minutes * 60);
    return (
      (hours ? `${hours}ч. ` : "") +
      (minutes ? `${minutes}мин. ` : "") +
      (seconds || (!hours && !minutes) ? `${seconds}сек.` : "")
    );
  }

  onFindBtnClick() {
    this.selectFirstPage();
    this.getPrograms();
  }

  onInputFind = delayDecorator(this.onFindBtnClick.bind(this), 500);

  onChangePage(event) {
    this.selectedPage = event.page + 1;
    this.getPrograms();
  }

  selectFirstPage() {
    this.selectedPage = 1;
    this.paginationShowFlag = false;
    setTimeout(() => (this.paginationShowFlag = true));
  }
}
</script>



<style scoped lang="scss">
.comp-root {
  .find-container {
    margin-bottom: 5px;
    input {
      flex-grow: 1;
    }
    button {
      margin-right: 3px;
    }
  }
  .programs-list-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .programs-list-container {
    min-height: 380px;
    .programs-list-item {
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
  .name-cell {
    flex-grow: 1;
  }
  .buttons-cell {
    button {
      margin: 0 3px;
    }
  }
  .change-dialog-body {
    width: 300px;
    .p-selectbutton {
      display: flex;
      justify-content: center;
      margin-bottom: 5px;
    }
  }
}
</style>