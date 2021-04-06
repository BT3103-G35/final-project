<template>
    <div>
        <div class="item-container">
            <div class="item-info">
                <p> Name* </p>
                <div class="boxed">
                    <p>Name: {{ item.data().name }}</p>
                </div>
                <p> Details* </p>
                <div class="boxed">
                    <p>Details: {{ item.data().detail }}</p>
                </div>
                <p> Notes* </p>
                <div class="boxed">
                    <p>Notes: {{ item.data().notes }}</p>
                </div>
                <button @click="remove(item)">Remove</button>
            </div>
        </div>

        <div class="item-pictures">
            <img :src="item.data().imageRef">
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";
export default {
    created() {
        this.setupFirebase();
    },
    methods:{
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    this.loggedIn = true;
                    this.currentUser = firebase.auth().currentUser;
                    // var listRef = firebase.storage().ref('uploads/' + this.currentUser.uid);
                    // listRef.listAll().then((res) => {
                    //     console.log(res)
                    //     res.items.forEach((itemRef) => {
                    //         console.log(itemRef);
                    //         itemRef.getDownloadURL().then((url) => this.items.push(url))
                    //     }
                    // )})
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
            console.log(this.currentUser)
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let imagePath = doc.data().imageRef;
                    console.log(imagePath);
                    storageRef.child(imagePath).getDownloadURL().then((url) => {
                        db.collection(this.currentUser.uid).doc(doc.id).update({
                            imageRef: url
                        })
                    })
                })
            });
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items.push(doc.data()))
            });
            db.collection(this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => this.items1.push(doc))
            })
            console.log(this.items)
        },
        remove(item){
            var db = firebase.firestore();
            var pictureRef = firebase.storage().refFromURL(item.data().imageRef);
            pictureRef.delete().then(()=> location.reload());
            
            //let doc_id = item.target.getAttribute("id");
            //console.log('here' + doc_id)
            db.collection(this.currentUser.uid).doc(item.id).delete().then(function() {
                console.log('doc deleted');
            }).catch(function(error) {
                console.error("error removing: ", error);
            });
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            items: [],
            items1: []
        }
    }
}
</script>

<style scoped>
.boxed {
  border: 1px solid orange ;
}
.profile-info{
    width: 40%;
    margin-left: 100px;
}
.add-item{
    width: 60%;
}
h1{
    font-size: 70px;
}
button{
    height: 40px;
    width: 200px;
    font-size: 20px;
    background-color: #EC6041;
    color: white;
    background: #EC6041;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
}
button-additem{
  font-size: 30px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: #EC6041;
  box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
  padding: 20px 24px;
  cursor: pointer;
}
#displayName{
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-weight: bold;
    font-size: 20px;
}
.item-container{
    width:600px;
    overflow:hidden;
}
.item-info{
    width: 300px;
    float:left; /* add this */
}
.item-pictures{
    width: 300px;
    float:left; /* add this */
}
</style>