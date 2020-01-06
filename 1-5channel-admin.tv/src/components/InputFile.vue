<template>
  <div class="input-file-comp-root" ref="compRoot">
    <label>
      <span>Выбрать файл</span>
      <input type="file" @change="onSelectFile($event)" />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class InputFile extends Vue {
  @Prop() fileType: "video" | "audio" | "image";

  created() {}

  onSelectFile(event) {
    const file = event.target.files[0];

    if (file.type && !file.type.startsWith(this.fileType + "/")) {
      return this.$toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: "Недопустимый тип файла",
        life: 5000
      });
    }

    let reader = new FileReader();
    reader.addEventListener("load", event2 => {
      let dataUrl = (event2.target as any).result;
      this.$emit("fileChange", {
        dataUrl: dataUrl,
        extension: file.name.split(".").pop()
      });
    });
    reader.readAsDataURL(file);
    event.target.value = "";
  }
}
</script>

<style scoped lang="scss">
.input-file-comp-root {
  > label {
    display: block;
    background-color: #007ad9;
    color: white;
    padding: 6px 14px;
    border: 1px solid #007ad9;
    border-radius: 3px;
    text-align: center;

    &:hover {
      background-color: #116fbf;
      border-color: #116fbf;
    }

    &:active {
      background-color: #005b9f;
      border-color: #005b9f;
    }

    > input[type="file"] {
      display: none;
    }
  }
}
</style>