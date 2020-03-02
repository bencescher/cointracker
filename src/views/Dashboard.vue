<template>
  <section class="container">
    <div class="row">
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>Expenses by category</h2>
          </header>
          <section class="container__chart--content">
            <polar-area
              id="polarCategory"
              class="chart-polar"
              :chart-data="polarCategoryDatacollection"
              :options="chartOptions"
            ></polar-area>
          </section>
        </article>
      </div>
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>Expenses by tags</h2>
          </header>
          <section class="container__chart--content">
            <polar-area
              id="polarTag"
              class="chart-polar"
              :chart-data="polarTagDatacollection"
              :options="chartOptions"
            ></polar-area>
          </section>
        </article>
      </div>
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>History by categories</h2>
          </header>
          <section class="container__chart--content">
            <select class="form__select" v-model="selectedCategory" name="categorySelection" id="categorySelection"></select>
            <line-chart :chart-data="lineCategoryDatacollection" :options="chartOptions"></line-chart>
          </section>
        </article>
      </div>
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>History by tags</h2>
          </header>
          <section class="container__chart--content">
            <select class="form__select" v-model="selectedTag" name="tagselection" id="tagselection"></select>
            <line-chart :chart-data="lineTagDatacollection" :options="chartOptions"></line-chart>
          </section>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import lineChart from "../components/Line.js";
import polarArea from "../components/PolarArea.js";
import backgroundColors from "../store/colors.js";

export default {
  name: "Home",
  data() {
    return {
      selectedTag: "",
      selectedCategory: "",
      lineCategoryDatacollection: {},
      lineTagDatacollection: {},
      polarCategoryDatacollection: {},
      polarTagDatacollection: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontSize: 12
          }
        }
      }
    };
  },
  computed: {
    myTransactions() {
      return this.$store.getters.myTransactions;
    },
    myCategories() {
      return this.$store.getters.categories;
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
      this.initCategoryPolarChart();
      this.fillCategorySelect();
    },
    myTags() {
      this.fillTagSelect();
      this.initTagPolarChart();
    },
    selectedCategory() {
      this.initCategoryLineChart();
    },
    selectedTag() {
      this.initTagLineChart();
    }
  },
  created() {
    this.$store.dispatch("initTransactions");
    this.$store.dispatch("initTags");
  },
  methods: {
    fillCategorySelect() {
      const categorySelector = document.getElementById("categorySelection");

      this.myCategories.forEach(categoryElement => {
        let tagAdded = false;
        categorySelector.options.forEach(existingOption => {
          if (existingOption.value === categoryElement) {
            tagAdded = true
          }
        });

        if (!tagAdded) {
          
          categorySelector.options[categorySelector.options.length] = new Option(categoryElement, categoryElement);
        }
      });
    },
    fillTagSelect() {
      // fill tag selector options with all the tags
      const tagselector = document.getElementById("tagselection");

      this.myTags.forEach(tagelement => {
        const formatOptionText = tagelement.charAt(0).toUpperCase() + tagelement.substring(1);
        
        tagselector.options[tagselector.options.length] = new Option(
          formatOptionText,
          tagelement
        );
      });
    },
    displayPolarChartData(amounts, colors, labels) {
      // update polar charts with amounts, colors, labels
      return {
          datasets: [
            {
              data: amounts,
              backgroundColor: colors
            }
          ],
          labels: labels
        };
    },
    initTagPolarChart() {
      const amounts = [];
      const colors = [];

      // initialize amounts and colors depending on the number of tags
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
        // update chart data
        this.polarTagDatacollection = this.displayPolarChartData(amounts, colors, this.myTags);
      }
    },
    initCategoryPolarChart() {
      const amounts = [];
      const colors = [];
      
      // initialize amounts and colors depending on the number of categories
      for (let i = 0; i < this.myCategories.length; i++) {
        amounts.push(0);
        colors.push(backgroundColors[i]);
      }

      this.myTransactions.forEach(transaction => {
        for (let i = 0; i < this.myCategories.length; i++) {
          if (transaction.category === this.myCategories[i].toLowerCase()) {
            amounts[i] += parseInt(transaction.amount);
          }
        }
      });
      // update chart data
      this.polarCategoryDatacollection = this.displayPolarChartData(amounts, colors, this.myCategories);
    },
    initCategoryLineChart() {
      const currentDate = new Date();
      const monthList = [];
      const amountList = [];
      let color = "";

      if (this.selectedCategory && this.myTransactions) {
        for (let i = 0; i < 5; i++) {
          amountList.push(0);
          monthList.push(moment(currentDate).subtract(i, "months").format("MMMM"));
        }
        monthList.reverse();

        this.myTransactions.forEach(transaction => {
          if (transaction.category === this.selectedCategory.toLowerCase()) {
            for (let i = 0; i < monthList.length; i++) {
              if (transaction.timestamp) {
                if (moment(transaction.timestamp).format("MMMM") === monthList[i]) {
                  amountList[i] += parseInt(transaction.amount);
                }
              }
            }
          }
        });
        // determine the chart background color depending on the selected category
        for (let i = 0; i < this.myCategories.length; i++) {
          if (this.myCategories[i] === this.selectedCategory) {
            color = backgroundColors[i];
          }
        }

        // update chart with labels, data, colors
        this.lineCategoryDatacollection = {
          labels: monthList,
          datasets: [
            {
              label: this.selectedCategory,
              backgroundColor: color,
              data: amountList
            }
          ]
        };
      }
    },
    initTagLineChart() {
      const currentDate = new Date();
      const monthList = [];
      const amountList = [];
      let color = "";

      if (this.selectedTag && this.myTransactions) {
        // get names of current and previous 4 months as chart labels
        for (let i = 0; i < 5; i++) {
          amountList.push(0);
          monthList.push(moment(currentDate).subtract(i, "months").format("MMMM"));
        }
        monthList.reverse();

        this.myTransactions.forEach(transaction => {
          if (transaction.tags) {
            if (transaction.tags.includes(this.selectedTag)) {
              for (let i = 0; i < monthList.length; i++) {
                if (transaction.timestamp) {
                  if (moment(transaction.timestamp).format("MMMM") === monthList[i]) {
                    amountList[i] += parseInt(transaction.amount);
                  }
                }
                
              }
            }
          }
        });

        // determine the chart background color depending on the selected tag
        for (let i = 0; i < this.myTags.length; i++) {
          if (this.myTags[i] === this.selectedTag) {
            color = backgroundColors[i];
          }
        }

        // update chart with labels, data, colors
        this.lineTagDatacollection = {
          labels: monthList,
          datasets: [
            {
              label: this.selectedTag,
              backgroundColor: color,
              data: amountList
            }
          ]
        };
      }
    }
  }
};
</script>
