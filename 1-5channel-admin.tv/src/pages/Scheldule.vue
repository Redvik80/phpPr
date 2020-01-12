<template>
  <div class="comp-root">
    <div class="scheldule-list-header">
      <div class="time-cell">Время ({{utcOffset > 0 ? "" : "+"}}{{utcOffset / -60}}ч.)</div>
      <div class="name-cell">Телепередача</div>
      <div class="buttons-cell">
        <Calendar
          :value="selectedDate"
          :showIcon="true"
          dateFormat="dd.mm.yy"
          :manualInput="false"
          @select="onChangeDate($event)"
        />
        <Button icon="pi pi-save" @click="onSaveBtnClick()" :disabled="!schelduleIsChanged()" />
        <Button icon="pi pi-times" @click="onCancelBtnClick()" :disabled="!schelduleIsChanged()" />
        <Button icon="pi pi-plus" @click="onAddBtnClick()" />
      </div>
    </div>
    <div class="scheldule-list-container">
      <div
        v-for="(item, index) in schelduleItems"
        :key="item.id"
        :class="{'scheldule-list-item': true, invalid: !item.time.isValid}"
      >
        <div class="time-cell">{{item.time.str}}</div>
        <div class="name-cell">
          <ProgramsFindInput v-model="item.program" @input="updateTime()" />
        </div>
        <div class="buttons-cell">
          <Button icon="pi pi-arrow-down" @click="onOrderPlusBtnClick(item)" />
          <Button icon="pi pi-arrow-up" @click="onOrderMinusBtnClick(item)" />
          <Button icon="pi pi-trash" @click="onDelBtnClick(index, item)" />
        </div>
      </div>
    </div>

    <Dialog
      header="Сохраниться не забыли?"
      :visible.sync="showConfirmChangeDateDialogFlag"
      :closable="false"
      :modal="true"
    >
      <div>Вы действительно хотите перейти на расписание другой даты? Все несохранённые изменения будут потеряны.</div>
      <template #footer>
        <Button icon="pi pi-save" label="Сохранить" @click="onChangeDateWithSaveBtnClick()" />
        <Button
          icon="pi pi-trash"
          label="Ну и чёрт с ними"
          @click="onChangeDateWithoutSaveBtnClick()"
        />
        <Button icon="pi pi-times" label="Отмена" @click="onCancelChangeDateBtnClick()" />
      </template>
    </Dialog>

    <Dialog
      header="Добавление телепередачи"
      :visible.sync="showAddDialogFlag"
      :closable="false"
      :modal="true"
    >
      <div class="add-dialog-text">Внимание! Телепередача будет добавлена в конец расписания.</div>
      <ProgramsFindInput v-model="tempSchelduleItem.program" />
      <template #footer>
        <Button icon="pi pi-save" label="Сохранить" @click="onConfirmAddBtnClick()" />
        <Button icon="pi pi-times" label="Отмена" @click="onCancelConfirmAddBtnClick()" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import httpS from "../services/http.service";
import { SchelduleItem, CutedProgram } from "../dataTypes";
import { delayDecorator } from "../utils/delayDecorator";
import moment from "moment";

@Component
export default class Scheldule extends Vue {
  schelduleItems: SchelduleItem[] = [];
  schelduleItemsBackup: string = "[]";

  showConfirmChangeDateDialogFlag = false;

  findText = "";

  selectedDate = new Date();
  tempSelectedDate: Date;

  showAddDialogFlag = false;
  tempSchelduleItem: SchelduleItem;

  utcOffset = moment().utcOffset();

  created() {
    const dateNow = new Date();
    this.selectedDate = moment().utc()
      .startOf("date")
      .toDate();
    this.getScheldule();
    this.updateTempSchelduleItem();
  }

  schelduleIsChanged() {
    return JSON.stringify(this.schelduleItems) !== this.schelduleItemsBackup;
  }

  updateSchelduleBackup() {
    this.schelduleItemsBackup = JSON.stringify(this.schelduleItems);
  }

  updateTempSchelduleItem() {
    this.tempSchelduleItem = {
      id: null,
      date: moment(this.selectedDate).unix(),
      order: this.schelduleItems.length,
      program: null
    };
  }

  onConfirmAddBtnClick() {
    if (this.tempSchelduleItem.program) {
      this.schelduleItems.push(this.tempSchelduleItem);
      this.showAddDialogFlag = false;
      this.updateTime();
    }
  }

  onCancelConfirmAddBtnClick() {
    this.showAddDialogFlag = false;
  }

  onAddBtnClick() {
    this.updateTempSchelduleItem();
    this.showAddDialogFlag = true;
  }

  getScheldule() {
    this.$http
      .get(httpS.api.scheldule.get, {
        params: {
          date:
            moment(this.selectedDate).unix() + ""
        }
      })
      .then(async (res: any) => {
        this.schelduleItems = await res.json();
        this.updateTime();
        this.updateSchelduleBackup();
      });
  }

