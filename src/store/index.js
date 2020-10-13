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
            state.myTransactions.push(transaction.data());
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

    SET_CATEGORIES(state) {
      state.categories = [];

      state.myTransactions.forEach(transaction => {
        if (!state.categories.includes(transaction.category)) {
          state.categories.push(transaction.category);
        }
      });
    },

    CREATE_TAG(state, newTag) {
      db.collection("userdata").doc(state.currentUser).get()
        .then(userData => {
          if (!userData.exists) {
            db.collection("userdata")
              .doc(state.currentUser)
              .set({})
                .then(() => {
                  db.collection("userdata")
                    .doc(state.currentUser)
                    .update({
                      tags: firebase.firestore.FieldValue.arrayUnion(newTag)
                    });
                });
          } else {
            db.collection("userdata")
              .doc(state.currentUser)
              .update({
                tags: firebase.firestore.FieldValue.arrayUnion(newTag)
              });
          }
        })
    },

    SET_TAGS(state) {
      state.myTags = [];
      // query tags for logged in user from database
      db.collection("userdata")
        .doc(state.currentUser)
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

    initCategories: ({ commit }) => {
      commit("SET_CATEGORIES");
    },

    initTags: ({ commit }) => {
      commit("SET_TAGS");
    },

    createTag: ({ commit }, newTag) => {
      commit("CREATE_TAG", newTag);
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
