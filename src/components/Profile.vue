<template>
    <div class="profile-container">
        <div class="profile-info">
            <div class="profile-name">
                <img src="https://i.postimg.cc/yNMnZJp9/blank-profile-picture-973460-1280-1.png">
                <div id="displayName">{{this.currentUser.displayName}}</div>
            </div>
            <div class="bells">
                <img src="https://i.postimg.cc/259ychNb/Bell.png">
                <img src="https://i.postimg.cc/HWynzrZn/No-Bell.png">
            </div>
            <div class="num-items">
                <h1>You Currently Have:</h1>
                <p id="itemCount">{{ this.items.length }} Item/s</p>
                <router-link to="/additem" tag="button-additem" exact v-if="this.items.length>0">Add more</router-link>
                <router-link to="/wishlist" tag="button-additem" exact>wishlist placeholder</router-link>
            </div>
    
        </div>
        <div class="add-item" v-if="this.items.length==0">
            <h1>Oh no...</h1>
            <h1>It seems you<br>have no items...</h1>
            <router-link to="/additem" tag="button-additem" exact>Click to add!</router-link>
        </div>
        <div class="add-item" v-else>
            <ul>
                <li v-for="item in items" v-bind:key="item.index">
                    <img :src="item.imageRef">
                    <p>Name: {{ item.name }}</p>
                    <p>Detail: {{ item.detail }}</p>
                    <p>Notes: {{ item.notes }}</p>
                    <button @click="remove(item)">Remove</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";
export default {
    created() {
        this.setupFirebase();
    },
    methods:{
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    this.loggedIn = true;
                    this.currentUser = firebase.auth().currentUser;
                    // var listRef = firebase.storage().ref('uploads/' + this.currentUser.uid);
                    // listRef.listAll().then((res) => {
                    //     console.log(res)
                    //     res.items.forEach((itemRef) => {
                    //         console.log(itemRef);
                    //         itemRef.getDownloadURL().then((url) => this.items.push(url))
                    //     }
                    // )})
                    this.fetchItems();
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
        fetchItems() {
            var storageRef = firebase.storage().ref();
            var db = firebase.firestore();
            console.log(this.currentUser)
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let imagePath = doc.data().imageRef;
                    console.log(imagePath);
                    storageRef.child(imagePath).getDownloadURL().then((url) => {
                        db.collection(this.currentUser.uid).doc(doc.id).update({
                            imageRef: url
                        })
                    })
                })
            });
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items.push(doc.data()))
            })
            console.log(this.items)
        },
        remove(item){
            var pictureRef = firebase.storage().refFromURL(item);
            pictureRef.delete().then(()=> location.reload());
            //alert("Item removed successfully")
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            items: []
        }
    }
}
</script>

<style scoped>
.profile-container{
    display: flex;
}
.profile-info{
    width: 40%;
    margin-left: 100px;
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
img{
    width: 100px;
    height: auto;
    border-radius: 50%;
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
    font-size: 20px;
}
#itemCount{
    font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 60px;
}
ul{
    list-style: none;
    display:flex;
}
li{
    margin: 5px;
}
.add-item img{
    width: 300px;
    height: 300px;
    border-radius: 0%;
}
</style>