  onDelBtnClick(arrIdx: number, delItem: SchelduleItem) {
    this.schelduleItems.splice(arrIdx, 1);
    for (let item of this.schelduleItems) {
      if (item.order > delItem.order) item.order--;
    }
    this.updateTime();
  }

  onCancelBtnClick() {
    this.schelduleItems = JSON.parse(this.schelduleItemsBackup);
    this.updateTime();
  }

  onOrderPlusBtnClick(item1: SchelduleItem) {
    const item2 = this.schelduleItems.find(
      item => item.order === item1.order + 1
    );
    if (!item2) return;
    item1.order++;
    item2.order--;
    this.schelduleItems.sort((item1, item2) => item1.order - item2.order);
    if (!item1.id && !item2.id) {
      item1.id = -1;
      item2.id = -2;
      setTimeout(() => {
        item1.id = null;
        item2.id = null;
      });
    }
    this.updateTime();
  }

  onOrderMinusBtnClick(item1: SchelduleItem) {
    const item2 = this.schelduleItems.find(
      item => item.order === item1.order - 1
    );
    if (!item2) return;
    item1.order--;
    item2.order++;
    this.schelduleItems.sort((item1, item2) => item1.order - item2.order);
    if (!item1.id && !item2.id) {
      item1.id = -1;
      item2.id = -2;
      setTimeout(() => {
        item1.id = null;
        item2.id = null;
      });
    }
    this.updateTime();
  }

  onChangeDate(newDate: Date) {
    if (+newDate === +this.selectedDate) return;
    this.tempSelectedDate = newDate;
    if (this.schelduleIsChanged()) {
      this.showConfirmChangeDateDialogFlag = true;
    } else {
      this.onChangeDateWithoutSaveBtnClick();
    }
  }

  onChangeDateWithSaveBtnClick() {
    this.onSaveBtnClick();
    this.onChangeDateWithoutSaveBtnClick();
  }
  onChangeDateWithoutSaveBtnClick() {
    this.selectedDate = this.tempSelectedDate;
    this.tempSelectedDate = null;
    this.showConfirmChangeDateDialogFlag = false;
    this.schelduleItems = [];
    this.updateSchelduleBackup();
    this.getScheldule();
  }
  onCancelChangeDateBtnClick() {
    this.tempSelectedDate = null;
    this.selectedDate = new Date(this.selectedDate);
    this.showConfirmChangeDateDialogFlag = false;
  }

  onSaveBtnClick() {
    this.$http
      .put(
        httpS.api.scheldule.change,
        this.schelduleItems.map(item => {
          const newItem = { ...item };
          newItem.program_id = newItem.program.id;
          //delete newItem.program;
          delete newItem.time;
          return newItem;
        }),
        {
          params: {
            date:
              moment(this.selectedDate).unix() + ""
          }
        }
      )
      .then(async (res: any) => {
        this.schelduleItems = await res.json();
        this.updateTime();
        this.updateSchelduleBackup();
      });
  }

  updateTime() {
    const time = {
      hours: 0,
      minutes: 0,
      seconds: 0
    };
    for (let schelduleItem of this.schelduleItems) {
      schelduleItem.time = {
        str: (time.hours < 10 ? "0" : "") + time.hours + ":" +
          (time.minutes < 10 ? "0" : "") + time.minutes + ":" +
          (time.seconds < 10 ? "0" : "") + time.seconds,
        isValid: false
      };
      time.seconds += schelduleItem.program.duration;
      time.minutes += Math.floor(time.seconds / 60);
      time.seconds = time.seconds % 60;
      time.hours += Math.floor(time.minutes / 60);
      time.minutes = time.minutes % 60;
      if ((time.hours === 24 && time.minutes === 0 && time.seconds === 0) || time.hours < 24) {
        schelduleItem.time.isValid = true;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.comp-root {
  .scheldule-list-header {
    display: flex;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.1);
    border: solid rgba(128, 128, 128, 0.3) 1px;
    padding: 3px;
  }
  .scheldule-list-container {
    border: solid rgba(128, 128, 128, 0.3) 1px;
    border-top: none;
    padding: 3px;
    height: calc(100vh - 60px);
    overflow-y: auto;
    .scheldule-list-item {
      display: flex;
      align-items: center;
      margin: 5px 0;
      &:hover {
        background-color: rgba(128, 128, 128, 0.2);
      }

      &.invalid {
        background-color: rgba(128, 128, 128, 0.75);
        .time-cell {
          text-decoration: line-through;
        }
      }
    }
  }
  .time-cell {
    width: 100px;
  }
  .name-cell {
    flex-grow: 1;
  }
  .buttons-cell {
    .p-calendar {
      margin: 0 36px 0 3px;
    }
    button {
      margin: 0 3px;
    }
  }

  .add-dialog-text {
    margin-bottom: 10px;
  }
}
</style>