<template>
    <div class=wishlist-container>
        <h1> My Wishlist </h1>
        <br>
        <div class="wishlist-inner-container">
            <div class="wishlist-item-info" v-if="items.length!=0">
                <ul>
                    <li v-for="item in items" v-bind:key="item.index">
                        <img @click="redirect(item)" :src="item.data().imageRef">
                        <p class="info">Name: {{ item.data().name }}</p>
                        <p class="info">Details: {{ item.data().detail }}</p>
                        <p class="info">Notes: {{ item.data().notes }}</p>
                        <button class="item" @click="redirect(item)">Go to item</button>
                    </li>
                </ul>
            </div>
            <div id="empty-wishlist" v-else>
                <h2 class="empty-text">Your WishList is</h2>
                <h2 class="empty-text">Empty...</h2>
            </div>
            <div class="marketplace-text1" v-if="items.length==0">
                <h2>WANT MORE ITEMS?</h2>
                <br>
                <h3>GO TO DISCOVER OR SIMPLY WISH</h3> <h3>FOR MORE!</h3>
                <br><br><br>
                <router-link to="/discover" tag="button-marketplace1" exact><b>WISHING FOR MORE?</b></router-link>
            </div>
            <div class="marketplace-text2" v-if="items.length!=0">
                <h2>WANT MORE ITEMS?</h2>
                <br>
                <h3>GO TO DISCOVER OR SIMPLY WISH</h3> <h3>FOR MORE!</h3>
                <br>
                <router-link to="/discover" tag="button-marketplace2" exact><b>WISHING FOR MORE?</b></router-link>
                <img class="tree-img" src="https://i.postimg.cc/ydxRSfkr/Tree-4.png">
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
.wishlist-inner-container{
    display: flex;
}
h1{
    text-decoration: underline #376C12;
    font-size: 45px;
    text-align: center;
}
.wishlist-item-info{
    width:70%;
}
ul{
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
}
li{
    padding:8px;
}
img{
    height:180px;
    width:180px;
    cursor: pointer;
    margin-right:50px;
}
p{
    text-align: left;
    font-size: 12px;
    font-family: Helvetica, sans-serif;
    font-weight:bold;
    line-height: 200%;
    width: 180px;
}
.item{
    margin-right:110px;
    width:130px;
}
#empty-wishlist{
    margin-left: 150px;
    width:40%;
    margin-top: 40px;
}
.marketplace-text1{
    width: 38%;
    margin-right:25px;
    margin-top: 40px;
}
.marketplace-text2{
    background-color:#F7FFF4;
    border: 5px solid #376C12;
    height:420px;
    width:390px;
    font-size:25px;
    margin-right: 30px;
}
h2{
    font-size:25px;
}
h3{
    font-size:18px;
}
button-marketplace1 {
    font-size: 20px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: black;
    background: #AED191;
    border: 5px solid #376C12;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    padding: 15px 20px;
    cursor: pointer;
}
button-marketplace2 {
    font-size: 15px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: black;
    background: #AED191;
    border: 5px solid #376C12;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    padding: 15px 20px;
    cursor: pointer;

}
button{
    background: #3F3726;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    width: 150px;
    font-size: 15px;
    cursor: pointer;
    border: 3px solid black;
}
.tree-img{
    float:right;
    height:150px;
    width:300px;
    margin-bottom: 100px;
    margin-left:50px;
}
</style>
