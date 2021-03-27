<template>
    <div class="profile-container">
        <div class="profile-info">
            <div class="profile-name">
                <img src="https://i.postimg.cc/yNMnZJp9/blank-profile-picture-973460-1280-1.png">
                {{this.currentUser}}
            </div>
    
        </div>
        <div class="add-item">
            <h1>Oh no...</h1>
            <h1>It seems you<br>have no items...</h1>
            <button>Click to add!</button>
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
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false
        }
    }
}
</script>

<style scoped>
.profile-container{
    display: flex;
    
}
.profile-info{
    width: 40%;
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
img{
    width: 100px;
    height: auto;
    border-radius: 50%;
}

</style>