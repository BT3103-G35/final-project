<template>
    <div class="edit-profile-container">
        <div class="edit-profile-pic">
            <h3>Profile Picture</h3>
            <img :src="this.imgUrl">
            <br><br>
            <button style="width:200px;" @click="trigger">Change Profile Picture</button>
            <input type="file" ref="fileInput" @change="onFileChange($event)" v-show="false">
        </div>
        <div class="edit-profile-info">
            <h3>User Details</h3>
            <h3>Current name: {{ this.currentUser.displayName }}</h3>
            New name: <input type="text" v-model="newName" required><br><br><br>
            <h3>Gender: {{ this.gender }}</h3>
            <input type="radio" id="Male" value="Male" name="gender" v-model="newGender" required>
            <label>Male</label><br>
            <input type="radio" id="Female" value="Female" name="gender" v-model="newGender">
            <label>Female</label><br>
            <input type="radio" id="Others" value="Others" name="gender" v-model="newGender">
            <label>Others</label>
            <br><br>
            <button @click="updateDetails">Update user details</button>
        </div>
        <div class="change-password">
            <h3>Password</h3>
            <label for="password">Current password:</label><br>
            <input name="password" type="password" v-model="currentPassword" minlength="6" required><br><br>
            <label for="newpw">Enter new password:</label><br>
            <input name="newpw" type="password" v-model="newPassword" minlength="6" required><br><br>
            <label for="retype">Re-type new password:</label><br>
            <input name="retype" type="password" v-model="newPassword2" minlength="6" required><br><br>
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
                    this.fetchGender()
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
        fetchGender() {
            firebase.auth().onAuthStateChanged(user => {
                if (user){
                    firebase.firestore().collection('gender').doc(this.currentUser.uid).get().then((doc)=>{
                        this.gender = doc.data().gender;
                    })
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
            var pictureRef = firebase.storage().refFromURL(this.imgUrl);
            pictureRef.delete();
            var storageRef = firebase.storage().ref('users/' + this.currentUser.uid + '/profile.jpg');
            storageRef.put(this.imageFile);
            location.reload();
        },
        updateDetails() {
            var database = firebase.firestore();
            if (this.newName) {
                // Update user name in community database
                database.collection("community").doc(this.currentUser.uid).update({
                    name: this.newName
                })
                // Update user name in firebase auth
                this.currentUser.updateProfile({
                    displayName: this.newName
                }).then(() => location.reload())
            }
            if (this.newGender) {
                database.collection("gender").doc(this.currentUser.uid).update({
                    gender: this.newGender
                }).then(() => location.reload())
            }
        },
        passwordMatch() {
            if (this.newPassword != this.newPassword2) {
                alert("New passwords do not match!");
                this.pwMatch = false;
                location.reload();
            } else {
                this.pwMatch = true;
            }
        },
        changePassword() {
            //Reauthenticate user 
            if (this.currentPassword != this.newPassword){
                const user = this.currentUser;
                const credential = firebase.auth.EmailAuthProvider.credential(
                    user.email, 
                    this.currentPassword
                );
                user.reauthenticateWithCredential(credential).then(() => {
                    console.log("reauthentication success");
                    //Make sure new passwords match
                    this.passwordMatch()
                    if (this.pwMatch) {
                        //Change password
                        if (this.newPassword.length > 5){
                            user.updatePassword(this.newPassword).then(() => {
                                alert("Password successfully changed")
                                location.reload()
                            }).catch((err) => {
                                console.log(err);
                            })
                        }else{
                            alert("Password needs to be more than 5 characters")
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                    alert("Current password is incorrect")
                })
            }else{
                if (!this.pwMatch){
                    alert("Current password is incorrect")
                }else{
                    alert("New password cannot be the same as old password");
                }
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
            currentPassword: '',
            newPassword: '',
            newPassword2: '',
            pwMatch: false,
            gender: '',
            newGender: '',
        }
    },
}
</script>

<style scoped>
img{
    width: 200px;
    height: 200px;
    border-radius: 50%;
}
#id{
    text-decoration: underline #37601B;
}
button{
    display:inline-block;
    height: 35px;
    width: 150px;
    font-size: 15px;
    color: white;
    background: black;
    border: solid 3px #37601B;
    box-shadow: 2px 2px 0px #507B2E, 4px 4px 0px #6B8B51;
    cursor:pointer;
}
.edit-profile-container{
    font-size: 18px;
}
input{
    font-size: 18px;
}
h2{
    text-decoration: underline #37601B;
}
.edit-profile-pic{
    float:left;
    width: 20%;
    padding-left: 9%;
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
    width: 30%;
    text-align: left;
    padding-top: 4%;
}
p{
    font-size: 16px;
}
</style>
