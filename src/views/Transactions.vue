<template>
  <section class="container">
    <div class="history">
      <header class="history__header">
        <h2>Transaction list view</h2>
      </header>
      <section class="history__content">
        <article
          v-for="(transaction, index) in myTransactions"
          :key="index"
          :class="{
            transaction__income: transaction.type === 'income',
            transaction__expense: transaction.type === 'expense'
          }"
          class="transaction row"
        >
          <header class="col2-1 transaction__header">
            <p>
              <span class="amount">
                <span v-if="transaction.type === 'income'">+</span>
                <span v-else>-</span>
                {{ transaction.amount | currency-format }} Ft
              </span>
              {{ transaction.category }}
            </p>
          </header>
          <section class="col2-1 transaction__content">
            <section class="transaction__content--tags">
              <p
                v-for="(myTag, index) in transaction.tags"
                :key="index"
                class="tag"
              >{{ myTag }}</p>
            </section>
            <section class="transaction__content--actions">
              <i class="fas fa-edit"></i>
              <i
                @click="deleteTransaction(transaction.id)"
                class="far fa-trash-alt"
              ></i>
            </section>
            <section class="transaction__content--date">
              <p>{{ transaction.timestamp }}</p>
            </section>
          </section>
        </article>
      </section>
    </div>
  </section>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {

    }
  },

  computed: {
    myTransactions() {
      const transactionData = this.$store.getters.myTransactions;

      // order transactions by date
      transactionData.sort(function(a, b) {
        return b.timestamp - a.timestamp;
      })
      // format category and date for each transaction
      transactionData.forEach(transaction => {
        transaction.category = transaction.category.charAt(0).toUpperCase() + transaction.category.substring(1);
        transaction.timestamp = moment(transaction.timestamp).format("DD MMMM yyyy");
      });

      return transactionData;
    }
  },

  created() {
    this.$store.dispatch("initTransactions");
  },

  methods: {
    deleteTransaction(id) {
      let confirmed = confirm("Deletion of transactions is permanent. Are you sure that you want to delete this transaction?");

      if (confirmed) {
        this.$store.dispatch("deleteTransaction", id);
      }
    }
  }
};
</script>
