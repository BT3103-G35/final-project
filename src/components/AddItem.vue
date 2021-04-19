<template>
    <div class="additems-container">
        <div class="additems-images">
            <h1 id="choose-cat">Choose a category</h1>
            <slider class="slider"></slider>
        </div>
        <div class="add-need-ideas">
            <div v-if="this.number==1">
                <h1>Did you know?</h1>
                <p> The textile industry contributes to environmental degradation by using <br> water, energy, 
                    and other resources to produce textiles. In fact, over <br> 700 gallons of water, enough to fill 22 bathtubs are used 
                    to <br> manufacture a single cotton T-shirt. <br><br>
                    By uploading your clothing to Ainran to reduce textile waste and joining<br> our cause,<b> you become part of the solution!</b></p>
                <img id="first-img" src="https://i.postimg.cc/85Jg7KYw/Tree-1.png">
            </div>
            <div v-if="this.number==2">
                <h1>Did you know?</h1>
                <p> It is reported that while consumers bought 60% more garments as compared to previous years, 
                    they only kept them for half as long, and<br> a lot of this clothing ends up in the dump. The equivalent of one <br> garbage 
                    truck full of clothes is burned or dumped in a landfill <br>every second. <br><br>
                    By uploading your clothing to Ainran to reduce textile waste and joining<br> our cause,<b> you become part of the solution!</b></p>
                <br><br>
                <img id="second-img" src="https://i.postimg.cc/Hks00ftY/Tree-2.png">
            </div>
            <div v-if="this.number==3">
                <h1>Did you know?</h1>
                <p> If everyone reused just one T-shirt, we would save 5.5 trillion gallons <br> of water 
                    and 26 million pounds of carbon dioxide, helping stem the <br>tide of environmental destruction caused by textile waste! <br><br>
                    By uploading your clothing to Ainran to reduce textile waste and joining<br> our cause,<b> you become part of the solution!</b></p>
                <br><br>
                <img id="third-img" src="https://i.postimg.cc/pVw1ZX92/Tree-3.png">
            </div>
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";
import slider from "./Slider.vue"
export default {
    mounted() {
        this.setupFirebase();
        this.randomInteger(1, 3);
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
        },
        randomInteger(min, max) {
            this.number = Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            number: 0
        }
    },
    components:{
        slider
    }
}
</script>

<style scoped>
h1{
    text-decoration: underline #376C12;
    font-size: 33.3px;
    text-align:center;
}
p{
    font-size:13.3px;
}
.additems-container{
    display: flex;
    align-content: center;
}
.additems-images{
    margin-top: 2%;
}
.slider{
    margin-left: 80px;
}
.add-need-ideas{
    margin-top: 3%;
    margin-left:5%;
    width: 450px;
    border: solid 5px #376C12;
    background-color: #F7FFF4;
    height: 500px;
}
button-community{
    font-size: 13.3px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: black;
    background: #D3EAC1;
    border: 5px solid #8EBC68;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    padding: 13.3px 16px;
    cursor: pointer;
}
#first-img{
    height:287px;
    width:467px;
}
#second-img, #third-img{
    height:233.3px;
    width:467px;
}
</style>