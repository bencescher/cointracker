<template>
  <section class="container">
    <div class="row">
      <div class="col2-1">
        <article class="container__chart card">
          <header class="container__chart--header">
            <h2>Balance | {{ currentAvailable | currency-format }} HUF</h2>
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
              :options="zeroChartOptions"
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
              :options="zeroChartOptions"
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
              :options="zeroChartOptions"
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
      currentAvailable: 0,
      currentDate: null,
      monthList: [],
      // select tag selected items
      selectedTag: "",
      selectedCategory: "",
      selectedCategoryMonth: "",
      selectedTagMonth: "",
      // data collections for charts
      barDatacollection: {},
      doughnutDatacollection: {},
      lineCategoryDatacollection: {},
      lineTagDatacollection: {},
      polarCategoryDatacollection: {},
      polarTagDatacollection: {},
      // custom options for charts
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontSize: 12
          }
        }
      },
      zeroChartOptions: {
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

  created() {
    this.currentDate = new Date();
    // read transactions and data from database
    this.$store.dispatch("initTransactions");
    this.$store.dispatch("initTags");
  },

  watch: {
    myTransactions() {
      this.$store.dispatch("initCategories");
      this.$store.dispatch("initTags");
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
      // reload chart on selection change
      this.initCategoryLineChart();
    },

    selectedTag() {
      // reload chart on selection change
      this.initTagLineChart();
    },

    selectedCategoryMonth() {
      // reload chart on selection change
      this.initCategoryPolarChart();
    },

    selectedTagMonth() {
      // reload chart on selection change
      this.initTagPolarChart();
    },

    currentDate() {
      // fill month list with last 6 months in reverse order on current date change
      for (let i = 0; i < 6; i++) {
        this.monthList.push(moment(this.currentDate).subtract(i, "months").format("MMMM"));
      }
      this.monthList.reverse();
    }
  },

  methods: {
    capitalize(word) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    },
    
    fillCategorySelect() {
      // add all categories to selection tag options
      const categorySelector = document.getElementById("categorySelection");

      // add each category element only once to selection by looping through categories
      this.myCategories.forEach(categoryElement => {
        let categoryAdded = false;

        categorySelector.options.forEach(existingOption => {
          if (existingOption.value === categoryElement) {
            categoryAdded = true
          }
        });

        if (!categoryAdded) {
          const formattedCategory = this.capitalize(categoryElement);

          categorySelector.options[categorySelector.options.length] = new Option(formattedCategory, formattedCategory);
        }
      });

      // select last category option by default
      const lastItem = this.myCategories.length - 1;

      if (this.myCategories[lastItem]) {
        this.selectedCategory = this.capitalize(this.myCategories[lastItem]);
      }
    },

    fillTagSelect() {
      // fill tag selector options with all the tags
      const tagselector = document.getElementById("tagselection");

      this.myTags.forEach(tagelement => {
        const formatOptionText = this.capitalize(tagelement);
        
        tagselector.options[tagselector.options.length] = new Option(
          formatOptionText,
          tagelement
        );
      });

      // select last tag option by default
      const lastItem = this.myTags.length - 1;

      this.selectedTag = this.myTags[lastItem];
    },

    fillMonthSelect() {
      // fill month selector options for category and tag polar charts
      const categoryMonthSelector = document.getElementById("categoryMonthSelection");
      const tagMonthSelector = document.getElementById("tagMonthSelection");

      this.monthList.forEach(month => {
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
      this.selectedCategoryMonth = this.monthList[5];
      this.selectedTagMonth = this.monthList[5];
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

    displayLineChartData(amounts, color, labels, label) {
      return {
        labels: labels,
        datasets: [
          {
            label: label,
            backgroundColor: color,
            data: amounts
          }
        ]
      };
    },

    initPolarCharts(myList, myType) {
      const amounts = [];
      const colors = [];
      const filteredAmounts = [];
      const filteredColors = [];
      const filteredMyList = [];

      // initialize amounts and colors depending on the number of tags
      for (let i = 0; i < myList.length; i++) {
        amounts.push(0);
        colors.push(backgroundColors[i]);
      }

      if (amounts.length > 0 && myList.length > 0) {
        this.myTransactions.forEach(transaction => {
          for (let i = 0; i < myList.length; i++) {
            if (myType === "tag") {
              if (
                transaction.tags 
                && transaction.type === "expense"
                && moment(transaction.timestamp).format("MMMM") === this.selectedTagMonth
              ) {
                if (transaction.tags.includes(myList[i])) {
                  amounts[i] += parseInt(transaction.amount);
                }
              }
            } else if (myType === "category") {
              if (
                transaction.category === myList[i].toLowerCase()
                && transaction.type === "expense"
                && moment(transaction.timestamp).format("MMMM") === this.selectedCategoryMonth
              ) {
                amounts[i] += parseInt(transaction.amount);
              }
            }
          }
        });

        for (let i = 0; i < amounts.length; i++) {
          if (amounts[i] > 0) {
            filteredAmounts.push(amounts[i]);
            filteredColors.push(colors[i]);
            filteredMyList.push(this.capitalize(myList[i]));
          }
        }
        // update chart with labels, data, colors
        const generateChartData = this.displayPolarChartData(filteredAmounts, filteredColors, filteredMyList);

        if (myType === "tag") {
          this.polarTagDatacollection = generateChartData;
        } else if (myType === "category") {
          this.polarCategoryDatacollection = generateChartData;
        }
      }
    },

    initLineCharts(myList, myType, mySelection) {
      const amountList = [];
      let color = "";

      if (mySelection && this.myTransactions) {
        for (let i = 0; i < 6; i++) {
          amountList.push(0);
        }

        let generateList = transaction => {
          for (let i = 0; i < this.monthList.length; i++) {
            if (transaction.timestamp) {
              if (moment(transaction.timestamp).format("MMMM") === this.monthList[i]) {
                amountList[i] += parseInt(transaction.amount);
              }
            }
          }
        };

        this.myTransactions.forEach(transaction => {
          if (myType === "tag") {
            if (transaction.tags.includes(mySelection)) {
              generateList(transaction);
            }
          } else if (myType === "category") {
            if (transaction.category.toLowerCase() === mySelection.toLowerCase()) {
              generateList(transaction);
            }
          }
        });
        // determine the chart background color depending on the selected category
        for (let i = 0; i < myList.length; i++) {
          if (myList[i].toLowerCase() === mySelection.toLowerCase()) {
            color = backgroundColors[i];
          }
        }
        // update chart with labels, data, colors
        const generateChartData = this.displayLineChartData(amountList, color, this.monthList, mySelection);

        if (myType === "tag") {
          this.lineTagDatacollection = generateChartData;
        } else if (myType === "category") {
          this.lineCategoryDatacollection = generateChartData;
        }
      }
    },

    initDoughnutChart() {
      let totalIncome = 0;
      let totalExpense = 0;
      let balanceToUse = 0;

      this.myTransactions.forEach(transaction => {
        if (moment(transaction.timestamp).format("MMMM") === moment(this.currentDate).format("MMMM")) {
          if (transaction.type === "income") {
            totalIncome += transaction.amount;
          } else {
            totalExpense += transaction.amount;
          }
        }
      });

      if (totalIncome > totalExpense) {
        balanceToUse = totalIncome - totalExpense;
      } else {
        balanceToUse = 0;
      }

      this.doughnutDatacollection = {
        datasets: [{
          backgroundColor: [
            backgroundColors[2],
            backgroundColors[14]
          ],
          data: [
            balanceToUse,
            totalExpense
          ]
        }],
        labels: [
          "Available Income",
          "Expenses"
        ]
      }

      this.currentAvailable = totalIncome - totalExpense;
    },

    initBarChart() {
      const incomes = [];
      const expenses = [];
      const balances = [];

      // initialize the required arrays for bar chart with zeros
      for (let i = 0; i < 6; i++) {
        incomes.push(0);
        expenses.push(0);
      }

      this.myTransactions.forEach(transaction => {
        for (let i = 0; i < this.monthList.length; i++) {
          if (transaction.timestamp) {
            if (moment(transaction.timestamp).format("MMMM") === this.monthList[i]) {
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
        labels: this.monthList,
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

    initCategoryPolarChart() {
      this.initPolarCharts(this.myCategories, "category");
    },

    initTagPolarChart() {
      this.initPolarCharts(this.myTags, "tag");
    },

    initCategoryLineChart() {
      this.initLineCharts(this.myCategories, "category", this.selectedCategory);
    },
    
    initTagLineChart() {
      this.initLineCharts(this.myTags, "tag", this.selectedTag);
    }
  }
};
</script>
