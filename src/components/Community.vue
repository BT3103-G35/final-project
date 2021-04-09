<template>
  <div class="community-container">
    <h1> Community </h1>
    <p>Discover. Be Inspired.</p>
    <ul>
        <li v-for="pic in profile" v-bind:key="pic.index">
            <img id="main-page-img" v-bind:src="pic.imageRef">
            <p>{{pic.name}}</p>
        </li>
    </ul>
    <!--
    <div v-show="!checker" id="profile-container">
        <div id="profile-info">
            <img id="profile-img" v-bind:src="this.info.profile"/>
            <p>Name: {{this.info.name}}</p>
            <p>Age: {{this.info.age}}</p>
            <p id="count"><b>Currently has: <br>{{this.num}} Item/s</b></p>
        </div>
        <div id="com-items">
            <ul>
                <li v-for="item in this.info.items" v-bind:key="item.index">
                    <img v-bind:src="item"/>
                </li>
            </ul>
        </div>
    </div>
    <button v-on:click="check()" v-show="!checker">Go Back!</button>
    -->
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
        }

    },
    data(){
        return{
            items:[],
            profile: [],
            name: false,
            checker: true,
            info: false,
            num: false
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
ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}
li {
  flex-grow: 1;
  flex-basis: 300px;
  text-align: center;
  padding: 10px;
  border: 1px solid #EC6041;
  margin: 10px;
}
img {
  width: 125px;
  height: auto;
  cursor: pointer;
}

</style>
