<template>
  <section class="container">
    <div class="row">
      <div class="col2-1">
        <article class="container__chart">
          <header class="container__chart--header">
            <h2>Expenses by category</h2>
          </header>
          <section class="container__chart--content">
            <polar-area
              id="polarCategory"
              class="chart-polar"
              :chart-data="polarCategoryDatacollection"
              :options="polarOptions"
            ></polar-area>
          </section>
        </article>
      </div>
      <div class="col2-1">
        <article class="container__chart">
          <header class="container__chart--header">
            <h2>Expenses by tags</h2>
          </header>
          <section class="container__chart--content">
            <polar-area
              id="polarTag"
              class="chart-polar"
              :chart-data="polarTagDatacollection"
              :options="polarOptions"
            ></polar-area>
          </section>
        </article>
      </div>
      <div class="col2-1">
        <article class="container__chart">
          <h2>My tags:</h2>
          <select name="tagselection" id="tagselection"></select>
          <line-chart :chart-data="lineDatacollection"></line-chart>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import lineChart from "../components/Line.js";
import polarArea from "../components/PolarArea.js";

export default {
  name: "Home",
  data() {
    return {
      lineDatacollection: {},
      polarCategoryDatacollection: {},
      polarTagDatacollection: {},
      polarOptions: {}
    };
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
    "line-chart": lineChart,
    "polar-area": polarArea
  },
  watch: {
    myTransactions() {
      this.displayCategoryPolarChart();
    },
    myTags() {
      this.fillSelect();
      this.displayLineChart();
      this.displayTagPolarChart();
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
        tagselector.options[tagselector.options.length] = new Option(
          tagelement,
          tagelement
        );
      });
    },
    displayTagPolarChart() {
      const backgroundColors = [
        "rgba(154, 230, 180, .85)",
        "rgba(250, 240, 137, .85)",
        "rgba(163, 191, 250, .85)",
        "rgba(251, 211, 141, .85)",
        "rgba(251, 182, 206, .85)",
        "rgba(214, 188, 250, .85)",
        "rgba(129, 230, 217, .85)",
        "rgba(254, 178, 178, .85)",
        "rgba(144, 205, 244, .85)"
      ];
      let amounts = [];
      let colors = [];

      for (let i = 0; i < this.myTags.length; i++) {
        amounts.push(0);
        colors.push(backgroundColors[i]);
      }

      if (amounts.length > 0 && this.myTags.length > 0) {
        this.myTransactions.forEach(transaction => {
          for (let i = 0; i < this.myTags.length; i++) {
            if (transaction.tags) {
              if (transaction.tags.includes(this.myTags[i])) {
                amounts[i] += parseInt(transaction.amount);
              }
            }
          }
        });
        this.polarTagDatacollection = {
          datasets: [
            {
              data: amounts,
              backgroundColor: colors
            }
          ],
          labels: this.myTags
        };
      }
    },
    displayLineChart() {
      this.lineDatacollection = {
        labels: ["januar", "februar", "marcius", "aprilis", "majus"],
        datasets: [
          {
            label: "Fuel",
            backgroundColor: "#6CB2EB",
            data: [106, 110, 114, 109, 116]
          }
        ]
      };
    },
    displayCategoryPolarChart() {
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
      this.polarCategoryDatacollection = {
        datasets: [
          {
            data: amounts,
            // borderAlign: "inner",
            backgroundColor: [
              "rgba(154, 230, 180, .85)",
              "rgba(250, 240, 137, .85)",
              "rgba(163, 191, 250, .85)",
              "rgba(251, 211, 141, .85)",
              "rgba(251, 182, 206, .85)",
              "rgba(214, 188, 250, .85)",
              "rgba(129, 230, 217, .85)",
              "rgba(254, 178, 178, .85)",
              "rgba(144, 205, 244, .85)"
            ]
          }
        ],
        labels: categories
      };
      // customize chart layout
      this.polarOptions = {
        legend: {
          // position: "right",
          labels: {
            fontSize: 14
          }
        }
      };
    }
  }
};
</script>
