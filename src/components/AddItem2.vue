<template>
    <div class="additems-container">
        <div class="what-kind">
            <br><br><br>
            <h1> i think instead of a search bar we should just ask them what kind of ____ is it bc search bar with enough options will be q hard.. </h1>
        </div>
        <div class="upload-image">
            <upload></upload>
            <form @submit.prevent="pressed">
                <label for="name">Name*:</label><br>
                <input type="text" id="name" name="name" size="60" v-model="name" required><br><br>
                <label for="detail">Details*:</label><br>
                <textarea name="detail" rows="3" cols="60" v-model="detail" required></textarea><br><br>
                <label for="notes">Notes*:</label><br>
                <textarea name="notes" rows="6" cols="60" v-model="notes" required></textarea><br><br>
                <button type="submit">Add</button>
            </form>

    
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
            currentUser: false,
            name: '',
            detail: '',
            notes: ''
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
    font-size: 30px;
}
.additems-container{
    display:flex;
    justify-content: space-between;
}
.upload-image{
    margin-right: 150px;
    margin-top: 50px;
}

.search-bar{
    margin-left: 250px;
}
button{
    background: #EC6041;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
    color: white;
    width: 450px;
}
</style>