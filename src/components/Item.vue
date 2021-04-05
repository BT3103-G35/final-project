<template>
    <div class="item-container">
        {{ this.id }}
    </div>
</template>

<script>
import firebase from "firebase/app";
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
            id: this.$route.query.id,
        }
    }
}
</script>

<style scoped>
h1{
    text-decoration: underline #EC6041;
    font-size: 70px;
}
</style>