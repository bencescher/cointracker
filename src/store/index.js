import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import db from "../firebase/init";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: "",
    categories: [],
    myTags: [],
    myTransactions: []
  },

  mutations: {
    SET_TRANSACTIONS(state) {
      state.currentUser = firebase.auth().currentUser.email;
      state.myTransactions = [];
      // query transactions for logged in user from database
      db.collection("userdata")
        .doc(state.currentUser)
        .collection("transactions")
        .get()
        .then(storedTransactions => {
          storedTransactions.forEach(transaction => {
            const transactionData = transaction.data();

            transactionData.id = transaction.id;
            state.myTransactions.push(transactionData);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    CREATE_TRANSACTION(state, newTransaction) {
      db.collection("userdata")
        .doc(state.currentUser)
        .collection("transactions")
        .add(newTransaction);
    },

    DELETE_TRANSACTION(state, transactionId) {
      db.collection("userdata")
        .doc(state.currentUser)
        .collection("transactions")
        .doc(transactionId).delete()
          .then(() => {
            state.myTransactions = state.myTransactions.filter(transaction => {
              return transaction.id !== transactionId;
            })
          })
    },

    SET_CATEGORIES(state) {
      state.categories = [];

      state.myTransactions.forEach(transaction => {
        if (!state.categories.includes(transaction.category)) {
          state.categories.push(transaction.category);
        }
      });
    },

    SET_TAGS(state) {
      state.myTags = [];
      // query tags for logged in user from database
      state.myTransactions.forEach(myTransaction => {
        if (myTransaction.tags.length > 0) {
          myTransaction.tags.forEach(myTag => {
            if (!state.myTags.includes(myTag)) {
              state.myTags.push(myTag);
            }
          })
        }
      });
    }
  },

  actions: {
    initTransactions: ({ commit }) => {
      commit("SET_TRANSACTIONS");
    },

    initCategories: ({ commit }) => {
      commit("SET_CATEGORIES");
    },

    initTags: ({ commit }) => {
      commit("SET_TAGS");
    },

    createTransactions: ({ commit }, newTransaction) => {
      commit("CREATE_TRANSACTION", newTransaction);
    },

    deleteTransaction: ({ commit }, transactionId) => {
      commit("DELETE_TRANSACTION", transactionId);
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
