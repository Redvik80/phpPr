<template>
  <div class="input-duration-comp-root">
    <div class="spinner-container">
      <Spinner v-model="hours" @input="onInput()" :min="0" :max="99" />ч.
    </div>
    <div class="spinner-container">
      <Spinner v-model="minutes" @input="onInput()" :min="0" :max="60" />мин.
    </div>
    <div class="spinner-container">
      <Spinner v-model="seconds" @input="onInput()" :min="0" :max="60" />сек.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class InputDuration extends Vue {
  @Prop() value: number;
  hours = 0;
  minutes = 0;
  seconds = 0;

  created() {
    this.hours = Math.floor(this.value / 3600);
    this.minutes = Math.floor((this.value - this.hours * 3600) / 60);
    this.seconds = Math.round(
      this.value - this.hours * 3600 - this.minutes * 60
    );
  }

  onInput() {
    const value = this.hours * 3600 + this.minutes * 60 + this.seconds;
    this.$emit("input", value);
  }
}
</script>

<style scoped lang="scss">
.input-duration-comp-root {
  display: flex;
  .spinner-container {
    width: 125px;
    text-align: center;
    .p-spinner {
      margin-right: 2px;
    }
  }
}
</style>

<style lang="scss">
.input-duration-comp-root {
  .p-spinner {
    input {
      width: 60px;
    }
  }
}
</style>