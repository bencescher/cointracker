import Vue from "vue";
import Vuex from "vuex";
import db from "../firebase/init";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: "",
    categories: [
      "Bills",
      "Food",
      "Travel",
      "Entertainment",
      "Shopping",
      "Education",
      "Household",
      "Sport",
      "Other"
    ],
    myTags: [],
    myTransactions: []
  },

  mutations: {
    SET_TRANSACTIONS(state) {
      state.myTransactions = [];
      // query transactions for logged in user from database
      db.collection("userdata")
        .doc("testuser1")
        .collection("transactions")
        .get()
        .then(storedTransactions => {
          storedTransactions.forEach(transaction => {
            state.myTransactions.push(transaction.data());
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    CREATE_TRANSACTION(state, newTransaction) {
      state.currentUser = "testuser1";

      db.collection("userdata")
        .doc(state.currentUser)
        .collection("transactions")
        .add(newTransaction)
    },

    SET_TAGS(state) {
      state.myTags = [];
      // query tags for logged in user from database
      db.collection("userdata")
        .doc("testuser1")
        .get()
        .then(storedUserData => {
          state.myTags = storedUserData.data().tags;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  actions: {
    initTransactions: ({ commit }) => {
      commit("SET_TRANSACTIONS");
    },

    initTags: ({ commit }) => {
      commit("SET_TAGS");
    },
    
    createTransactions: ({ commit }, newTransaction) => {
      commit("CREATE_TRANSACTION", newTransaction);
    }
  },

  getters: {
    categories: state => {
      return state.categories;
    },

    myTags: state => {
      return state.myTags;
    },

    myTransactions: state => {
      return state.myTransactions;
    }
  }
});
