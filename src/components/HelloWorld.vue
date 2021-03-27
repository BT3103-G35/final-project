<template>
  <div class="bg">
    <h1>Wardrobe Organiser</h1>
    <ul>
      <li><router-link to="/login" tag="button1" exact> Log In</router-link></li>
      <li><router-link to="/register" tag="button2" exact>Register</router-link></li>
    </ul>
    
  </div>
</template>

<script>

export default {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bg{
  background-image: url("https://i.postimg.cc/vZbhY4ZB/clothes-1.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 97vh;
  text-align: center;
  vertical-align: middle;

}
h1{
  color: white;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  display: inline-block;
  vertical-align: middle;
  margin-top: 35vh;
  font-size: 86px;
}
li{
    list-style: none;
    margin-right: 50px;

}
ul{
    display: flex;
    margin-left: 38%;
}
li a{
    color: #021718;
    font-size: 40px;
    text-decoration: none;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
button1{
  font-size: 30px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #EC6041;
  box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
  background: #FFFFFF;
  border: 2px solid #EC6041;
  box-sizing: border-box;
  padding: 20px 24px;
}
button2{
  font-size: 30px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: #EC6041;
/* Button / Primary */

  box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
  padding: 20px 24px;
}
</style>
