<template>
  <div class="comp-root" ref="compRoot">
    <InputText
      type="text"
      placeholder="Название телепередачи"
      v-model="inputValue"
      @input="onInput()"
      @mousedown="onInputMousedown()"
      @focus="onInputMousedown()"
    />
    <div class="no-height-container">
      <div class="programs-container" v-if="showProgramsFlag">
        <div
          class="program"
          v-for="item in programs"
          :key="item.id"
          @click="onSelectProgram(item)"
        >{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { CutedProgram } from "../dataTypes";
import { delayDecorator } from "../utils/delayDecorator";
import httpS from "../services/http.service";

@Component
export default class ProgramsFindInput extends Vue {
  @Prop() value: CutedProgram;
  inputValue: string = "";
  programs: CutedProgram[] = [];
  showProgramsFlag = false;

  created() {
    if (this.value) {
      this.programs = [this.value];
      this.inputValue = this.value.name;
    }
  }

  onInput = delayDecorator(this.findPrograms.bind(this), 500);

  findPrograms() {
    this.$http
      .get(httpS.resources.program.get, {
        params: { cuted: "true", find_str: this.inputValue }
      })
      .then(async (res: any) => {
        this.programs = (await res.json()).data;
      });
  }

  onInputMousedown() {
    this.showProgramsFlag = true;
    document.addEventListener("mousedown", this.onDocMousedown);
    this.onInput();
  }

  onDocMousedown = () => {
    if (
      !(this.$refs.compRoot as HTMLElement).contains(
        event.target as HTMLElement
      )
    ) {
      this.hidePrograms();
    }
  };

  hidePrograms() {
    this.showProgramsFlag = false;
    if (this.value) {
      this.inputValue = this.value.name;
      this.programs = [this.value];
    }
    document.removeEventListener("mousedown", this.onDocMousedown);
  }

  onSelectProgram(program: CutedProgram) {
    this.hidePrograms();
    this.programs = [program];
    this.inputValue = program.name;
    this.$emit("input", program);
  }
}
</script>

<style scoped lang="scss">
.comp-root {
  display: flex;
  flex-direction: column;
  input {
    background-color: transparent;
  }
  .no-height-container {
    height: 0;
    .programs-container {
      max-height: 200px;
      background-color: white;
      border: solid gray 1px;
      position: relative;
      z-index: 1;
      overflow-y: auto;
      margin-top: 1px;
      .program {
        padding-left: 5px;
        &:hover {
          background-color: rgba(128, 128, 128, 0.2);
        }
      }
    }
  }
}
</style>