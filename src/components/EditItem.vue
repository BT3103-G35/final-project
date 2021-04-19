<template>
    <div class="edititem-container">
        <div class="edit-item" v-if="this.deleted==0">
            <img :src="this.item[0].imageRef" contain alt="Please refresh page if image does not appear">
            <br><br>
            <button class="edit-img" @click="trigger">Change Image</button>
            <input type="file" ref="fileInput" @change="onFileChange($event)" v-show="false">
            <br><br><br>
            <form @submit.prevent="pressed">
                <label for="name"><b>Name*:</b></label><br>
                <input type="text" id="name" name="name" size="63" v-model="newName" required><br><br>
                <label for="detail"><b>Details*:</b></label><br>
                <textarea name="detail" rows="3" cols="60" v-model="newDetail" required></textarea><br><br>
                <label for="notes"><b>Notes*:</b></label><br>
                <textarea name="notes" rows="6" cols="60" v-model="newNotes" required></textarea><br><br>
                <input type="radio" id="trade" name="trade" value=1 v-model="newTrade">
                <label for="trade">Up For Trade</label>
                <input type="radio" id="notrade" name="trade" value=0 v-model="newTrade">
                <label for="notrade">Not Up For Trade</label>
                <br><br>
                <button id="submit" class="button" type="submit"><b>I am happy with my changes!</b></button>
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
            }).then(() => {
                this.newName=this.item[0].name;
                this.newDetail=this.item[0].detail;
                this.newNotes=this.item[0].notes;
                this.newTrade=this.item[0].tradeable;
                this.filename = this.item[0].filename;
            })
        },
        trigger() {
            this.$refs.fileInput.click()
        },
        onFileChange(e) {
            let file = e.target.files[0];
                this.imageFile = file;
                this.createImage(file);
        },
        createImage(file) {
            var reader = new FileReader();
            reader.onload = (e) => {
                this.image = e.target.result;
            };
            reader.readAsDataURL(file);
            this.uploadImage();
        },
        uploadImage() {
            var pictureRef = firebase.storage().refFromURL(this.item[0].imageRef);
            pictureRef.delete();
            var storageRef = firebase.storage().ref('uploads/' + this.currentUser.uid + '/' + this.filename);
            storageRef.put(this.imageFile);
            location.reload();
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
                    tradeable: this.newTrade
                });
            });

            db.collection(this.userID).where('user', '==', this.userID).where('count', '==', this.count).get()
            .then((query) => {
                const result = query.docs[0];
                result.ref.update({
                    name: this.newName,
                    detail: this.newDetail,
                    notes: this.newNotes,
                    tradeable: this.newTrade
                });
            });
            alert("Your changes have been applied!");
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
                    });
                });
                let collectionRef2 = db.collection(this.currentUser.uid);
                collectionRef2.where('count', '==', this.count).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });
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
            newTrade: 0,
            userID: this.$route.query.user,
            count: parseInt(this.$route.query.count),
            item: [],
            deleted: 0,
            filename: ''
        }
    },
}
</script>

<style scoped>
.edititem-container{
    align-content:center;
    font-size: 15px;
    margin-left: 160px;
    justify-content: space-between;
    height: 800px;
}
.edit-item{
    margin-right: 150px;
    margin-top: 50px;
}
.search-bar{
    margin-left: 250px;
}
button{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 15px;
    color:white;
    cursor: pointer;    display:inline-block;

}
#submit{
    width: 250px;
    height:40px;
    background: black;
    border: solid 3px #37601B;
    box-shadow: 3px 3px 0px #507B2E, 5px 5px 0px #6B8B51;
}
#remove{
    height:40px;
    background: #37601B;
    border: solid 3px black;
}
#backToProfile1{
    height:38px;
    background: #37601B;
    border: solid 3px black;
}
#backToProfile2{
    width:200px;
    height:80px;
    font-size:15px;
    color: #37601B;
}
.button{
    display:inline-block;
    margin: 15px;
    width: 200px;
}
.nothing-to-see-here{
    margin-right: 150px;
    margin-top: 50px;
}
input{
    font-size: 15px;
}
textarea{
    font-size: 15px;
}
.edit-img{
    background: black;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    width:170px;
    height:30px;
    font-size:18px;
    cursor:pointer;
    display:inline-block;
    margin: 3px;
    border: solid 3px #37601B;
    box-shadow: 3px 3px 0px #507B2E, 5px 5px 0px #6B8B51;
}
label{
    font-weight:bold;
    font-size: 15px;
}
img{
    height:250px;
    width:250px;
    border: 5px solid #376C12;
}
</style>