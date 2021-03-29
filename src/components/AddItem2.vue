<template>
    <div class="additems-container">
        <div class="search-bar">
            <h1>Search Bar</h1>
        </div>
        <div class="upload-image">
            <upload></upload>
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";
import upload from "./Upload.vue"
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
        upload
    }
}
</script>

<style scoped>
h1{
    text-decoration: underline #EC6041;
    font-size: 70px;
}
.additems-container{
    display:flex;
    align-items: center;
    justify-content: space-between;
}
.upload-image{
    margin-right: 150px;
    margin-top: 50px;
}
.search-bar{
    margin-left: 150px;
}
</style>