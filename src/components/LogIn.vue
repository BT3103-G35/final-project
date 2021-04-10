<template>
    <div class="login-container">
        <div style="text-align:center">
            <br>                
            <h1><b>Welcome Back!</b></h1>
            <br>
        </div>
        <div id="mid-section">
            <form id="loginform" @submit.prevent="pressed">
                    <label for="email">Email Address*:</label><br>
                    <input type="email" size="65" v-model="email" required><br><br>
                    <label for="password">Password*:</label><br>
                    <input type="password" size="65" v-model="password" required><br><br>
                    <button id="forgot-password" @click="resetPassword">Forgot password?</button><br><br>
                    <button type="submit">Log in</button><br><br>
                    <div class="error" v-if="error">{{error.message}}</div>

                    
            </form>

            <div class="img">
                <img src="https://www.bdo.com.co/getmedia/ba0d22a6-ae5e-45fb-a3e4-d7d56008fcbf/apparel-attire-blur-994517.jpg.aspx?width=1110&height=706&ext=.jpg">
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
                .signInWithEmailAndPassword(this.email, this.password)
                .then(data => {
                    console.log(data);
                    this.$router.push('/profile');
                })
                .catch(error => {
                    this.error = error;
                });
        },
        resetPassword() {
            if (this.email) {
                firebase.auth().sendPasswordResetEmail(this.email).then(() => {
                    // Email sent.
                    alert("Reset passward email has been sent to your email address")
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                alert("Please enter your email address");
                location.reload();
            }
        }
    },
    data() {
        return {
            email: "",
            password: '',
            error: ''
        }
    }
}
</script>

<style scoped>
.login-container{
    height: 1000px;
    background-color:#fff2e6;
}
.wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
#mid-section{
    display: flex;
}
.img{
    margin-left: 100px;
}
#loginform{
    float: left;
    text-align: left;
    padding-left: 10%;
    padding-top: 5%;
    font-size: 20px;
}
input{
    height: 30px;
    width: 400px;
    font-size: 15px;
}
button{
    height: 40px;
    width: 100px;
    font-size: 20px;
    background-color: #EC6041;
    color: white;
    cursor: pointer;
}
#forgot-password{
    border: none;
    background: none;
    color: #EC6041;
    width: auto;
}
img{
    float: left;
    width: 650px;
    height: 400px;
    margin-left: 5%;
}
h1{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 75px;
    color:#EC6041;
}
.content{
    text-align: left;
    margin-left: 100px;
    width: 471px;
    height: 500px;
    
}
p{
    font-size: 18px;
    line-height: 28px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.error{
    color: red;
    font-size: 18px;
}

</style>