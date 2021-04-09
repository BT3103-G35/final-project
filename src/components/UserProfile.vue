<template>
    <div class="profile-container">
        <div class="profile-info">
            <div class="profile-name">
                <img :src='this.userProfilePic' id="profile-img"><br>
                <div id="displayName">{{this.userName}}</div>
                <br><br>
                <h1>User Currently Has:</h1>
                <p id="itemCount">{{ this.userItems.length }} Item/s</p>
            </div>

            <div id="items">
                <ul>
                    <li v-for="item in userItems" v-bind:key="item.index">
                        <img :src="item.imageRef">
                    </li>
                </ul>
            </div>
    
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
            var db = firebase.firestore();
            db.collection(this.userID).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.userItems.push(doc.data());
                });
            });
            db.collection("community").doc(this.userID).get().then((url) => {
                this.userProfilePic = url.data().imageRef
                this.userName = url.data().name
            })
        },  
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            items: [],
            items1: [],
            url: false,
            userID: this.$route.query.user,
            userItems: [],
            userProfilePic: false,
            userName: false
        }
    }
}
</script>

<style scoped>
.test-style{
    border: 1px red;
}
.profile-container{
    display: flex;
    background-color: #fff7e6;
}
.profile-info{
    width: 40%;
    margin-left: 100px;
    display: flex;
}
.profile-name{
    margin-left: 100px;
}
#profile-img{
    width: 150px;
    height: 150px;
    border-radius: 50%;
}
#items{
    margin-left: 250px;
}
.add-item{
    width: 60%;
}
h1{
    font-size: 35px;
}
button{
    height: 40px;
    width: 200px;
    font-size: 20px;
    background-color: #EC6041;
    color: white;
    background: #EC6041;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
    cursor:pointer;
}

img{
    width: 300px;
    height: 300px;
    cursor: pointer;
}

.num-items h1{
    font-size: 50px;
}
.profile-name{
    padding: 50px;
}
#displayName{
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-weight: bold;
    font-size: 30px;
}
#itemCount{
    font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 40px;
}
ul{
    list-style: none;
    flex-wrap: wrap;
}
.add-item img{
    width: 300px;
    height: 300px;
    border-radius: 0%;
}
</style>