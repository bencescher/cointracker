<template>
  <section class="container">
    <article class="formbox card">
      <header class="formbox--header">
        <h2>Add new transaction</h2>
      </header>
      <section class="formbox--content">
        <form @submit.prevent="saveTransaction()" class="form">
          <div class="form__group">
            <input
              v-model="newTransaction.type"
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
              v-model="newTransaction.category"
              id="category"
              class="form__input"
              type="text"
              placeholder="Transaction category"
              required
            />
            <label for="category" class="form__label">Transaction category</label>
          </div>
          <div class="form__group">
            <div v-for="(tag, index) in newTransaction.tags" :key="index">
              <label for="addedTag"></label>
              <input
                v-model="newTransaction.tags[index]"
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
              v-model="newTransaction.amount"
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
      newTransaction: {
        type: "",
        category: "",
        tags: [],
        amount: "",
        timestamp: 0
      },
      tag: null
    };
  },

  mounted() {
    const currentDate = new Date().toISOString().substr(0, 10);

    document.getElementById("timestamp").value = currentDate;
  },

  computed: {
    myTags() {
      return this.$store.getters.myTags;
    }
  },

  methods: {
    addTag() {
      if (this.tag) {
        this.newTransaction.tags.push(this.tag.toLowerCase());
        this.tag = null;
      }
    },

    saveTransaction() {
      this.newTransaction.amount = parseInt(this.newTransaction.amount);
      this.newTransaction.timestamp = new Date(this.transactionDate).getTime();
      // dispatch new transaction action
      this.$store.dispatch("createTransactions", this.newTransaction)
        .then(() => {
          this.$store.dispatch("initTransactions");
          this.newTransaction.tags.forEach(newTag => {
            if (!this.myTags.includes(newTag.toLowerCase())) {
              this.$store.dispatch("createTag", newTag);
            }
          });
          this.newTransaction = {
            type: "",
            category: "",
            tags: [],
            amount: "",
            timestamp: 0
          };
        });
    }
  }
};
</script>
