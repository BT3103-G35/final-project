<template>
    <div class="register-container">
        <div class="wrapper">
            <div class="img">
                <img src="https://i.postimg.cc/3w2jGpJm/wardrobe-half.jpg">
            </div>

            <div class="content">
                <h1>Create a new account</h1>
                <p><strong>There are so many opportunities to make a difference in your wardrobe! Sign up to join us!</strong></p>
                <div v-if="error" class="error">{{error.message}}</div>
                <form @submit.prevent="pressed">
                        <label for="name">Name*:</label><br>
                        <input type="text" id="name" name="name" size="65" v-model="name" required><br><br>
                        <label for="email">Email Address*:</label><br>
                        <input type="email" size="65" v-model="email" required><br><br>
                        <label for="password">Password*:</label><br>
                        <input type="password" size="65" v-model="password" required><br><br>
                        <label for="gender">Gender*: </label>
                        <input type="radio" id="Male" value="Male" name="gender" v-model="gender" required>
                        <label for="details">Male</label>
                        <input type="radio" id="Female" value="Female" name="gender" v-model="gender">
                        <label for="notes">Female</label>
                        <input type="radio" id="Others" value="Others" name="gender" v-model="gender">
                        <label for="tradeable">Others</label>
                        <p>Please upload a profile picture: </p>
                        <input type='file' @change='chooseFile($event)' required>
                        <br>
                        <img :src="this.image" class='ui-image' id='img' v-if="this.image">
                        <br>
                        <button type="submit" id="submit-btn"><b>SIGN UP</b></button>
                </form>

                </div>
            </div>
        </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
    methods: {
        pressed() {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((auth) => {

                firebase.storage().ref('users/' + auth.user.uid + '/profile.jpg').put(this.imageFile).then(function(){
                    console.log('success');
                }).catch(error => {
                    console.log('this ' + error.message)
                })
            
            firebase.auth().currentUser.updateProfile({
                displayName: this.name,
            });

            this.$router.push('/profile');
            })
            .catch(error => (this.error = error));
            alert('loading..')
            //this.addPicToComm();

            var db = firebase.firestore();
            firebase.auth().onAuthStateChanged((user) => {
                db.collection('gender').doc(user.uid).set({
                    gender: this.gender
                })
            })
        },
        chooseFile(e){
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
        },
        removeImage: function () {
            this.image = false; 
            this.imageFile = false;
        }
    },
    data() {
        return {
            name: "",
            email: "",
            password: '',
            error: '',
            image: false,
            imageFile: false,
            //url: false
            gender: false
        }
    }
}
</script>

<style scoped>
.wrapper{
    display: flex;
    align-items: center;
}
img{
    width: 380px;
    height: 400px;
    margin-left: 100px;
    margin-top:30px;
}
h1{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 45px;
    text-decoration: underline #376C12;
    text-align: center;
}
.content{
    text-align: left;
    margin-left: 120px;
    width: 471px;
    height: 500px;
}
p{
    font-size: 14px;
    line-height: 28px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
#submit-btn{
  font-size: 15px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: black;
  padding: 3px 3px;
  cursor: pointer;
  width:150px;
}
.error{
    color: red;
    font-size: 18px;
}
#img{
    width: 150px;
    height: 150px;
    margin-left: 180px;
}
button{
  cursor:pointer;
}
label, input{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 12px;
}
</style>