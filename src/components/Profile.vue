<template>
    <div class="profile-container">
        <div class="profile-info">
            <div class="profile-name">
                <img src="https://i.postimg.cc/yNMnZJp9/blank-profile-picture-973460-1280-1.png">
                <div id="displayName">{{this.currentUser.displayName}}</div>
            </div>
            <div class="bells">
                <!--
                <img id="image1" src="https://i.postimg.cc/259ychNb/Bell.png" onclick="Notify()">
                <img src="https://i.postimg.cc/HWynzrZn/No-Bell.png">
                <button onclick="document.getElementById('image1').src = 'https://i.postimg.cc/C5qgg1K7/No-Bell-blue.png'">click</button>
                -->
                <input id="image1" type="image" src="https://i.postimg.cc/259ychNb/Bell.png" onclick="document.getElementById('image1').src = 'https://i.postimg.cc/d1s5KtqC/Bell-blue.png'; document.getElementById('image2').src = 'https://i.postimg.cc/HWynzrZn/No-Bell.png'">
                <input id="image2" type="image" src="https://i.postimg.cc/HWynzrZn/No-Bell.png" onclick="document.getElementById('image2').src = 'https://i.postimg.cc/C5qgg1K7/No-Bell-blue.png'; document.getElementById('image1').src = 'https://i.postimg.cc/259ychNb/Bell.png'">
            </div>
            <div class="num-items">
                <h1>You Currently Have:</h1>
            </div>
    
        </div>
        <div class="add-item">
            <h1>Oh no...</h1>
            <h1>It seems you<br>have no items...</h1>
            <router-link to="/additem" exact><button id="button-community">Add Items!</button></router-link>
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
button-community{
  font-size: 30px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: #EC6041;
  box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
  padding: 20px 24px;
  cursor: pointer;
}
image{
    width: 100px;
    height: auto;
    border-radius: 50%;
}
img{
    width: 100px;
    height: auto;
    border-radius: 50%;
}
input{
    width: 50px;
    height: auto;
    padding: 15px;
}
.num-items h1{
    font-size: 40px;
}
.profile-name{
    padding: 50px;
}
#displayName{
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-weight: bold;
    font-size: 20px;
}
</style>