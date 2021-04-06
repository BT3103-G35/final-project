<template>
    <div>
    <!-- Nav bar code -->
    <b-navbar toggleable="lg" type="light">
        <!-- AINRAN Logo if we have it -->
        <b-navbar-brand href="#">NavBar</b-navbar-brand>

        <!-- Nav bar links to 4 main pages (Aligned left) -->
        <b-navbar-nav>
            <b-nav-item href="/Home">Home</b-nav-item>
            <b-nav-item href="/Community">Community</b-nav-item>
            <b-nav-item href="/Marketplace">Marketplace</b-nav-item>
            <b-nav-item href="/AboutUs">About us</b-nav-item>
        </b-navbar-nav>

        <!-- Nav bar links to profile (Aligned right) -->
        <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
            <template #button-content>
                <!-- Will be changed to photo -->
                <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
    </b-navbar>

    <div class="item-container">
        <div class="item-info">
            <p> Name* </p>
            <div class="boxed">
                {{item.name}}
            </div>
            <p> Details* </p>
            <div class="boxed">
                {{item.details}}
            </div>
            <p> Notes* </p>
            <div class="boxed">
                {{item.notes}}
            </div>
            <div class="add-item">
                <router-link to="/addtowishlist" tag="button-addtowithlist" exact>ADD TO WISHLIST</router-link>
                <router-link to="/share" tag="button-share" exact></router-link>
            </div>
        </div>

        <div class="item-pictures">
            <b-img :src="item.imgURL"></b-img>
        </div>
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
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false
        }
    }
}
</script>

<style scoped>
.boxed {
  border: 1px solid orange ;
}
.profile-info{
    width: 40%;
    margin-left: 100px;
}
.add-item{
    width: 60%;
}
h1{
    font-size: 70px;
}
button{
    height: 40px;
    width: 200px;
    font-size: 20px;
    background-color: #EC6041;
    color: white;
    background: #EC6041;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
}
button-additem{
  font-size: 30px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: #EC6041;
  box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
  padding: 20px 24px;
  cursor: pointer;
}
#displayName{
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-weight: bold;
    font-size: 20px;
}
.item-container{
    width:600px;
    overflow:hidden;
}
.item-info{
    width: 300px;
    float:left; /* add this */
}
.item-pictures{
    width: 300px;
    float:left; /* add this */
}
</style>