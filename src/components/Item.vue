<template>
    <div class="item-container">
        {{ this.userID }} <br>
        {{ this.count }} <br>
        {{ this.item }}
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
                    this.fetchItem();
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
        
        fetchItem() {
            var db = firebase.firestore();
            db.collection('marketplace').where('user', '==', this.userID).where('count', '==', this.count).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.item.push(doc.data());
                });
            });
            console.log(this.item);
            console.log(typeof this.userID);
            console.log(typeof this.count)

        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            userID: this.$route.query.user,
            count: parseInt(this.$route.query.count),
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