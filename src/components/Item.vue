<template>
    <div class="item-container">
        <div class="item-information">
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" size="60" :value=this.item[0].name :readonly="true"><br><br>
            <label for="detail">Details:</label><br>
            <textarea name="detail" rows="3" cols="60" :value=this.item[0].detail :readonly="true"></textarea><br><br>
            <label for="notes">Notes:</label><br>
            <textarea name="notes" rows="6" cols="60" :value=this.item[0].notes :readonly="true"></textarea><br><br>
            <button v-if="this.userID != this.currentUser.uid">Go to lister's profile</button>
            <button v-if="this.userID != this.currentUser.uid && this.wishlist == 1" @click="removeFromWishlist">Remove from Wishlist</button>
            <button v-if="this.userID != this.currentUser.uid && this.wishlist == 0" @click="addToWishlist">Add To Wishlist!</button>
            <button v-if="this.userID == this.currentUser.uid" @click="edit">Edit your item!</button>
        </div>
        <div class="item-image">
            <img :src="this.item[0].imageRef" contain height="500px" width="500px">
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";
export default {

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
            db.collection(this.userID).where('count', '==', this.count).get()
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
                })
            } else {
                alert("Your item has not been removed");
            }
        },
        edit(){
            window.location.href="/edititem?user=" + this.userID + "&count=" + this.count;
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            userID: this.$route.query.user,
            count: parseInt(this.$route.query.count),
            item: [],
            wishlist: 1
        }
    }
}
</script>

<style scoped>
.item-container{
    display: flex;
    margin-top: 150px;
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
    padding: 14px 30px;
    font-size: 20px;
    cursor: pointer;
}
</style>