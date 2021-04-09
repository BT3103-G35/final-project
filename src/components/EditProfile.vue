<template>
    <div class="edit-profile-container">
        <div class="edit-profile-pic">
            <h2>Profile Picture</h2>
            <div class="profile-pic" v-if="this.imgUrl==false">
                <img src="https://i.postimg.cc/yNMnZJp9/blank-profile-picture-973460-1280-1.png">
            </div>
            <div class="profile-pic" v-else>
                <img :src="this.imgUrl">
            </div>
            <button @click="trigger">Change Profile Picture</button>
            <input type="file" ref="fileInput" @change="onFileChange($event)" v-show="false">
        </div>
        <div class="edit-profile-info">
            <h2>User Name</h2>
            <h3>Current name: {{ this.currentUser.displayName }}</h3>
            New name: <input type="text" v-model="newName" required><br><br><br>
            <button @click="changeName">Change user name</button>
        </div>
        <div class="change-password">
            <h2>Password</h2>
            New password: <input type="password" v-model="newPassword" required><br><br>
            Retype password: <input type="password" v-model="newPassword2" required><br><br><br>
            <button @click="changePassword">Change password</button>
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
                    this.fetchProfilePic()
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
        fetchProfilePic() {
            firebase.auth().onAuthStateChanged(user => {
                if (user){
                    firebase.storage().ref('users/' + user.uid + '/profile.jpg').getDownloadURL()
                    .then(imgUrl => this.imgUrl = imgUrl)
                    .catch(this.imgUrl = false)
                }
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
            var storageRef = firebase.storage().ref('users/' + this.currentUser.uid + '/profile.jpg');
            storageRef.put(this.imageFile);
            location.reload();
        },
        changeName() {
            // Update user name in community database
            var database = firebase.firestore();
            database.collection("community").doc(this.currentUser.uid).update({
                name: this.newName
            })
            // Update user name in firebase auth
            this.currentUser.updateProfile({
                displayName: this.newName
            }).then(() => location.reload())
        },
        passwordMatch() {
            if (this.newPassword != this.newPassword2) {
                alert("Passwords do not match!")
                location.reload()
            } else {
                this.pwMatch = true;
            }
        },
        changePassword() {
            this.passwordMatch();
            if (this.pwMatch) {
                this.currentUser.updatePassword(this.newPassword).then(() => {
                    alert("Password successfully changed")
                    location.reload()
                }).catch((err) => console.log(err))
            }
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            imgUrl: false,
            image: false,
            imageFile: false,
            newName: '',
            newEmail: '',
            newPassword: '',
            newPassword2: '',
            pwMatch: false,
        }
    },
}
</script>

<style scoped>
img{
    width: 300px;
    height: 300px;
    border-radius: 50%;
}
button{
    display:inline-block;
    height: 40px;
    width: 200px;
    font-size: 15px;
    background-color: #EC6041;
    color: white;
    background: #EC6041;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
    cursor:pointer;
}
.edit-profile-container{
    width: 100%;
}
h2{
    text-decoration: underline #EC6041;
}
.edit-profile-pic{
    float:left;
    width: 20%;
    padding-left: 10%;
    padding-top: 4%;
    margin-right: 10%;
}
.edit-profile-info{
    float:left;
    width: 20%;
    text-align: left;
    padding-top: 4%;
    margin-right: 10%;
}
.change-password{
    float:left;
    width: 20%;
    text-align: left;
    padding-top: 4%;
}
</style>
