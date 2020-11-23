<template>
  <div>
    <div class="loader-wrapper" v-if="loading">
      <p>Loading...</p>
    </div>
    <div class="error-wrapper" v-if="showErrorMessage">
      <p>Something went wrong. Please try again later.</p>
    </div>
    <div class="list-wrapper" v-if="!loading && listItems && listItems.length">
      <h3 class="list-wrapper__title">Gists</h3>
      <ul class="list-wrapper__list">
        <ListItem
                v-for="item in activeListItems"
                :key="item.id"
                :item-data="item"
        />
      </ul>
      <div class="list-wrapper__pagination">
          <span v-for="(page, index) in visiblePages" :key="index" @click="goTo(page)" :class="['pagination-page', currentPage === page ? 'pagination-page--active' : '']">
            {{ page }}
          </span>
        <button :class="['pagination-button', linkBack ? '' : 'disabled']" @click="goBack">back</button>
        <button :class="['pagination-button', linkNext ? '' : 'disabled']" @click="goNext">next</button>
      </div>
    </div>
  </div>
</template>

<script>
  import ListItem from '@/components/ListItem'
  export default {
    name: "Home",
    components: {
      ListItem
    },
    data: () =>  ({
      listItems: [],
      showErrorMessage: false,
      loading: true,
      linkNext: '',
      linkBack: '',
      numberOfPages: 0,
      currentPage: 1,
    }),
    created () {
      this.$store.dispatch("getListItems").then(response => {
        const { data } = response;
        this.listItems = data;
        this.numberOfPages = parseInt(response.headers.link.split(',').find(link => link.includes('last')).split(';')[0].trim().slice(1, -1).split('?')[1].split('=')[1]);
        this.linkNext = response.headers.link.split(',').find(link => link.includes('next'));
        this.linkBack = response.headers.link.split(',').find(link => link.includes('prev'));
        this.loading = false;
      }).catch(() => {
        this.showErrorMessage = true;
      });
    },
    computed: {
      activeListItems () {
        return this.listItems
      },
      visiblePages () {
        let pages = [];

        for (let i = this.currentPage - 3; i <= this.currentPage + 3; i++) {
          if (i > 0 && i <= this.numberOfPages) {
            pages = [...pages, i]
          }
        }

        if (this.currentPage - 3 > 1 && this.currentPage + 3 < this.numberOfPages) {
          pages = [1, '...', ...pages, '...', this.numberOfPages]
        } else if (this.currentPage - 3 <= 1) {
          pages = [...pages, '...', this.numberOfPages]
        } else if (this.currentPage + 3 >= this.numberOfPages) {
          pages = [1, '...', ...pages]
        }

        return pages
      }
    },
    methods: {
      goBack () {
        if (!this.linkBack) return;
        this.loading = true;
        this.$store.dispatch("getListItems", this.linkBack).then(response => {
          const { data } = response;
          this.listItems = data;
          this.linkNext = response.headers.link.split(',').find(link => link.includes('next'));
          this.linkBack = response.headers.link.split(',').find(link => link.includes('prev'));
          if (this.currentPage > 1) {
            this.currentPage--
          }
          this.loading = false;
        }).catch(() => {
          this.showErrorMessage = true;
        });
      },
      goNext () {
        if (!this.linkNext) return;
        this.loading = true;
        this.$store.dispatch("getListItems", this.linkNext).then(response => {
          const { data } = response;
          this.listItems = data;
          this.linkNext = response.headers.link.split(',').find(link => link.includes('next'));
          this.linkBack = response.headers.link.split(',').find(link => link.includes('prev'));
          if (this.currentPage < this.numberOfPages) {
            this.currentPage++
          }
          this.loading = false;
        }).catch(() => {
          this.showErrorMessage = true;
        });
      },
      goTo (page) {
        if (page === '...') return;
        this.currentPage = page;
        const goToPage = `<https://api.github.com/gists/public?page=${page}>; rel='next'`;
        this.loading = true;
        this.$store.dispatch("getListItems", goToPage).then(response => {
          const { data } = response;
          this.listItems = data;
          this.linkNext = response.headers.link.split(',').find(link => link.includes('next'));
          this.linkBack = response.headers.link.split(',').find(link => link.includes('prev'));
          this.loading = false;
        }).catch(() => {
          this.showErrorMessage = true;
        });
      }
    }
  }
</script>

<style lang="scss">
  .loader-wrapper {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    p {

    }
  }
  .error-wrapper {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      color: red;
    }
  }
  .list-wrapper {
    &__title {
      padding: 6px 12px;
      background-color: #f3f3f3;
    }
    &__list {
      padding: 6px 12px;
    }
    &__pagination {
      padding: 6px 12px;
      text-align: right;

      .pagination-button {
        border: 1px solid #000000;
        border-radius: 4px;
        background-color: darken(#f3f3f3, 10);
        padding: 4px 6px;
        margin-left: 6px;

        &:hover {
          cursor: pointer;
          background-color: darken(#f3f3f3, 20);
        }

        &.disabled {
          cursor: not-allowed;
          color: lighten(#000000, 60);
          background-color: darken(#f3f3f3, 5);
          border: 1px solid lighten(#000000, 60);
        }
      }
      .pagination-page {
        color: #06a9f6;

        &--active,
        &:hover {
          cursor: pointer;
          color: darken(#06a9f6, 30);
        }
      }
    }
  }
</style>
