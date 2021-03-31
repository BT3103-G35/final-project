<template>
    <div>
        <div class="my-wishlist">
            <h1> My Wishlist </h1>
        </div>
        <div class="wishlist-container">
            <div class="wishlist-item">
                <h2>placeholder</h2>
            </div>
            <div class="marketplace-text">
                <h2>WANT MORE ITEMS?</h2>
                <br>
                <h3>GO TO OUR MARKETPLACE OR SIMPLY WISH</h3> <br> <h3>FOR MORE!</h3>
                <br><br><br>
                <router-link to="/additem" tag="button-wishing-for-more" exact>WISHING FOR MORE?</router-link>
            </div>
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
                    var listRef = firebase.storage().ref('uploads/' + this.currentUser.uid);
                    listRef.listAll().then((res) => {
                        res.items.forEach((itemRef) => {
                            itemRef.getDownloadURL().then((url) => this.items.push(url))
                        }
                    )})
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
        remove(item){
            var pictureRef = firebase.storage().refFromURL(item);
            pictureRef.delete().then(()=> location.reload());
            //alert("Item removed successfully")
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

</style>
