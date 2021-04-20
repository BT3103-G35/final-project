<template>
  <div v-if="this.$route.path !== '/'" class="nav-container">
      <div class="wrapper">
          <!--
          <nav v-if="this.$route.path !== '/'">
          -->
          <nav v-if="loggedIn">
              <div class="logo">
                  <a><img src="https://i.ibb.co/NNpVDmp/Ainran-Logo-words.png" alt="Ainran-dp-background" border="0" width = "93.3px" height = "40px"></a>
              </div>
              <p><b>Logged in as {{ this.currentUser }}</b></p>
              <ul>
                <li><router-link to="/community" exact>Community</router-link></li>
                <li><router-link to="/marketplace" exact>Discover</router-link></li>
                <li><router-link to="/about" exact>About</router-link></li>
              </ul>
              <img id="chat-img" src="https://i.postimg.cc/kGbcQnmX/Chat-Icon.png" @click="goToChatList">
              <div class="profilepic">
                  <!--
                    <button class="dropbtn"><img :src='this.url' id="profile-img" @click="goToProfile"></button>
                    -->
                    <div class="dropdown">
                    <input type="image" :src='this.url' class="dropbtn">
                    <div class="dropdown-content">
                        <a><button id="signout" @click="goToProfile">Profile</button></a>
                        <a><button id="signout" @click="goToWishList">WishList</button></a>
                        <a><button id="signout" @click="goToDashBoard">DashBoard</button></a>
                        <a><button id="signout" @click="signOut">Sign out</button></a>
                    </div>
                    </div>
              </div>
          </nav>

          <nav v-else>
              <div class="logo">
                  <a><img src="https://i.ibb.co/NNpVDmp/Ainran-Logo-words.png" alt="Ainran-dp-background" border="0" width = "93.3" height = "40px"></a>
              </div>
                <ul>
                    <li><router-link to="/" exact>Home</router-link></li>
                    <li><router-link to="/about" exact>About</router-link></li>
                    <li><router-link to="/register" exact>Register</router-link></li>
                    <li><router-link to="/login" exact> Log In</router-link></li>
                </ul>
          </nav>
      </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
    name: "navi",
    mounted() {
        this.setupFirebase();
        this.fetchProfilePic();
    },
    data() {
        return {
            loggedIn: false,
            currentUser: false,
            url: false,
            id: false
        }
    },
    methods: {
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    this.loggedIn = true;
                    this.currentUser = firebase.auth().currentUser.email;
                    this.id = firebase.auth().currentUser.uid;
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                    this.id = false;

                }
            });
        },
        fetchProfilePic(){
            firebase.auth().onAuthStateChanged(user => {
                if (user){
                    firebase.storage().ref('users/' + user.uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                        this.url = imgUrl
                    })
                }
            })
        },
        signOut() {
            firebase
                .auth()
                .signOut()
                .then(() => {
                this.$router.replace({ name: "login" });
                });
        },
        goToProfile(){
            window.location.href="/Profile?user=" +this.id;
        },
        goToWishList(){
            window.location.href="/wishlist?user=" +this.id;
        },
        goToDashBoard(){
            window.location.href="/dashboard?user=" +this.id;
        },
        goToChatList(){
            window.location.href="/chatlist?user=" +this.id;
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li{
    color:white;
}
.nav-container{
    background-color: #376C12;
    height: 48px;
    color:white;
}
#profile-img{
    width: 33.3px;
    height: 33.3px;
    border-radius: 33.3%;
    cursor: pointer;
}
nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
}
nav ul{
    display: flex;
}
nav .logo{
    font-family: "Poppins", sans-serif;
    font-size: 13.3px;
    text-decoration: none;;
    font-style: normal;
    font-weight: 800;
    font-size: 42.7px;
    color: white;
    margin-left:130px;
}
nav li{
    float: right;
    list-style: none;
    margin-right: 30px;
}
nav li:nth-last-of-type(1){
    margin: 0;
}
nav li a{
    color:white;
    font-size: 13.3px;
    text-decoration: none;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
p{
    color: white;
    font-size: 13.3px;
    text-decoration: none;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
#signout{
    border: none;
    background: none;
    color: #021718;
    font-size: 13.3px;
    text-decoration: none;
    cursor: pointer;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.dropbtn {
  background-color: #649641;
  color: white;
  padding: 10.6px;
  font-size: 10.6px;
  border: none;
  margin-right: 50px;
}
.dropdown {
  position: relative;
  display: inline-block;
  margin-right: 100px;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 86.7px;
  box-shadow: 0px 5.3px 10.6px 0px rgba(0,0,0,0.2);
  z-index: 1;
  margin-right: 33.3px;
}
.dropdown-content a {
  color: white;
  padding: 8px 5.3px;
  text-decoration: none;
  display: block;
  height: 20px;
}
.dropdown-content a:hover {
    background-color: #37601B;
}
#signout:hover{
    color:white;
}
.dropdown:hover .dropdown-content {display: block;}

.dropdown:hover .dropbtn {background-color: #37601B;}

li:hover{
    background-color: #283D06;
}
input{
    width: 33.3px;
    height: 33.3px;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
    margin-right: 50px;
}
button{
    width: 66.6px;
}
#chat-img{
    width: 20px;
    height: 20px;
    cursor: pointer;
}
</style>