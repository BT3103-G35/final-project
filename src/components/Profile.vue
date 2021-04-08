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
                <p id="itemCount">{{ this.items1.length }} Item/s</p>
                <button style="color: transparent; background-color: transparent; border-color: transparent; box-shadow: none;"> <router-link to="/additem" tag="button-additem" exact v-if="this.items.length>0">Add item</router-link> </button>
                <br><br><br><br><button style="color: transparent; background-color: transparent; border-color: transparent; box-shadow: none;"> <router-link to="/wishlist" tag="button-additem" exact>Wishlist</router-link> </button>
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
                    <a v-on:click="redirect(item.data().user, item.data().count)">
                        <img :src="item.data().imageRef">
                        <p>Name: {{ item.data().name }}</p>
                        <p>Details: {{ item.data().detail }}</p>
                        <p>Notes: {{ item.data().notes }}</p>
                        <button @click="remove(item)">Remove</button>
                    </a>
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
            db.collection('marketplace').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let imagePath = doc.data().imageRef;
                    console.log(imagePath);
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
            //db.collection(this.currentUser.uid).get().then((querySnapshot) => {
            //    querySnapshot.forEach((doc) => this.items1.push(doc))
            //})
            db.collection('marketplace').where('user', '==', this.currentUser.uid)
                    .get()
                    .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => this.items1.push(doc))
            })
            console.log(this.items)
        },
        remove(item){
            
            var db = firebase.firestore();
            
            var pictureRef = firebase.storage().refFromURL(item.data().imageRef);
            pictureRef.delete()//.then(()=> location.reload());
            
            //let doc_id = item.target.getAttribute("id");
            //console.log('here' + doc_id)
            var docRef = db.collection('marketplace').where('user', '==', this.currentUser.uid).where('count', '==', this.items.length - 1);
            docRef.get().then(function(querySnapshot){
                querySnapshot.forEach(function(doc) {
                    doc.ref.delete()
                    .then(() => location.reload())
                    })
                })
        }
            /*then(function() {
                console.log('doc deleted');
            }).catch(function(error) {
                console.error("error removing: ", error);
            });*/

    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            items: [],
            items1: []
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
    flex-wrap: wrap;
}
.add-item img{
    width: 300px;
    height: 300px;
    border-radius: 0%;
}
</style>