<template>
    <div class="additems-container">
        <div class="upload-image">
            <!-- upload v-on:upload="onUpload"></upload -->
            <img :src="this.item[0].imageRef" contain height="400px" width="400px">
            <br><br><br>
            <form @submit.prevent="pressed">
                <label for="name">Name*:</label><br>
                <input type="text" id="name" name="name" size="60" v-model="newName" required><br><br>
                <label for="detail">Details*:</label><br>
                <textarea name="detail" rows="3" cols="60" v-model="newDetail" required></textarea><br><br>
                <label for="notes">Notes*:</label><br>
                <textarea name="notes" rows="6" cols="60" v-model="newNotes" required></textarea><br><br>
                <button type="submit">Confirm changes</button>
            </form>
            <button @click="remove()">Remove</button>

    
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
//import upload from "./Upload.vue"
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
            }).then(() => {
                this.newName=this.item[0].name;
                this.newDetail=this.item[0].detail;
                this.newNotes=this.item[0].notes;
            })
        },
        onUpload(image) {
            this.image = image;
        },
        pressed() {
            var db = firebase.firestore();
            db.collection('marketplace').where('user', '==', this.userID).where('count', '==', this.count).get()
            .then((query) => {
                const result = query.docs[0];
                result.ref.update({
                    name: this.newName,
                    detail: this.newDetail,
                    notes: this.newNotes,
                    //imageRef: 'uploads/'+this.currentUser.uid+'/' + this.image,
                })
            });
            db.collection(this.userID).where('count', '==', this.count).get()
            .then((query) => {
                const result = query.docs[0];
                result.ref.update({
                    name: this.newName,
                    detail: this.newDetail,
                    notes: this.newNotes,
                    //imageRef: 'uploads/'+this.currentUser.uid+'/' + this.image,
                })
            }).then(() => this.$router.push('/profile'));
        },
                
        remove(){
            var answer=confirm("Are you sure you want to delete this item?");
            if (answer) {
                var db = firebase.firestore();
                let collectionRef = db.collection('marketplace');
                console.log(this.userID);
                console.log(this.count);
                collectionRef.where('user', '==', this.userID).where('count', '==', this.count).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                        var pictureRef = firebase.storage().refFromURL(this.item[0].imageRef);
                        pictureRef.delete();
                    })
                })
                alert("Item successfully deleted");
                window.location.href="/profile";
            } else {
                alert("Your item has not been deleted");
            }
        },
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            newName: '',
            newDetail: '',
            newNotes: '',
            userID: this.$route.query.user,
            count: parseInt(this.$route.query.count),
            item: []
        }
    },
    /*components:{
        upload
    }*/
}
</script>

<style scoped>
h1{
    text-decoration: underline #EC6041;
    font-size: 30px;
    margin-left: 70px;
}
.additems-container{
    display:flex;
    justify-content: space-between;
    margin-left: 160px;
}
.upload-image{
    margin-right: 150px;
    margin-top: 50px;
}

.search-bar{
    margin-left: 250px;
}
button{
    background: #EC6041;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
    color: white;
    width: 450px;
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
</style>