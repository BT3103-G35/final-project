<template>
    <div class="edititem-container">
        <div class="edit-item" v-if="this.deleted==0">
            <!-- upload v-on:upload="onUpload"></upload -->
            <img :src="this.item[0].imageRef" contain height="400px" width="400px">
            <br><br><br>
            <form @submit.prevent="pressed">
                <label for="name">Name*:</label><br>
                <input type="text" id="name" name="name" size="64" v-model="newName" required><br><br>
                <label for="detail">Details*:</label><br>
                <textarea name="detail" rows="3" cols="60" v-model="newDetail" required></textarea><br><br>
                <label for="notes">Notes*:</label><br>
                <textarea name="notes" rows="6" cols="60" v-model="newNotes" required></textarea><br><br>
                <button id="submit" class="button" type="submit">I am happy with my changes!</button>
            </form>
                <button id="remove" class="button" @click="remove()">Remove Item</button>
                <button id="backToProfile1" class="button" @click="redirect()">Back to my profile</button>
        </div>
        <div class="nothing-to-see-here" v-if="this.deleted==1">
            <img src=https://i.postimg.cc/Qtnx6GY1/no-image-available.jpg>
            <br><br><br>
            <button id="backToProfile2" @click="redirect()">Back to my profile</button>
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
            
            /*var nameArray = this.newName.split(" ");
            nameArray.push(this.newName);
            this.nameKeys = nameArray;
            
            var detailArray = this.newDetail.split(" ");
            detailArray.push(this.newDetail);
            this.detailKeys = detailArray; 
            
            var notesArray = this.newNotes.split(" ");
            notesArray.push(this.newNotes);
            this.notesKeys = notesArray;*/
            
            db.collection('marketplace').where('user', '==', this.userID).where('count', '==', this.count).get()
            .then((query) => {
                const result = query.docs[0];
                result.ref.update({
                    name: this.newName,
                    detail: this.newDetail,
                    notes: this.newNotes,
                    //nameKeywords: this.nameKeys,
                    //detailsKeywords: this.detailKeys,
                    //notesKeywords: this.notesKeys
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
            })
            alert("Your changes have been applied!")
        },
                
        remove(){
            var answer=confirm("Are you sure you want to delete this item?");
            if (answer) {
                var db = firebase.firestore();
                let collectionRef = db.collection('marketplace');
                collectionRef.where('user', '==', this.userID).where('count', '==', this.count).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                        var pictureRef = firebase.storage().refFromURL(this.item[0].imageRef);
                        pictureRef.delete();
                    })
                })
                alert("Item successfully deleted");
                this.deleted=1;
            } else {
                alert("Your item has not been deleted");
            }
        },
        redirect() {
            window.location.href="/profile";
        }
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
            item: [],
            deleted: 0,
            //nameKeys: [],
            //detailKeys: [],
            //notesKeys: []
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
.edititem-container{
    align-content:center;
    font-size: 20px;
    margin-left: 160px;
    justify-content: space-between;
    height: 1100px;
}
.edit-item{
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
    font-size: 20px;
    cursor: pointer;
}
#submit{
    height:58px;
}
#remove{
    height:38px;
}
#backToProfile1{
    height:38px;
}
#backToProfile2{
    width:300px;
    height:80px;
    font-size:30px;
}
.button{
    display:inline-block;
    margin: 20px;
    width: 275px;
}
ul{
    columns:2;
}
.nothing-to-see-here{
    margin-right: 150px;
    margin-top: 50px;
}
input{
    font-size: 20px;
}
textarea{
    font-size: 20px;
}
</style>