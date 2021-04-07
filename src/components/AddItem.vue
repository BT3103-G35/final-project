<template>
    <div class="additems-container">
        <div class="add-need-ideas">
            <br><br>
            <h1>Add</h1>
            <h2 style="font-size:20px">What clothes would you like <br> to add to your wardrobe?</h2>
            <br><br>
            <h1>Need ideas?</h1>
            <h2 style="font-size:20px">See what others in the community are wearing</h2>
            <br><br>
            <router-link to="/community" tag="button-community" exact>Community</router-link>
        </div>
        <div class="additems-images">
            <slider></slider>
        </div>

    </div>
</template>

<script>
import firebase from "firebase/app";
import slider from "./Slider.vue"
export default {
    mounted() {
        this.setupFirebase();
    },
    methods:{
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    this.loggedIn = true;
                    this.currentUser = firebase.auth().currentUser.email;
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
    },
    components:{
        slider
    }
}
</script>

<style scoped>
h1{
    text-decoration: underline #EC6041;
    font-size: 70px;
}
.additems-container{
    display: flex;
}
.add-need-ideas{
    width: 60%;
}
.additems-images{
    margin-right: 100px;
    margin-top: 80px;
}
button-community{
  font-size: 18px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: #EC6041;
  box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
  padding: 20px 24px;
  cursor: pointer;
}

</style>