import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async getListItems (context, page) {
      let data;
      if (page) {
        data = await axios.get(page.split(';')[0].trim().slice(1, -1));
      } else {
        data = await axios.get('https://api.github.com/gists/public');
      }
      return data;
    }
  },
  modules: {}
})
