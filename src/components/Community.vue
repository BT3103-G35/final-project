<template>
  <div class="community-container">
    <h1> Community </h1>
    <p>Discover. Be Inspired.</p>
    <div class="search-bar">
        <input class="input-search" type="text" :placeholder="'Search User'" v-model="searchWord" name="search">
        <button @click="search" type="submit" v-if="show">Search</button>
        <button @click="back" type="submit" v-if="!show">Back</button>

    </div>

    <div v-if="show">
        <ul>
            <li v-for="pic in profile" v-bind:key="pic.index" >
                <img id="main-page-img" v-bind:src="pic.imageRef" v-on:click="redirect(pic.user)">
                <p><b>{{pic.name}}</b></p>
            </li>
        </ul>
    </div>

    <div v-if="!show">
        <ul>
            <li v-for="pic in searchedItems" v-bind:key="pic.index">
                <img id="main-page-img" v-bind:src="pic.imageRef" v-on:click="redirect(pic.user)">
                <p>{{pic.name}}</p>
            </li>
        </ul>
    </div>

    <div v-if="!show && this.searchedItems.length==0">
        <h2>No User Found</h2>
    </div>

  </div>
</template>

<script>

import firebase from "firebase/app";
import "firebase/firestore";

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
                    var listRef = firebase.storage().ref('uploads/' + this.currentUser.uid);
                    listRef.listAll().then((res) => {
                        res.items.forEach((itemRef) => {
                            itemRef.getDownloadURL().then((url) => this.items.push(url))
                        }
                    )})
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
        fetchItems: function(){
            var database = firebase.firestore();
            database.collection("community").get().then((SnapShot)=>{
                let obj={}
                SnapShot.forEach(doc=>{
                    if (doc.data().user != this.currentUser.uid){
                    obj=doc.data()
                    this.profile.push(obj)
                    }
                })
            })
        },
        details(pic){
            this.info = pic;
            this.num = this.count(pic.items);
        },
        check(){
            if (this.checker==true){
                this.checker = false;
            }else{
                this.checker=true;
            }
        },
        count(array){
            let i = 0;
            for (const a of array){
                if (a!=""){
                    i++;
                }
            }
            return i;
        },
        redirect(user) {
            window.location.href="/UserProfile?user=" + user;
        },
        search(){
            for (var item of this.profile){
                if (item.name.toUpperCase().includes(this.searchWord.toUpperCase())){
                    console.log(item.name);
                    console.log(item.user)
                    this.searchedItems.push(item);
                }
            }

            this.show=false;
        },
        upperFirst(word){
            return [word.charAt(0).toUpperCase() + word.slice(1), word.charAt(0).toLowerCase() + word.slice(1)]
        },
        back(){
            this.searchedItems = [];
            this.searchWord = '';
            this.show = true;
        }

    },
    data(){
        return{
            items:[],
            profile: [],
            name: false,
            checker: true,
            info: false,
            num: false,
            searchWord: '',
            searchedItems: [],
            show: true,
            loggedIn: false,
            currentUser: false
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main-page-img{
    cursor: pointer;
}
h1{
    text-decoration: underline #376C12;
    font-size: 45px;
}
ul{
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
}
li{
    padding: 25px;
}
img{
    width: 186px;
    height: 186px;
    border-radius: 0%;
    cursor: pointer;
    object-fit: cover;
    border: 5px solid #99d370;
}
p{
    text-align: center;
    font-size: 18px;
    text-decoration: underline #376C12;
    text-decoration-thickness: 3px;
}
.input-search{
    width:260px;
    height:20px;
}
label, input{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 15px;
    margin: 0 3.5px 0 3.5px;
}
button{
    height:25px;
    font-size:15px;
}
</style>
