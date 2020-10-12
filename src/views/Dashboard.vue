<template>
  <section class="container">
    <div class="row">
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>Current Balance</h2>
          </header>
          <section class="container__chart--content">
            <doughnut-chart
              :chart-data="doughnutDatacollection"
              :options="chartOptions"
            ></doughnut-chart>
          </section>
        </article>
      </div>
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>Incomes vs Expenses</h2>
          </header>
          <section class="container__chart--content">
            <bar-chart
              :chart-data="barDatacollection"
              :options="barChartOptions"
            ></bar-chart>
          </section>
        </article>
      </div>
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>Expenses by category</h2>
          </header>
          <section class="container__chart--content">
            <select
              class="form__select"
              v-model="selectedCategoryMonth"
              name="categoryMonthSelection"
              id="categoryMonthSelection"
            ></select>
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
            <select
              class="form__select"
              v-model="selectedTagMonth"
              name="tagMonthSelection"
              id="tagMonthSelection"
            ></select>
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
            <select
              class="form__select"
              v-model="selectedCategory"
              name="categorySelection"
              id="categorySelection"
            ></select>
            <line-chart
              :chart-data="lineCategoryDatacollection"
              :options="chartOptions"
            ></line-chart>
          </section>
        </article>
      </div>
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>History by tags</h2>
          </header>
          <section class="container__chart--content">
            <select
              class="form__select"
              v-model="selectedTag"
              name="tagselection"
              id="tagselection"
            ></select>
            <line-chart
              :chart-data="lineTagDatacollection"
              :options="chartOptions"
            ></line-chart>
          </section>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import barChart from "../components/Bar.js";
import doughnutChart from "../components/Doughnut.js";
import lineChart from "../components/Line.js";
import polarArea from "../components/PolarArea.js";
import backgroundColors from "../store/colors.js";

