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
import polarArea from "../components/PolarArea.js";

export default {
  name: "Home",
  data() {
    return {
      polarDatacollection: {},
      polarOptions: {}
    }
  },
  computed: {
    myTransactions() {
      return this.$store.getters.myTransactions;
    },
    myTags() {
      return this.$store.getters.myTags;
    }
  },
  components: {
    "polar-area": polarArea
  },
  watch: {
    myTransactions() {
      this.displayChart();
    },
    myTags() {
      this.fillSelect();
    }
  },
  created() {
    this.$store.dispatch("initTransactions");
    this.$store.dispatch("initTags");
  },
  methods: {
    fillSelect() {
      let tagselector = document.getElementById("tagselection");
      
      this.myTags.forEach(tagelement => {
        tagselector.options[
          tagselector.options.length
        ] = new Option(tagelement, tagelement);
      });
    },
    displayChart() {
      let categories = this.$store.getters.categories;
      let amounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      this.myTransactions.forEach(transaction => {
        for (let i = 0; i < categories.length; i++) {
          if (transaction.category === categories[i].toLowerCase()) {
            amounts[i] += transaction.amount;
          }
        }
      });
      // fill up datacollection with data from transactions
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
}
</style>
