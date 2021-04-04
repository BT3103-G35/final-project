<template>
    <div>
        <div class="marketplace-title">
            <h1> Marketplace </h1>
        </div>
        <div class="marketplace-container">
            <ul>
                <li v-for="(item, index) in this.items" v-bind:key="index">
                    <img :src="item.imageRef">
                    <p>Name:{{ item.name }}</p>
                    <p>Details:{{ item.detail }}</p>
                    <p>Notes:{{ item.notes }}</p>
                    <p>User ID:{{ item.user }}</p>
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
export default {
    created() {
        this.setupFirebase();
        this.fetchItems();
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
        fetchItems() {
            var storageRef = firebase.storage().ref();
            var db = firebase.firestore();
            db.collection('marketplace').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let imagePath = doc.data().imageRef;
                    storageRef.child(imagePath).getDownloadURL().then((url) => {
                        db.collection('marketplace').doc(doc.id).update({
                            imageRef: url
                        })
                    })
                })
            });
            db.collection('marketplace').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items.push(doc.data()))
            })
            console.log(this.items)
        },
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            items: [], // item details
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{
    text-decoration: underline #EC6041;
    font-size: 70px;
    text-align: center;
}
ul{
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
}
li {
    margin: 10px;
}
img{
    width: 300px;
    height: 300px;
    border-radius: 0%;
}
</style>
