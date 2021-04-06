<template>
    <div class="item-container">

        <div class="item-information">
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" size="60" :value=this.item[0].name :readonly="true"><br><br>
            <label for="detail">Details:</label><br>
            <textarea name="detail" rows="3" cols="60" :value=this.item[0].detail :readonly="true"></textarea><br><br>
            <label for="notes">Notes:</label><br>
            <textarea name="notes" rows="6" cols="60" :value=this.item[0].notes :readonly="true"></textarea><br><br>
            <button>ADD TO WISHLIST</button>
        </div>

        <div class="item-image">
            <!-- img :src="this.item[0].imageRef" -->
            <img src="https://m.media-amazon.com/images/M/MV5BMTc0NTUwMTU5OV5BMl5BanBnXkFtZTcwNjAwNzQzMw@@._V1_UY1200_CR91,0,630,1200_AL_.jpg">
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
                    this.currentUser = firebase.auth().currentUser.email;
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
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            userID: this.$route.query.user,
            count: parseInt(this.$route.query.count),
            item: []

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
    font-size: 15px;
}

textarea{
    padding: 12px 20px;
    font-weight: bold;
    font-size: 15px;
}
button{
    background: #EC6041;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
    color: white;
    width: 450px;
    padding: 14px 30px;
    font-size: 20px;
}
</style>