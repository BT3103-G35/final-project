<template>
  <div class="chart">
    <h1>Bar Chart</h1>
    <chart></chart>
  </div>
</template>

<script>
import Chart from "./BarChart.js";
export default {
  components: {
    Chart
  }
};
</script>

<style scoped>
h1{
    background-color: cadetblue;
    line-height: 100px;
    text-align: center;
    vertical-align: middle;
    
  }
</style>