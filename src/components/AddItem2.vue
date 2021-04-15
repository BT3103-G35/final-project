<template>
    <div class="additems-container">
        <div class="what-kind">
            <br><br><br><br>
            <h1> What kind of {{ this.type }} is this? </h1>
            <br>
            <form @submit.prevent="pressed">
                <label for="name">Name*:</label><br>
                <input type="text" id="name" name="name" size="59" placeholder="What would you call this apparel?" v-model="name" required><br><br>
                <label for="detail">Details*:</label><br>
                <textarea name="detail" rows="3" cols="60" placeholder="Color/Size/Material of your apparel goes here!" v-model="detail" required></textarea><br><br>
                <label for="notes">Notes*:</label><br>
                <textarea name="notes" rows="6" cols="60" placeholder="Anything to take note of, such as the condition or where you bought this item!" v-model="notes" required></textarea><br><br>
                <input type="radio" id="trade" name="trade" value="true" v-on:click="setTrade(1)" required>
                <label style="font-size:20px;" for="trade">Up For Trade</label>
                <input type="radio" id="notrade" name="trade" value="false" v-on:click="setTrade(0)" required>
                <label style="font-size:20px;" for="notrade">Not Up For Trade</label>
                <br><br>
                <button type="submit">Add</button>
            </form>
        </div>
        <div class="upload-image">
            <upload align="center" v-on:upload="onUpload"></upload>
            <br><br><br>
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import upload from "./Upload.vue"
export default {
    mounted() {
        this.setupFirebase();
        this.tagListeners();
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
                        });
                    });
                });
            });            
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items.push(doc.data()))
            });
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items1.push(doc))
            })
            db.collection(this.currentUser.uid).doc('Count').get().then((doc) => {
                if(doc.exists) {
                    this.count = doc.data().count;
                }else{
                    console.log("error");
                }
            });
        },
        onUpload(image) {
            this.image = image;
        },
        pressed() {
            if (!this.image) {
                alert("Please upload/confirm image!")
                return
            }
            var db = firebase.firestore();

            if (this.count==0) { //means this user has never uploaded an item before
                db.collection(this.currentUser.uid).doc('Count').set({
                    count: 1 //i set to 1 since im going to use 0 as the count. then next time the this.count will be 1 so the no. wont repeat
                });
                db.collection('marketplace').add({
                    name: this.name,
                    category: this.type,
                    detail: this.detail,
                    notes: this.notes,
                    imageRef: 'uploads/'+this.currentUser.uid+'/' + this.image,
                    user: this.currentUser.uid,
                    count: this.count, //which will be zero in this case.
                    filename: this.image,
                    tradeable: this.tradeable
                });
                db.collection(this.currentUser.uid).add({
                    name: this.name,
                    category: this.type,
                    detail: this.detail,
                    notes: this.notes,
                    imageRef: 'uploads/'+this.currentUser.uid+'/' + this.image,
                    count: this.count,
                    wishlist: false,
                    filename: this.image,
                    tradeable: this.tradeable,
                    user: this.currentUser.uid,
                }).then(() => this.$router.push('/profile'));
            } else {
                db.collection('marketplace').add({
                    name: this.name,
                    category: this.type,
                    detail: this.detail,
                    notes: this.notes,
                    imageRef: 'uploads/'+this.currentUser.uid+'/' + this.image,
                    user: this.currentUser.uid,
                    count: this.count, //which will be zero in this case.
                    filename: this.image,
                    tradeable: this.tradeable
                });
                db.collection(this.currentUser.uid).add({
                    name: this.name,
                    category: this.type,
                    detail: this.detail,
                    notes: this.notes,
                    imageRef: 'uploads/'+this.currentUser.uid+'/' + this.image,
                    count: this.count,
                    wishlist: false,
                    filename: this.image,
                    tradeable: this.tradeable,
                    user: this.currentUser.uid,
                }).then(() => this.$router.push('/profile'));
                db.collection(this.currentUser.uid).doc('Count').update({
                    count: this.count + 1
                });
            }
        },
        chooseType(string) {
            this.itemType = string;
        },
        tagListeners() {
            var header = document.getElementById("types");
            var imgs = header.getElementsByClassName("img");
            for (var i = 0; i < imgs.length; i++) {
                imgs[i].addEventListener("click", function() {
                    var current = document.getElementsByClassName("active");
                    if (current.length > 0) { 
                        current[0].className = current[0].className.replace(" active", "");
                    }
                    this.className += " active";
                });
            } 
        },
        setTrade(num){
            this.tradeable=num;
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            name: '',
            detail: '',
            notes: '',
            imageRef: false,
            type: this.$route.query.id,
            itemType: '',
            items: [],
            items1: [],
            tradeable: 0,
            count: 0
        }
    },
    components:{
        upload
    }
}
</script>

<style scoped>
h1{
    text-decoration: underline #EC6041;
    font-size: 30px;
}

.additems-container{
    font-size:25px;
    display:flex;
    justify-content: space-between;
    margin-left: 15%;
    height:800px;
}
.upload-image{
    margin-top: 10%;
    margin-right: 15%;
}
.search-bar{
    margin-left: 250px;
}
button{
    background: #EC6041;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
    color: white;
    width:450px;
    height:40px;
    font-size:30px;
    cursor:pointer;
}
ul {
    columns:2;
}
img {
    cursor: pointer;    
}
.active {
    border: 2px dotted coral;
}
input{
    font-size:15px;
}
textarea{
    font-size:15px;
}
#name{
    width: 495px;
}

</style>