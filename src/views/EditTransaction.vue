<template>
  <section class="container">
    <article class="formbox card">
      <header class="formbox--header">
        <h2>Edit transaction</h2>
      </header>
      <section class="formbox--content">
        <form @submit.prevent="updateTransaction()" class="form">
          <div class="form__group">
            <input
              v-model="editTransaction.type"
              id="type"
              class="form__input"
              type="text"
              placeholder="Transaction type"
              required
            />
            <label for="type" class="form__label">Transaction type</label>
          </div>
          <div class="form__group">
            <input
              v-model="editTransaction.category"
              id="category"
              class="form__input"
              type="text"
              placeholder="Transaction category"
              required
            />
            <label for="category" class="form__label">Transaction category</label>
          </div>
          <div class="form__group">
            <div v-for="(tag, index) in editTransaction.tags" :key="index">
              <label for="addedTag"></label>
              <input
                v-model="editTransaction.tags[index]"
                class="form__taginput"
                placeholder="Cannot be empty"
                type="text"
                name="addedTag"
              />
            </div>
          </div>
          <div class="form__group">
            <input
              @keydown.tab.prevent="addTag"
              v-model="tag"
              id="tags"
              class="form__input"
              type="text"
              placeholder="Push TAB to add tag"
            />
            <label for="tags" class="form__label">Push TAB to add tag</label>
          </div>
          <div class="form__group">
            <input
              v-model="editTransaction.amount"
              id="amount"
              class="form__input"
              type="number"
              placeholder="Transaction amount"
              required
            />
            <label for="amount" class="form__label">Transaction amount</label>
          </div>
          <div class="form__group">
            <input
              v-model="transactionDate"
              id="timestamp"
              class="form__input"
              type="date"
              required
            />
          </div>
          <div class="form__group">
            <button class="btn btn--green" type="submit">Save</button>
          </div>
        </form>
      </section>
    </article>
  </section>
</template>

<script>
export default {
  data() {
    return {
      transactionDate: "",
      editTransaction: {
        type: "",
        category: "",
        tags: [],
        amount: "",
        timestamp: 0
      },
      tag: null
    };
  },

  watch: {
    myTransactions() {
      this.myTransactions.forEach(transaction => {
        if (transaction.id === this.$route.params.transactionId) {
          this.editTransaction.type = transaction.type;
          this.editTransaction.category = transaction.category;
          this.editTransaction.tags = transaction.tags;
          this.editTransaction.amount = transaction.amount;
          this.editTransaction.timestamp = transaction.timestamp;
        }
      });
      this.transactionDate = new Date(this.editTransaction.timestamp).toISOString().substr(0, 10);
    }
  },

  created() {
    this.$store.dispatch("initTransactions");
  },

  computed: {
    myTransactions() {
      return this.$store.getters.myTransactions;
    },

    myTags() {
      return this.$store.getters.myTags;
    }
  },

  methods: {
    addTag() {
      if (this.tag) {
        this.editTransaction.tags.push(this.tag.toLowerCase());
        this.tag = null;
      }
    },

    updateTransaction() {
      this.editTransaction.amount = parseInt(this.editTransaction.amount);
      this.editTransaction.timestamp = new Date(this.transactionDate).getTime();
      // dispatch update transaction action
      const updateParams = {
        editTransaction: this.editTransaction,
        transactionId: this.$route.params.transactionId
      }

      this.$store.dispatch("updateTransaction", updateParams)
        .then(() => {
          // reroute to history view
          this.$router.push({ name: "Transactions"});
        });
    }
  }
};
</script>
