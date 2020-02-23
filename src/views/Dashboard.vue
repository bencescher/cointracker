<template>
  <section class="container">
    <article class="container__chart">
      <header class="container__chart--header">
        <h2>Category ratios</h2>
      </header>
      <section class="container__chart--content">
        <polar-area id="polar" :chart-data="polarDatacollection" :options="polarOptions"></polar-area>
      </section>
    </article>
    <h2>My tags:</h2>
    <select name="tagselection" id="tagselection"></select>
  </section>
</template>

<script>
import db from "../firebase/init.js";
import polarArea from "../components/PolarArea.js";

export default {
  name: "Home",
  data() {
    return {
      polarDatacollection: [],
      polarOptions: {},
      transactions: [],
      tags: [],
      user: "testuser1"
    }
  },
  components: {
      "polar-area": polarArea
    },
  created() {
    // load the transactions data from database
    db.collection("userdata").doc(this.user).collection("transactions").get()
    .then(storedTransactions => {
      storedTransactions.forEach(transaction => {
        this.transactions.push(transaction.data());
      })
      this.displayChart();
    });
    // test adding tags to select options
    db.collection("userdata").doc(this.user).get()
    .then(storedUserData => {
      this.tags = storedUserData.data().tags;

      let tagselector = document.getElementById("tagselection");

      this.tags.forEach(tagelement => {
        tagselector.options[tagselector.options.length] = new Option(tagelement, tagelement);
      });
    });
  },
  methods: {
    displayChart() {
      let categories = ["Bills", "Food", "Travel", "Entertainment", "Shopping", "Education", "Household", "Sport", "Other"];
      let amounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      this.transactions.forEach(transaction => {
        for (let i = 0; i < categories.length; i++) {
          if (transaction.category === categories[i].toLowerCase()) {
            amounts[i] += transaction.amount;
          }
        }
      });
      // fill up datacollection with data from database
      this.polarDatacollection = {
          datasets: [{
            data: amounts,
            borderAlign: "inner",
            backgroundColor: [
              "rgba(0, 255, 0, .85)",
              "rgba(245, 223, 95, .85)",
              "rgba(218, 112, 214, .85)",
              "rgba(255, 127, 80, .85)",
              "rgba(135, 06, 235, .85)",
              "rgba(244, 164, 96, .85)",
              "rgba(64, 224, 208, .85)",
              "rgba(255, 215, 0, .85)",
              "rgba(255, 182, 193, .85)"
            ]
          }],
          labels: categories
        };
        // customize chart layout
        this.polarOptions = {
          legend: {
            position: "right",
            labels: {
              fontSize: 14
            }
          }
        };
    }
  }
};
</script>

<style>
.container {
  padding: 1rem;
  text-align: center;
}

.container__chart {
  margin: 0 auto;
  width: 40%;
}
</style>
