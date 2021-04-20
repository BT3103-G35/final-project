<template>
  <div class="bg">
    <h1>Ainran</h1>
    <ul v-if="this.loggedIn">
      <li><router-link to="/profile" tag="buttonin1" exact><b>Profile</b></router-link></li>
      <li><router-link to="/marketplace" tag="buttonin2" exact><b>Marketplace</b></router-link></li>
    </ul>
    <ul v-else>
      <li><router-link to="/login" tag="buttonout1" exact><b>Log In</b></router-link></li>
      <li><router-link to="/register" tag="buttonout2" exact><b>Register</b></router-link></li>
    </ul> 
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
    created() {
        this.setupFirebase();
    },
    methods:{
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    this.loggedIn = true;
                    this.currentUser = firebase.auth().currentUser;
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
        }
    }
}
</script>

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
  font-size: 75px;
}
li{
  list-style: none;
  margin-right: 30px;
}
ul{
  display: flex;
  margin-left: 32%;
}
li a{
  color: #021718;
  font-size: 40px;
  text-decoration: none;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
buttonin1{
  font-size: 28px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #376C12;
  box-shadow: 4px 4px 0px #507B2E, 8px 8px 0px #6B8B51;
  background: #FFFFFF;
  border: 2px solid #376C12;
  box-sizing: border-box;
  padding: 15px 18px;
  cursor: pointer;
  margin-left: 22px;
}
buttonin2{
  font-size: 28px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: black;
  box-shadow: 4px 4px 0px #3F3F3E, 8px 8px 0px #61615F;
  padding: 15px 18px;
  cursor: pointer;
}
buttonout1{
  font-size: 30px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #376C12;
  box-shadow: 4px 4px 0px #507B2E, 8px 8px 0px #6B8B51;
  background: #FFFFFF;
  border: 2px solid #376C12;
  box-sizing: border-box;
  padding: 15px 18px;
  cursor: pointer;
  margin-left: 38px;
}
buttonout2{
  font-size: 30px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: black;
  box-shadow: 4px 4px 0px #3F3F3E, 8px 8px 0px #61615F;
  padding: 15px 18px;
  cursor: pointer;
}
</style>
