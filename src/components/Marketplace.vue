<template>
    <div class="marketplace-container">
        <div class="marketplace-title">
            <h1> Discover </h1>
            <div class="search-options" v-if="this.filter == false">
                <h2> Search by which field? </h2>
                <input type="radio" id="name" name="search" value="name" v-on:click="searchFilter('name')">
                <label for="name">Name</label>
                <input type="radio" id="category" name="search" value="category" v-on:click="searchFilter('category')">
                <label for="category">Category</label>
                <input type="radio" id="details" name="search" value="details" v-on:click="searchFilter('detail')">
                <label for="details">Details</label>
                <input type="radio" id="notes" name="search" value="notes" v-on:click="searchFilter('notes')">
                <label for="notes">Notes</label>
                <input type="radio" id="tradeable" name="search" value="tradeable" v-on:click="filterTradeNow()">
                <label for="tradeable">Up-For-Trade</label>
                <button @click="removeFilter" type="submit" v-if="this.searched==true">Remove filter</button>
            </div>
            <div class="search-bar" v-if="this.filter == true && this.filterChoice != 'category'">
                <input class="input-search" type="text" :placeholder="'Search by ' + this.filterChoice + '...'" v-model="searchWord" name="search">
                <button @click="search" type="submit">Search</button>
                <button @click="back" type="submit">Back</button>
            </div>
            <div class="dropdown-menu" v-if="this.filter == true && this.filterChoice == 'category'">
                <select v-model="chosenCategory">
                    <option disabled value="">Choose a category</option>
                    <option>top</option>
                    <option>bottom</option>
                    <option>outerwear</option>
                    <option>footwear</option>
                    <option>dress</option>
                    <option>headwear</option>
                    <option>accessory</option>
                    <option>others</option>
                </select>
                <button @click="categorize()" type="submit">Search</button>
                <button @click="back" type="submit">Back</button>
            </div>
        </div>
        <div class="marketplace-container" v-if="this.searched==false && this.categorized==false">
            <ul> 
                <li v-for="(item, index) in this.items1" v-bind:key="index">
                    <a v-on:click="redirect(item.user, item.count)"> 
                        <img :src="item.imageRef">
                        <p>Name: {{ item.name }}</p>
                        <p>Category: {{ item.category }}</p>
                        <p>Details: {{ item.detail }}</p>
                        <p>Notes: {{ item.notes }}</p>
                    </a>
                </li>
            </ul>
        </div>
        <div class="marketplace-container" v-else>
            <div v-if="this.searchedItems.length==0">
                <br><h3>Your search did not match any item.</h3><br>
            </div>
            <div v-else>
                <br><h4 class="item-count">{{ this.searchedItems.length }} item/s found</h4>
                <ul> 
                    <li v-for="(item, index) in this.searchedItems" v-bind:key="index">
                        <a v-on:click="redirect(item.user, item.count)"> 
                            <img :src="item.imageRef">
                            <p>Name: {{ item.name }}</p>
                            <p>Category: {{ item.category }}</p>
                            <p>Details: {{ item.detail }}</p>
                            <p>Notes: {{ item.notes }}</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

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
                        })
                    })
                })
            });             
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items.push(doc.data()))
            });
            
            db.collection('marketplace').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items1.push(doc.data()))
            })
        },
        redirect(user, count){
            window.location.href="/item?user=" + user + "&count=" + count;
        },
        searchFilter(choice){
            this.filter = true;
            this.filterChoice = choice;
        },
        search(){
            this.searchedItems= []; //clear the previous search returns
            this.searched=true; //indicate that the user has already searched for something so dont show default marketplace
            for (var item of this.items1){ //items1 contains all the 
                if(item[this.filterChoice].toUpperCase().includes(this.searchWord.toUpperCase())){
                    this.searchedItems.push(item);
                }
            }
        },
        filterTradeNow(){
            this.searchedItems= [];
            this.searched = true;
            var db = firebase.firestore();
            db.collection('marketplace').where('tradeable', '==', 1).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.searchedItems.push(doc.data()))
            });
        },
        categorize(){
            this.searchedItems= []; 
            this.categorized=true;
            var db = firebase.firestore();
            db.collection('marketplace').where('category', '==', this.chosenCategory).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.searchedItems.push(doc.data()));
            });
        },
        back(){
            this.filter = false;
            this.searched = false;
            this.categorized = false;
            this.searchWord='';
        },
        removeFilter(){
            this.filter = false;
            this.searched = false;
            this.categorized = false;
            this.searchWord='';
            location.reload();
        }
    },

    data(){
        return {
            loggedIn: false,
            currentUser: false,
            items: [], // item details
            items1: [],
            filter: false,
            filterChoice: '',
            searchWord:'',
            searched: false,
            searchedItems: [],
            categorized: false,
            chosenCategory: '',
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{
    text-decoration: underline #376C12;
    font-size: 70px;
    text-align: center;
}
ul{
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
}
li {
    margin: 30px;
}
img{
    width: 300px;
    height: 300px;
    border-radius: 0%;
    cursor: pointer;
    border: 5px solid #D6CAAC;
    object-fit: cover;
}
.input-search{
    width:400px;
    height:30px;
    font-size:20px;
}
button{
    height:33px;
    font-size:20px;
}
#name, #details, #notes{
    display:inline-block;
}
p{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    max-width: 300px;

}
label, input{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 22px;
    margin: 0 5px 0 5px;
}
select{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 22px;
}
</style>