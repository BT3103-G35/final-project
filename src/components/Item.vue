<template>
    <div class="item-container">
        <div class="item-information">
            <div style="display:flex;">
                <div style="width:35%;">
                    <img class="profile-img" style="margin-left:225px;" :src="this.itemLister[0].imageRef">
                </div>
                <div>
                    <br>
                    <span> <b>Lister:  </b></span>
                    <span style="font-weight:normal; text-decoration: underline #EC6041;">{{ this.itemLister[0].name }}</span>
                    <br>
                    <span style="font-weight:normal;" v-if="this.userID == currentUser.uid">(oh look, its you!)</span>
                </div> 
            </div>
            <br>
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" size="60" :value=this.item[0].name :readonly="true"><br><br>
            <label for="detail">Details:</label><br>
            <textarea name="detail" rows="3" cols="57" :value=this.item[0].detail :readonly="true"></textarea><br><br>
            <label for="notes">Notes:</label><br>
            <textarea name="notes" rows="6" cols="57" :value=this.item[0].notes :readonly="true"></textarea><br>
            <div v-if="this.item[0].tradeable==1" style="display:flex;">
                <div style="margin-left:415px;">
                    <p style="font-size:23px;">This item is up for trade</p>
                </div>
                <div style="margin-top:10px;">
                    <img class="trade-indicator" src="https://i.postimg.cc/jSVLLXFY/Green-Sign.png" @click="goToChatList">
                </div>
            </div>
            <div v-else style="display:flex;">
                <div style="margin-left:397px;">
                    <p style="font-size:23px;">This item is not up for trade</p>
                </div>
                <div style="margin-top:10px;">
                    <img class="trade-indicator" src="https://i.postimg.cc/jj3WdbVZ/Red-Sign.png" @click="goToChatList">
                </div>
            </div>
            <button v-if="this.userID != this.currentUser.uid" @click="goToLister">See lister's profile</button>
            <button v-if="this.userID != this.currentUser.uid && this.wishlist == 1" @click="removeFromWishlist">Remove from Wishlist</button>
            <button v-if="this.userID != this.currentUser.uid && this.wishlist == 0" @click="addToWishlist">Add To Wishlist!</button>
            <button v-if="this.userID == this.currentUser.uid" @click="edit">Edit your item!</button>
            <br>
            <button style="width:400px; padding:10px 10px;" id="chat" v-if="this.userID != this.currentUser.uid" @click="goToChat">Send the lister a message!</button>
        </div>
        <div class="item-image">
            <img :src="this.item[0].imageRef" contain height="500px" width="500px">
            <div id="app">
                <twitter-button
                    description="Hey check out this cool item I found on Ainran!"
                    btnText = "Share to Twitter!"
                /><br>
                <facebook-button
                    description="Hey check out this cool item I found on Ainran!"
                    btnText = "Share to Facebook!"
                /><br>
                <telegram-button
                    description="Hey check out this cool item I found on Ainran!"
                    btnText = "Share to Telegram!"
                />
                </div>
        </div>
        
    </div>
</template>

<script>
import firebase from "firebase/app";
import TwitterButton from "./TwitterButton";
import FacebookButton from "./FacebookButton";
import TelegramButton from "./TelegramButton";
export default {
    components: {
        TwitterButton,
        FacebookButton,
        TelegramButton,
    },
    mounted() {
        this.setupFirebase();
    },
    methods:{
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    this.loggedIn = true;
                    this.currentUser = firebase.auth().currentUser;
                    this.fetchItem();
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },   
        fetchItem() {
            var db = firebase.firestore();
            db.collection(this.userID).where('user', '==', this.userID).where('count', '==', this.count).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.item.push(doc.data());
                });
            });
            db.collection(this.currentUser.uid).where('user', '==', this.userID).where('count', '==', this.count)
            .where('wishlist', '==', true).get()
            .then((query) => {
                var result = query.docs.length;
                if(result == 0) { //no items that match this which are in the wishlist
                    this.wishlist = 0; //0 means not in wishlist
                } else {
                    this.wishlist = 1; //else in the wishlist
                }
            });
            db.collection('community').where('user', '==', this.userID).get()
            .then((query) => {
                const result = query.docs[0];
                this.itemLister.push(result.data());
            })
        },
        addToWishlist() {
            var db = firebase.firestore();
            db.collection(this.currentUser.uid).doc().set({
                name: this.item[0].name,
                detail: this.item[0].detail,
                notes: this.item[0].notes,
                imageRef: this.item[0].imageRef,
                count: this.count,
                user: this.userID,
                wishlist: true
            });
            alert("Item successfully added to your Wishlist!");
            this.$router.push('/wishlist');
        },
        removeFromWishlist(){
            var answer=confirm("Are you sure you want to remove this item from your Wishlist?");
            if (answer) {
                var db = firebase.firestore();
                db.collection(this.currentUser.uid).where('user', '==', this.userID).where('count', '==', this.count)
                .where('wishlist', '==', true)
                .get()
                .then((query) => {
                    const result = query.docs[0];
                    result.ref.update({
                        wishlist: false,
                    })
                    alert("Item successfully removed")
                    this.$router.push('/wishlist')
                })
            } else {
                alert("Your item has not been removed");
            }
        },
        edit(){
            window.location.href="/edititem?user=" + this.userID + "&count=" + this.count;
        },
        goToLister(){
            window.location.href="/UserProfile?user=" + this.userID;
        },
        goToChat(){
            window.location.href="/chat?buyer=" + this.currentUser.uid + "&seller=" + this.userID + "&count=" + this.count;
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            userID: this.$route.query.user,
            count: parseInt(this.$route.query.count),
            item: [],
            wishlist: 1,
            itemLister:[]
        }
    }
}
</script>

<style scoped>
.item-container{
    display: flex;
    margin-top: 75px;
    font-weight: bold;
    font-size: 25px;
}

.item-information{
    width: 60%;
}

input{
    padding: 12px 20px;
    font-weight: bold;
    font-size: 18px;
}
#name{
    width: 590px;
}

textarea{
    padding: 12px 20px;
    font-weight: bold;
    font-size: 18px;
}
button{
    background: #EC6041;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
    color: white;
    width: 250px;
    margin: 10px;
    padding: 10px 10px;
    font-size: 25px;
    cursor: pointer;
}
#chat{
    background:black;
    box-shadow: 0px 0px 0px, 0px 0px 0px;
    width: 280px;
}
.profile-img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
}
.trade-indicator{
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-left: 15px;
}
</style>