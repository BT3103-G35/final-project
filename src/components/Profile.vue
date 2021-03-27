<template>
    <div>
        <h1>Profile page</h1>
        <p>Logged in as {{ this.email }}</p>
    </div>
</template>

<script>
export default {
  data(){
    return{
        email: this.$route.params.email,
    }
  },
  methods:{
  }
}
</script>

<style scoped>

</style>