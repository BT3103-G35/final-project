<template>
    <div class="item-container">
        <div class="item-information">
            <div style="display:flex;">
                <div style="width:35%;">
                    <img class="profile-img" :src="this.itemLister[0].imageRef">
                </div>
                <div id="lister-name">
                    <br>
                    <span> <b>Lister:  </b></span>
                    <span style="font-weight:normal; text-decoration: underline #376C12;">{{ this.itemLister[0].name }}</span>
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
            <div id="trade" v-if="this.item[0].tradeable==1" style="display:flex;">
                <div style="margin-left:415px;">
                    <p style="font-size:23px;">This item is up for trade</p>
                </div>
                <div style="margin-top:10px;">
                    <img class="trade-indicator" src="https://i.postimg.cc/jSVLLXFY/Green-Sign.png" @click="goToChatList">
                </div>
            </div>
            <div id="trade" v-else style="display:flex;">
                <div style="margin-left:397px;">
                    <p style="font-size:23px;">This item is not up for trade</p>
                </div>
                <div style="margin-top:10px;">
                    <img class="trade-indicator" src="https://i.postimg.cc/jj3WdbVZ/Red-Sign.png" @click="goToChatList">
                </div>
            </div>
            <button class="buttons" v-if="this.userID != this.currentUser.uid" @click="goToLister"><b>See lister's profile</b></button>
            <button class="buttons" v-if="this.userID != this.currentUser.uid && this.wishlist == 1" @click="removeFromWishlist"><b>Remove from Wishlist</b></button>
            <button class="buttons" v-if="this.userID != this.currentUser.uid && this.wishlist == 0" @click="addToWishlist"><b>Add To Wishlist!</b></button>
            <button class="buttonss" v-if="this.userID == this.currentUser.uid" @click="edit"><b>Edit your item!</b></button>
            <br>
            <button class="buttonss" style="width:400px; padding:10px 10px;" id="chat" v-if="this.userID != this.currentUser.uid" @click="goToChat"><b>Send the lister a message!</b></button>
        </div>
        <div class="item-image">
            <img :src="this.item[0].imageRef" contain>
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
            db.collection('marketplace').where('user', '==', this.userID).where('count', '==', this.count).get()
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
                    this.wishlist = 1; //else it is in the wishlist
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
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                    alert("Item successfully removed")
                    this.$router.push('/wishlist')
                });
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
#lister-name{
    margin-left: 35px;
    margin-top: 7px;
}
.item-information{
    width: 60%;
}
.item-image img{
    height:500px;
    width:500px;
    border: 7px solid #D3EAC1;
    outline: 5px solid #595343;
}
input{
    padding: 12px 20px;
    font-weight: bold;
    font-size: 18px;
}
#name{
    width: 560px;
}

textarea{
    padding: 12px 20px;
    font-weight: bold;
    font-size: 18px;
}
.buttons{
    background: #989388;
    border:solid 3px black;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    color: black;
    width: 270px;
    margin: 10px;
    padding: 10px 10px;
    font-size: 25px;
    cursor: pointer;
}
.buttonss{
    background: black;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    color: white;
    width: 250px;
    margin: 10px;
    padding: 10px 10px;
    font-size: 25px;
    cursor: pointer;
}
#chat{
    background:#376C12;
    width: 280px;
    color:white;
}
.profile-img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: solid 5px #376C12;
    margin-left:225px;
}
.trade-indicator{
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-left: 15px;
}

</style>