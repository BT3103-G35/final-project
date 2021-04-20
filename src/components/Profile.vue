<template>
    <div class="profile-container">
        <div class="profile-info">
            <div class="profile-name">
                <img :src='this.url' id="profile-img" @error="$event.target.src='https://i.postimg.cc/15z7cNHS/Screenshot-2021-04-17-020340.jpg'"><br>
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
                <p id="itemCount" v-if="this.items1.length==1" class="itemCount"> 1 Item</p>
                <p id="itemCount" v-else class="itemCount"> {{ this.items1.length }} Items </p>
                <button style="color: transparent; background-color: transparent; border-color: transparent; box-shadow: none;"> <router-link to="/additem" tag="button-additem" exact v-if="this.items1.length>0">Add item</router-link> </button>
            </div>
    
        </div>
        <div class="add-item" v-if="this.items1.length==0">
            <h1>Oh no...</h1>
            <h1>It seems you<br>have no items...</h1>
            <br>
            <router-link to="/additem" tag="button-additem" exact>Click to add!</router-link>
        </div>
        <div class="item-container" v-else>
            <div class="filter-bars">
                <br><br>
                    <input class="input-search" type="text" :placeholder="'Search item name'" v-model="searchWord">
                    <button id="filter" @click="search" type="submit">Search</button>
                    <button id="filter" @click="back" type="submit">Back</button>
                    <span></span>
                    <select class="dropdown" v-model="chosenCategory">
                        <option disabled value="">Choose a category</option>
                        <option>top</option>
                        <option>bottom</option>
                        <option>outerwear</option>
                        <option>footwear</option>
                        <option>dress</option>
                        <option>headwear</option>
                        <option>accessory</option>
                        <option>others</option>
                    </select>
                    <button id="filter" @click="categorize()" type="submit">Search</button>
                    <button id="filter" @click="back" type="submit">Back</button>
                <br><br>
            </div>
            <div v-if="!this.searched">
                <ul>
                    <li v-for="item in items1" v-bind:key="item.index">
                        <a>
                            <img v-on:click="redirect(item.data().user, item.data().count)" :src="item.data().imageRef" @error="$event.target.src='https://i.postimg.cc/15z7cNHS/Screenshot-2021-04-17-020340.jpg'">
                            <p class="info">Name: {{ item.data().name }}</p>
                            <p class="info">Details: {{ item.data().detail }}</p>
                            <p class="info">Notes: {{ item.data().notes }}</p>
                            <button class="edit" @click="edit(item)"><b>Edit</b></button>
                            <br><br><br>
                        </a>
                    </li>
                </ul>
            </div>
            <div v-else>
                <div v-if="this.searchedItems.length==0">
                    <br><h3>Your search did not match any item.</h3><br>
                </div>
                <div v-else>
                    <ul> 
                        <li v-for="(item, index) in this.searchedItems" v-bind:key="index">
                            <a> 
                                <img v-on:click="redirect(item.data().user, item.data().count)" :src="item.data().imageRef">
                                <p class="info">Name:{{ item.data().name }}</p>
                                <p class="info">Details:{{ item.data().detail }}</p>
                                <p class="info">Notes:{{ item.data().notes }}</p>
                                <button class="edit" @click="edit(item)"><b>Edit</b></button>
                                <br><br><br>
                            </a>
                        </li>
                    </ul>
                </div>
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
        this.fetchProfilePic();
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
                        });
                    });
                });
            });
            db.collection('marketplace').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let imagePath = doc.data().imageRef;
                    storageRef.child(imagePath).getDownloadURL().then((url) => {
                        db.collection('marketplace').doc(doc.id).update({
                            imageRef: url
                        });
                    });
                });
            }); 
            db.collection('marketplace').where('user', '==', this.currentUser.uid)
                    .get()
                    .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => this.items1.push(doc))
            });
            db.collection(this.currentUser.uid).where('wishlist', '==', true).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection('marketplace').where('user', '==', doc.data().user).where('count', '==', doc.data().count).get()
                    .then((query) => {
                        if (query.docs.length==0){
                            doc.ref.delete();
                        }
                    });
                });
            });
        },  
        edit(item){
            window.location.href="/edititem?user=" + item.data().user + "&count=" + item.data().count
        },
        redirect(user, count) {
            window.location.href="/item?user=" + user + "&count=" + count;
        },
        goToChatList(){
            window.location.href="/chatlist?user=" +this.currentUser.uid;
        },
        search() {
            this.searchedItems=[];
            this.searched=true;
            for (var item of this.items1){
                if(item.data()['name'].toUpperCase().includes(this.searchWord.toUpperCase())){
                    this.searchedItems.push(item);
                }
            }
        },
        categorize(){
            this.searchedItems= []; 
            this.searched=true;
            for (var item of this.items1){
                if(item.data()['category'] == this.chosenCategory){
                    this.searchedItems.push(item);
                }
            }
        },
        back(){
            this.searched=false;
            this.searchWord='';
            this.chosenCategory='';
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            items1: [],
            url: false,
            searchedItems: [],
            searchWord: '',
            searched: false,
            chosenCategory: '',
        }
    }
}
</script>

<style scoped>
.add-item{
    margin-left: 70px;
    margin-top: 45px;
}
p{
    text-align: left;
    font-size: 12px;
    font-family: Helvetica, sans-serif;
    font-weight:bold;
    line-height: 200%;
    margin-left: 10px;
}
.profile-container{
    display: flex;
    min-height:745px;
}
.profile-info{
    margin-top:40px;
    margin-left: 120px;
    background-color:#EAF8DE;
    border: 5px solid #376C12;
    width: 230px;
    min-height: 650px;
    max-height:715px;
}
.num-items h1{
    font-size: 27px;
}
#profile-img{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
}
.input-search{
    width:150px;
    height:19px;
    font-size:15px;
}
.dropdown{
    width:150px;
    height:25px;
    font-size:15px;
    margin-left: 40px;
}
#filter{
    background-color:lightgray;
    box-shadow: none;
    color: black;
    width: 60px;
    height:25.5px;
}
.item-container{
    margin-left:20px;
}
.edit{
    height: 30px;
    width: 140px;
    font-size: 13px;
    background-color: #3F3726;
    border: solid 4px black;
    color: white;
    cursor:pointer;
    margin-right:43px;
}
button-additem{
    font-size: 20px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    background: black;
    box-shadow: 4px 4px 0px #507B2E, 8px 8px 0px #6B8B51;
    padding: 14px 19px;
    cursor: pointer;
}
button-editprofile{
    font-size: 20px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    background: black;
    box-shadow: 4px 4px 0px #507B2E, 8px 8px 0px #6B8B51;
    padding: 12px 15px;
    cursor: pointer;
}
img{
    width: 50px;
    height:50px;
    height: auto;
    border-radius: 50%;
    cursor: pointer;
}
.bells-and-chat img{
    width: 35px;
    height: auto;
    padding: 8px;
}
.profile-name{
    padding: 30px;
}
#displayName{
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-weight: bold;
    font-size: 30px;
}
#itemCount{
    font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 35px;
    text-align: center;
}
ul{
    display: flex;
    list-style: none;
    flex-wrap: wrap;
}
li{
    padding: 22px;
}
.item-container img{
    width: 190px;
    height: 190px;
    border-radius: 10%;
}
.info{
    width: 190px;
}
h1{
    text-decoration: underline #376C12;
}
</style>