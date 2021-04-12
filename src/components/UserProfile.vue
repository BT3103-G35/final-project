<template>
    <div class="profile-container">
        <div class="profile-info">
            <div class="profile-name">
                <img :src='this.userProfilePic' id="profile-img"><br>
                <div id="displayName">{{this.userName}}</div>
                <br><br>
                <h1>{{this.userName}} Currently Has:</h1>
                <p id="itemCount">{{ this.userItems.length }} Item/s</p>
                
            </div>
        </div>
        <div id="items">
            <h1 v-if="this.userItems.length==0" id="no-items">User has no items</h1>
            <ul>
                <li v-for="item in userItems" v-bind:key="item.index">
                    <img class="profileItem" :src="item.imageRef">
                    <p>Name: {{ item.name }}</p>
                    <p>Details: {{ item.detail }}</p>
                    <p>Notes: {{ item.notes }}</p>
                    <button @click="redirect(item.user, item.count)">Check it out!</button>
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
            var db = firebase.firestore();
            db.collection('marketplace').where('user', '==', this.userID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.userItems.push(doc.data());
                });
            });
            db.collection("community").doc(this.userID).get().then((url) => {
                this.userProfilePic = url.data().imageRef
                this.userName = url.data().name
            })
        },
        redirect(user, count) {
            window.location.href="/item?user=" + user + "&count=" + count;
        }
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
}
#profile-img{
    width: 150px;
    height: 150px;
    border-radius: 50%;
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
    cursor:pointer;
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
button-editprofile{
  font-size: 30px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: #EC6041;
  box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
  padding: 20px 24px;
  cursor: pointer;
}
#profile-img{
    width: 100px;
    height: auto;
    border-radius: 50%;
    cursor: pointer;
}
.bells img{
    width: 50px;
    height: auto;
    padding: 15px;
}
.num-items h1{
    font-size: 40px;
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
    font-size: 60px;
}
ul{
    display: flex;
    flex-wrap: wrap;
    list-style: none;
}
.add-item img{
    width: 300px;
    height: 300px;
    border-radius: 0%;
}
.profileItem{
    width: 300px;
    height: 300px;
    border-radius: 10%;
}
ul{
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    margin-left: 150px;
}
li {
    padding: 10px;
}
</style>