export default {
  name: "Home",
  data() {
    return {
      selectedTag: "",
      selectedCategory: "",
      selectedCategoryMonth: "",
      selectedTagMonth: "",
      barDatacollection: {},
      doughnutDatacollection: {},
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
      },
      barChartOptions: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
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
    "bar-chart": barChart,
    "doughnut-chart": doughnutChart,
    "line-chart": lineChart,
    "polar-area": polarArea
  },

  watch: {
    myTransactions() {
      this.$store.dispatch("initCategories");
      this.initCategoryPolarChart();
      this.fillCategorySelect();
      this.fillMonthSelect();
      this.initBarChart();
      this.initDoughnutChart();
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
    },

    selectedCategoryMonth() {
      this.initCategoryPolarChart();
    },

    selectedTagMonth() {
      this.initTagPolarChart();
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
        let categoryAdded = false;
        categorySelector.options.forEach(existingOption => {
          if (existingOption.value === categoryElement) {
            categoryAdded = true
          }
        });

        if (!categoryAdded) {
          const formattedCategory = categoryElement.charAt(0).toUpperCase() + categoryElement.substring(1);
          categorySelector.options[categorySelector.options.length] = new Option(formattedCategory, formattedCategory);
        }
      });

      const lastItem = this.myCategories.length - 1;
      this.selectedCategory = this.myCategories[lastItem].charAt(0).toUpperCase() + this.myCategories[lastItem].substring(1);
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

      const lastItem = this.myTags.length - 1;
      this.selectedTag = this.myTags[lastItem];
    },

    fillMonthSelect() {
      // fill month selector options for category and tag polar charts
      const categoryMonthSelector = document.getElementById("categoryMonthSelection");
      const tagMonthSelector = document.getElementById("tagMonthSelection");
      const currentDate = new Date();
      const monthList = [];

      for (let i = 0; i < 6; i++) {
        monthList.push(moment(currentDate).subtract(i, "months").format("MMMM"));
      }
      monthList.reverse();

      monthList.forEach(month => {
        let monthAdded = false;
        
        categoryMonthSelector.options.forEach(existingOption => {
          if (existingOption.value === month) {
            monthAdded = true
          }
        });
        if (!monthAdded) {
          categoryMonthSelector.options[categoryMonthSelector.options.length] = new Option(
            month,
            month
          );
        }

        monthAdded = false;

        tagMonthSelector.options.forEach(existingOption => {
          if (existingOption.value === month) {
            monthAdded = true
          }
        });
        if (!monthAdded) {
          tagMonthSelector.options[tagMonthSelector.options.length] = new Option(
            month,
            month
          );
        }
      })
      this.selectedCategoryMonth = monthList[5];
      this.selectedTagMonth = monthList[5];
    },

    initDoughnutChart() {
      const currentDate = new Date();
      let totalIncome = 0;
      let totalExpense = 0;

      this.myTransactions.forEach(transaction => {
        if (moment(transaction.timestamp).format("MMMM") === moment(currentDate).format("MMMM")) {
          if (transaction.type === "income") {
            totalIncome += transaction.amount;
          } else {
            totalExpense += transaction.amount;
          }
        }
      });

      this.doughnutDatacollection = {
        datasets: [{
          backgroundColor: [
            backgroundColors[2],
            backgroundColors[14]
          ],
          data: [
            totalIncome - totalExpense,
            totalExpense
          ]
        }],
        labels: [
          "Available Income",
          "Expenses"
        ]
      }
    },

    initBarChart() {
      const incomes = [];
      const expenses = [];
      const balances = [];
      const monthList = [];
      const currentDate = new Date();

      for (let i = 0; i < 6; i++) {
        incomes.push(0);
        expenses.push(0);
        monthList.push(moment(currentDate).subtract(i, "months").format("MMMM"));
      }
      monthList.reverse();

      this.myTransactions.forEach(transaction => {
        for (let i = 0; i < monthList.length; i++) {
          if (transaction.timestamp) {
            if (moment(transaction.timestamp).format("MMMM") === monthList[i]) {
              if (transaction.type === "expense") {
                expenses[i] += transaction.amount;
              } else {
                incomes[i] += transaction.amount;
              }
            }
          }
        }
      });
      for (let i = 0; i < incomes.length; i++) {
        balances.push(incomes[i] - expenses[i])
      }
      // update chart with labels, data, colors
      this.barDatacollection = {
        labels: monthList,
        datasets: [
          {
            backgroundColor: backgroundColors[6],
            data: incomes,
            label: ["Incomes"],
            order: 2
          },
          {
            backgroundColor: backgroundColors[4],
            data: expenses,
            label: ["Expenses"],
            order: 3
          },
          {
            backgroundColor: backgroundColors[8],
            borderColor: backgroundColors[12],
            borderWidth: 2,
            data: balances,
            label: ["Balance"],
            type: "line",
            fill: false,
            order: 1
          }
        ]
      };
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
            if (
              transaction.tags 
              && transaction.type === "expense"
              && moment(transaction.timestamp).format("MMMM") === this.selectedTagMonth
            ) {
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
          if (
            transaction.category === this.myCategories[i].toLowerCase()
            && transaction.type === "expense"
            && moment(transaction.timestamp).format("MMMM") === this.selectedCategoryMonth
          ) {
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
        for (let i = 0; i < 6; i++) {
          amountList.push(0);
          monthList.push(moment(currentDate).subtract(i, "months").format("MMMM"));
        }
        monthList.reverse();

        this.myTransactions.forEach(transaction => {
          if (transaction.category.toLowerCase() === this.selectedCategory.toLowerCase()) {
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
          if (this.myCategories[i].toLowerCase() === this.selectedCategory.toLowerCase()) {
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
        // get names of current and previous 5 months as chart labels
        for (let i = 0; i < 6; i++) {
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
          if (this.myTags[i].toLowerCase() === this.selectedTag.toLowerCase()) {
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
