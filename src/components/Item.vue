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
        this.fetchItem();
        console.log(this.token);
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
        },
        fetchItem() {
            var db = firebase.firestore();
            db.collection('marketplace').where('imageRef', '==', this.id).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id);
                    this.item.push(doc.data());
                    console.log(this.item);
                });
            });
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            id: this.$route.query.id + '&token=' + this.$route.query.token,
            item: []
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