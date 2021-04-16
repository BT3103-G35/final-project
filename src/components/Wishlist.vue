<template>
    <div>
        <div class="my-wishlist">
            <h1> My Wishlist </h1>
        </div>
        <div class="wishlist-container">
            <div class="wishlist-item" v-if="items.length!=0">
                <ul>
                    <li v-for="item in items" v-bind:key="item.index">
                        <img @click="redirect(item)" :src="item.data().imageRef">
                        <p>Name: {{ item.data().name }}</p>
                        <p>Details: {{ item.data().detail }}</p>
                        <p>Notes: {{ item.data().notes }}</p>
                        <button @click="redirect(item)">Go to item</button>
                    </li>
                </ul>
            </div>
            <div id="empty-wishlist" v-else>
                <p class="empty-text"><b>Your WishList is </b></p>
                <p class="empty-text"><b>Empty...</b></p>
            </div>
            <div class="marketplace-text1" v-if="items.length==0">
                <h2>WANT MORE ITEMS?</h2>
                <br>
                <h3>GO TO DISCOVER OR SIMPLY WISH</h3> <h3>FOR MORE!</h3>
                <br><br><br>
                <router-link to="/marketplace" tag="button-marketplace" exact><b>WISHING FOR MORE?</b></router-link>
            </div>
            <div class="marketplace-text2" v-if="items.length!=0">
                <h2>WANT MORE ITEMS?</h2>
                <br>
                <h3>GO TO DISCOVER OR SIMPLY WISH</h3> <h3>FOR MORE!</h3>
                <br><br><br>
                <router-link to="/marketplace" tag="button-marketplace" exact><b>WISHING FOR MORE?</b></router-link>
            </div>
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
                    this.fetchItems();

                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
        fetchItems() {
            var db = firebase.firestore();
            db.collection(this.currentUser.uid).where('wishlist', '==', true).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection('marketplace').where('user', '==', doc.data().user).where('count', '==', parseInt(doc.data().count)).get()
                    .then((query) => {
                        if (query.docs.length!=0){
                            const result = query.docs[0];
                            this.items.push(result);
                        }
                    });
                });
            });
        },
        redirect(item){
            window.location.href="/item?user=" + item.data().user + "&count=" + item.data().count;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wishlist-container{
    display: flex;
    margin-top: 100px;
}
.my-wishlist{
    text-align: center;
    margin-top: 70px;
}
.wishlist-item{
    width: 60%;
    margin-left: 150px;
}
ul{
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
}
li{
    margin: 30px;
}
.empty-text{
    font-size: 50px;
}
#empty-wishlist{
    margin-left: 150px;
    width:40%
}
.marketplace-text1{
    width: 35%;
    margin-right:20px;
}
.marketplace-text2{
    width: 35%;
    margin-right:20px;
    background-color:#F8EED6;
    border: 5px solid #376C12;
    height:373px;
}
h1{
    text-decoration: underline #376C12;
    font-size: 70px;
    text-align: center;
}
h2{
    font-size:38px;
}
h3{
    font-size:20px;
}
button-marketplace {
    font-size: 20px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: black;
    background: #AED191;
    border: 5px solid #376C12;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    padding: 20px 24px;
    cursor: pointer;
}
button{
    background: #3F3726;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    width: 150px;
    font-size: 20px;
    cursor: pointer;
    border: 3px solid black;
}
img{
    height:200px;
    width:200px;
    cursor: pointer;
}
</style>
