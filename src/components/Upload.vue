<template>
    <div id="app">
            <div id="text" v-if="!this.image">
                <br><br>
                <h3>Select an image</h3>
                <input type="file" @change="onFileChange($event)">
            </div>
            <div v-else>
                <img :src="this.image" />
                <button @click="removeImage()" v-if="unselected">Remove image</button><span></span>
                <button @click="uploadImage($event)" v-if="unselected">Confirm image</button>
            </div>
    </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
export default {
    created() {
        this.setupFirebase();
    },
    data(){
        return{
            image: false,
            imageFile: false,
            loggedIn: false,
            currentUser: false,
            unselected: true
        }
    },
    methods: {
    onFileChange(e) {
      //var files = e.target.files //|| e.dataTransfer.files;
      //if (!files.length)
        //return;
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
    },
    uploadImage() {
      var storageRef = firebase.storage().ref('uploads/' + this.currentUser.uid + '/' + this.imageFile.name);
      storageRef.put(this.imageFile);
      let filename = this.imageFile.name;
      this.$emit('upload', filename);
      this.unselected = false;
    },
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
    text-align: center;
    background-image: url("https://i.postimg.cc/hGwHp57H/upload.jpg");
    background-size: 450px 350px;
    width: 450px;
    height: 330px;
    border-radius: 5px;
}
img {
  width: 450px;
  height: 330px;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
input{
    margin-left: 70px;
}
button{
    background: black;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    width:158px;
    height:40px;
    font-size:20px;
    cursor:pointer;
    display:inline-block;
    margin: 8px;
}
</style>