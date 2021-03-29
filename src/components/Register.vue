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
                        <!-- <label for="message">Message:</label><br>
                        <textarea id="message" name="message" rows="4" cols="60"></textarea> -->
                        <button type="submit">SIGN UP</button>
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
            .then(() => {
            firebase.auth().currentUser.updateProfile({
                displayName: this.name
            });
            this.$router.push('/profile');
            })
            .catch(error => (this.error = error));
        }
    },
    data() {
        return {
            name: "",
            email: "",
            password: '',
            error: ''
        }
    }
}
</script>

<style scoped>
.register-container{
    display: flex;
}
.wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
img{
    width: 578px;
    height: 600px;
    margin-left: 100px;
    margin-top: 30px;
}
h1{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 55px;
}
.content{
    text-align: left;
    margin-left: 50px;
    margin-top: -80px;
    width: 471px;
    height: 500px;
    
}
p{
    font-size: 18px;
    line-height: 28px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
button{
    background: #EC6041;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;
    color: white;
    width: 455px;
}
.error{
    color: red;
    font-size: 18px;
}
</style>