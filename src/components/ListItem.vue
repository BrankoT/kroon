<template>
  <div class="list-item" @click="showImage(itemData.owner.avatar_url)">
      <div class="list-item__avatar">
          <img class="list-item__avatar-image" :src="itemData.owner.avatar_url" alt="avatar" width="60" height="60">
          <div class="list-item__avatar-overlay"></div>
      </div>

      <div class="list-item__files">
          <div v-for="(fileName, index) in fileNames" :key="fileName">
              {{ fileName }}<span v-if="index !== fileNames.length - 1">,</span>
          </div>
      </div>

      <div v-if="selectedItem" :class="['selected-item', selectedItem ? 'selected-item--active' : '']">
          <img class="" :src="selectedItem" alt="avatar" width="160" height="160">
      </div>
  </div>
</template>

<script>
export default {
    name: 'ListItem',
    props: {
        itemData: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        selectedItem: null
    }),
    computed: {
        fileNames () {
            let names = [];
            for ( const file in this.itemData.files) {
                names.push(file)
            }
            return names
        }
    },
    methods: {
        showImage (image) {
            this.selectedItem = image;
            setTimeout(() => {
                this.selectedItem = null
            }, 1000)
        }
    }
}
</script>

<style lang="scss">
.list-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e3e3e3;

    &:hover {
        color: #06a9f6;
        cursor: pointer;
    }

    &__avatar {
        position: relative;

        &-image {
            vertical-align: middle;
            text-align: center;
        }

        &-overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100%;
            width: 100%;
            opacity: 0;
            transition: .3s ease;
            background-color: black;

        }
    }

    &:hover .list-item__avatar-overlay {
        opacity: 0.5;
    }

    &__files {
        margin-left: 12px;
        display: flex;
        flex-wrap: wrap;
    }
}
.selected-item {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;

    &--active {
        animation: fade_in_out 1s;
    }
}
@keyframes fade_in_out {
    0%   { opacity: 0; }
    50%  { opacity: 1; }
    100% { opacity: 0; }
}
</style>
