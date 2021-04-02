<template>
  <div>
    <h1> Community </h1>
    <p>Discover. Be Inspired.</p>
    <ul>
        <li v-for="pic in profile" v-bind:key="pic">
            <img v-bind:src="pic.profile">
        </li>
    </ul>
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
            database.collection("dummyusers").get().then((SnapShot)=>{
                let obj={}
                SnapShot.forEach(doc=>{
                    obj=doc.data()
                    this.profile.push(obj)
                })
            })
        }
    },
    data(){
        return{
            items:[],
            profile: []
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
}
</style>
