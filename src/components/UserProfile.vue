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
        <div>
            <div v-if="this.userItems.length==0">
                <h1 id="no-items">User has no items</h1>
            </div>
            <div v-else>
                <div class="filter-bars">
                    <br><br>
                    <input class="input-search" type="text" :placeholder="'Search item name'" v-model="searchWord">
                    <button @click="search" type="submit" v-if="show">Search</button>
                    <button @click="back" type="submit" v-if="!show">Back</button>
                    <span></span>
                    <select class="dropdown" v-model="chosenCategory">
                        <option disabled value="">Choose a category</option>
                        <option>top</option>
                        <option>bottom</option>
                        <option>outerwear</option>
                        <option>footwear</option>
                        <option>headwear</option>
                        <option>jewellery</option>
                        <option>accessory</option>
                        <option>others</option>
                    </select>
                    <button @click="categorize()" type="submit" v-if="show">Search</button>
                    <button @click="back" type="submit" v-if="!show">Back</button>
                </div>
                <br><br>
                <div id="items" v-if="!this.searched">
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
                <div id="items" v-else>
                    <div v-if="this.searchedItems.length==0">
                        <br><h3>Your search did not match any item.</h3><br>
                    </div>
                    <div v-else>
                        <ul> 
                            <li v-for="(item, index) in this.searchedItems" v-bind:key="index">
                                <a v-on:click="redirect(item.user, item.count)"> 
                                    <img class="profileItem" :src="item.imageRef">
                                    <p>Name:{{ item.name }}</p>
                                    <p>Category:{{ item.category }}</p>
                                    <p>Details:{{ item.detail }}</p>
                                    <p>Notes:{{ item.notes }}</p>
                                    <button @click="redirect(item.user, item.count)">Check it out!</button>
                                </a>
                            </li>
                        </ul>
                    </div>
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
        },
        search() {
            this.searchedItems=[];
            this.searched=true;
            for (var item of this.userItems){
                if(item.name.toUpperCase().includes(this.searchWord.toUpperCase())){
                    this.searchedItems.push(item);
                }
            }
            this.show=false;
        },
        categorize(){
            this.searchedItems= []; 
            this.searched=true;
            for (var item of this.userItems){
                if(item['category'] == this.chosenCategory){
                    this.searchedItems.push(item);
                }
            }
            this.show=false;
        },
        back(){
            this.searched=false;
            this.searchWord='';
            this.chosenCategory='';
            this.show=true;
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
            userName: false,
            searched: false,
            searchedItems: [],
            searchWord: '',
            chosenCategory: '',
            show: true,
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
.input-search{
    width:200px;
    height:25px;
    font-size:20px;
}
.dropdown{
    width:200px;
    height:30px;
    font-size:20px;
    margin-left: 80px;
}
.filter-bars button{
    background-color:lightgray;
    box-shadow: none;
    color: black;
    width: 100px;
    height:30px;
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
</style>