<template>
  <div class="chart">
    <h1>Bar Chart</h1>
    <br><br>
    <ProfileChart></ProfileChart>
    <br><br><br><br><br>
    <MarketplaceChart></MarketplaceChart>
  </div>
</template>

<script>
import ProfileChart from "./BarChartProfile.js";
import MarketplaceChart from "./BarChartMarketplace.js";
export default {
  components: {
    ProfileChart,
    MarketplaceChart
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