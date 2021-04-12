<template>
    <div class="profile-container">
        <div class="profile-info">
            <div class="profile-name">
                <img :src='this.url' id="profile-img"><br>
                <div id="displayName">{{this.currentUser.displayName}}</div>
                <br><br>
                <router-link to="/editprofile" tag="button-editprofile" exact>Edit Profile</router-link>
            </div>
            <div class="bells-and-chat">
                <img id="bell-img" src="https://i.postimg.cc/259ychNb/Bell.png" onclick="alert('Notifications Turned On')">
                <img id="nobell-img" src="https://i.postimg.cc/HWynzrZn/No-Bell.png" onclick="alert('Notifications Turned Off')">
                <img id="chat-img" src="https://i.postimg.cc/kGbcQnmX/Chat-Icon.png" @click="goToChatList">
            </div>
            <div class="num-items">
                <h1>You Currently Have:</h1>
                <p id="itemCount">{{ this.items1.length }} Item/s</p>
                <button style="color: transparent; background-color: transparent; border-color: transparent; box-shadow: none;"> <router-link to="/additem" tag="button-additem" exact v-if="this.items.length>0">Add item</router-link> </button>
                <!--
                <br><button style="color: transparent; background-color: transparent; border-color: transparent; box-shadow: none;"> <router-link to="/wishlist" tag="button-additem" exact>Wishlist</router-link> </button>
                -->
            </div>
    
        </div>
        <div class="add-item" v-if="this.items1.length==0">
            <h1>Oh no...</h1>
            <h1>It seems you<br>have no items...</h1>
            <router-link to="/additem" tag="button-additem" exact>Click to add!</router-link>
        </div>
        <div class="add-item" v-else>
            <ul>
                <li v-for="item in items1" v-bind:key="item.index">
                    <a>
                        <img v-on:click="redirect(item.data().user, item.data().count)" :src="item.data().imageRef">
                        <p>Name: {{ item.data().name }}</p>
                        <p>Details: {{ item.data().detail }}</p>
                        <p>Notes: {{ item.data().notes }}</p>
                        <button @click="edit(item)">Edit</button>
                        <br><br><br><br>
                    </a>
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
        this.fetchProfilePic();
        //this.addProfilePicToCollection();
    },
    methods:{
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    this.loggedIn = true;
                    this.currentUser = firebase.auth().currentUser;
                    this.fetchItems();
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
        fetchProfilePic(){
            var db = firebase.firestore();
            firebase.auth().onAuthStateChanged(user => {
                if (user){
                    firebase.storage().ref('users/' + user.uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                        this.url = imgUrl
                        db.collection('community').doc(user.uid).set({
                            imageRef: imgUrl,
                            user: this.currentUser.uid,
                            name: this.currentUser.displayName
                        });
                    })
                }
            })
        },

        fetchItems() {
            var storageRef = firebase.storage().ref();
            var db = firebase.firestore();
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let imagePath = doc.data().imageRef;
                    storageRef.child(imagePath).getDownloadURL().then((url) => {
                        db.collection(this.currentUser.uid).doc(doc.id).update({
                            imageRef: url
                        })
                    })
                })
            });
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
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items.push(doc))
            });
            db.collection('marketplace').where('user', '==', this.currentUser.uid)
                    .get()
                    .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => this.items1.push(doc))
            })
        },  
        edit(item){
            window.location.href="/edititem?user=" + item.data().user + "&count=" + item.data().count
        },
        redirect(user, count) {
            window.location.href="/item?user=" + user + "&count=" + count;
        },
        goToChatList(){
            window.location.href="/chatlist?user=" +this.currentUser.uid;
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            items: [],
            items1: [],
            url: false,
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
.bells-and-chat img{
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
    list-style: none;
    flex-wrap: wrap;
}
.add-item img{
    width: 300px;
    height: 300px;
    border-radius: 10%;
}
ul{
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
}
li {
    padding: 30px;
}
</style>