<template>
    <div class="profile-container">
        <h1>TEST</h1>
        {{this.userID}}
        {{this.userItems}}
        <div class="profile-info">
            <div class="profile-name">
                <img :src='this.userProfilePic' id="profile-img"><br>
                <div id="displayName">{{this.userName}}</div>
                <br><br>
            </div>

            <div class="num-items">
                <h1>User Currently Has:</h1>
                <p id="itemCount">{{ this.userItems.length }} Item/s</p>
            </div>

            <div>
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
img{
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
    list-style: none;
    flex-wrap: wrap;
}
.add-item img{
    width: 300px;
    height: 300px;
    border-radius: 0%;
}
</style>