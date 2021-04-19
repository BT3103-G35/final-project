<template>
    <div class="profile-container">
        <div class="profile-info">
            <div class="profile-name">
                <img :src='this.userProfilePic' id="profile-img"><br>
                <div id="displayName">{{this.userName}}</div>
                <br><br>
                <h1>{{this.userName}} </h1>
                <h1> Currently Has:</h1>
                <p v-if="this.userItems.length==1" class="itemCount"> 1 Item</p>
                <p v-else class="itemCount"> {{ this.userItems.length }} Items </p>
            </div>
        </div>
        <div class="item-container">
            <div class="items" v-if="this.userItems.length==0">
                <h1 id="no-items">User has no items</h1>
            </div>
            <div v-else>
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
                </div>
                <br><br>
                <div class="items" v-if="!this.searched">
                    <ul>
                        <li v-for="item in userItems" v-bind:key="item.index">
                            <img class="profileItem" :src="item.imageRef">
                            <p id="info">Name: {{ item.name }}</p>
                            <p id="info">Details: {{ item.detail }}</p>
                            <p id="info">Notes: {{ item.notes }}</p>
                            <button @click="redirect(item.user, item.count)"><b>Check it out!</b></button>
                        </li>
                    </ul>
                </div>
                <div class="items" v-else>
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
        },
        categorize(){
            this.searchedItems= []; 
            this.searched=true;
            for (var item of this.userItems){
                if(item['category'] == this.chosenCategory){
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
        }
    }
}
</script>

<style scoped>
.profile-container{
    display: flex;
}
.profile-info{
    margin-top:80px;
    margin-left: 130px;
    background-color:#EAF8DE;
    border: 5px solid #376C12;
    height: 900px;
}

.add-item{
    width: 60%;
}
h1{
    font-size: 70px;
}
#info{
    width:300px;
}
.input-search{
    width:150px;
    height:18px;
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
    width: 75px;
    height:25px;
}
button{
    height: 40px;
    width: 200px;
    font-size: 15px;
    background-color: black;
    color: white;
    background: black;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    cursor:pointer;
}
#profile-img{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
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
    padding: 0px;
    margin-top: 50px;
    width: 400px;

}
#displayName{
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-weight: bold;
    font-size: 30px;
}
.itemCount{
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
    list-style: none;
    flex-wrap: wrap;
}
li {
    padding: 15px;
}
h1{
    text-decoration: underline #376C12;
}
.item-container{
    margin-left: 130px;
}
.items img{
    width: 300px;
    height: 300px;
    border-radius: 10%;
}
</style>