<template>
  <div class="community-container">
    <h1> Community </h1>
    <p>Discover. Be Inspired.</p>
    <div class="search-bar">
        <input class="input-search" type="text" :placeholder="'Search User'" v-model="searchWord" name="search">
        <button @click="search" type="submit">Search</button>
        <button @click="back" type="submit" v-if="!show">Back</button>

    </div>

    <div v-if="show">
        <ul>
            <li v-for="pic in profile" v-bind:key="pic.index">
                <img id="main-page-img" v-bind:src="pic.imageRef" v-on:click="redirect(pic.user)">
                <p>{{pic.name}}</p>
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
                    obj=doc.data()
                    this.profile.push(obj)
                })
            })
        },
        details(pic){
            this.info = pic;
            this.num = this.count(pic.items);
            console.log(this.num);
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

            //this.searchedItems= []; //clear the previous search returns
            //this.searched=true; //indicate that the user has already searched for something so dont show default marketplace
            var db = firebase.firestore();
            console.log(this.searchWord);
            db.collection('community').where('name', "in", [this.searchWord, this.upperFirst(this.searchWord)]).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.searchedItems.push(doc.data()));
            });
            this.show=false;
        },
        upperFirst(word){
            return word.charAt(0).toUpperCase() + word.slice(1);
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
            show: true
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#profile-info{
    width: 50%;
}
#com-items{
    width: 50%;
}
#profile-img{
    border-radius: 50%;
    height: 125px;
}
#count{
    font-size: 40px;
}
#main-page-img{
    cursor: pointer;
}
h1{
    text-decoration: underline #EC6041;
    font-size: 70px;
}

ul{
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
}
li {
    margin: 30px;
}
img{
    width: 300px;
    height: 300px;
    border-radius: 0%;
    cursor: pointer;
}
p{
    text-align: center;
}
.input-search{
    width:400px;
    height:30px;
    font-size:20px;
}
button{
    height:33px;
    font-size:20px;
}

</style>
