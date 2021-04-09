<template>
    <div class="edit-profile-pic-container">
        <div class="profile-pic" v-if="this.imgUrl==false">
            <img src="https://i.postimg.cc/yNMnZJp9/blank-profile-picture-973460-1280-1.png">
        </div>
        <div class="profile-pic" v-else>
            <img :src="this.imgUrl">
        </div>
        <button @click="trigger">Change Profile Picture</button>
        <button>Remove Profile Picture</button>
        <input type="file" ref="fileInput" @change="onFileChange($event)" v-show="false">
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
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            imgUrl: false,
            image: false,
            imageFile: false,
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
</style>
