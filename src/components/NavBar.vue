<template>
  <div v-if="this.$route.path !== '/'" class="nav-container">
      <div class="wrapper">
          <!--
          <nav v-if="this.$route.path !== '/'">
          -->
          <nav v-if="loggedIn">
              <div class="logo">
                  <a><img src="https://i.ibb.co/mDyY1hb/Ainran-dp-background.jpg" alt="Ainran-dp-background" border="0" width = "116px" height = "61px"></a>
              </div>
              <p>Logged in as {{ this.currentUser }}</p>
              <ul>
                <li><router-link to="/community" exact>Community</router-link></li>
                <li><router-link to="/marketplace" exact>Marketplace</router-link></li>
                <li><router-link to="/about" exact>About</router-link></li>
                
              </ul>
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
                  Ainran
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
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-container{
    background-color: #ffe5cc;
    height: 72px;
}
#profile-img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
}
.wrapper{
    max-width: 1400px;
    margin: 0 auto
}
nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
}
nav ul{
    display: flex;
}
nav .logo{
    font-family: "Poppins", sans-serif;
    font-size: 20px;
    text-decoration: none;;
    font-style: normal;
    font-weight: 800;
    font-size: 64px;
    color: #021718
}
nav li{
    list-style: none;
    margin-right: 50px;

}
nav li:nth-last-of-type(1){
    margin: 0;
}

nav li a{
    color: #021718;
    font-size: 20px;
    text-decoration: none;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
p{
    color: #021718;
    font-size: 20px;
    text-decoration: none;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
#signout{
    border: none;
    background: none;
    color: #021718;
    font-size: 20px;
    text-decoration: none;
    cursor: pointer;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

}

.dropbtn {
  background-color: #ffe5cc;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 130px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  margin-right: 50px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  height: 30px;
}
.dropdown-content a:hover {background-color: #ffe5cc;}

.dropdown:hover .dropdown-content {display: block;}

.dropdown:hover .dropbtn {background-color: #EC6041;}

input{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
}
button{
    width: 100px;
}

</style>