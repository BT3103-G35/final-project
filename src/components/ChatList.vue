<template>
    <div class="chat-page">
        <h1> My Chats </h1>
        <div style="text-align:left;" class="search-bar" v-if="displayData.length!=0">
            <input class="chat-search" type="text" placeholder="Search for item name..." v-model="searchWord" name="search">
            <button @click="search" type="submit">Search</button>
            <button @click="back" type="submit">Back</button>
            <br><br><br>
        </div>
        <div class="chat-container">
            <div class="chat-list">
                <div class="chat-info">
                    <div v-if="displayData.length==0">
                        <p style="font-size:20px;"> You do not have any chats. Chat with a lister to start one! </p>
                    </div>
                    <div v-else>
                        <div v-if="searched == false"> <!-- havent searched anything so just display everything -->
                            <ul>
                                <li v-for="(data, index) in this.displayData" v-bind:key="data.index" v-bind:class="(index%2 == 0)?'list-even':'list-odd'">
                                    <div style="display:flex;">
                                        <div v-if="currentUser.uid==data.seller">
                                            <img @click="toProfile(data.buyer)" class="profile-img" :src="data.chatProfilePic">
                                        </div>
                                        <div v-else>
                                            <img @click="toProfile(data.seller)" class="profile-img" :src="data.chatProfilePic">
                                        </div>
                                        <div style="display:flex;">
                                            <div>    
                                                <p class="partnerName"> {{data.partnerName}}
                                                <br>
                                                <b>{{ data.itemName }}</b>
                                                </p>
                                                <input v-model="data.lastMessage" :readonly=true>
                                            </div>
                                            <div class="item-img"> 
                                                <img class="item-img" :src="data.imageRef">
                                            </div>
                                            <div class="buttons">
                                                <ul>
                                                    <li class="button-list">
                                                        <button class="chat-button-full" @click="redirect(data.buyer, data.seller, data.count)">Full Chat Page</button>
                                                    </li>
                                                    <li class="button-list">
                                                        <button class="chat-button-preview" @click="showPreview(data)">Show Preview</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <br><br>
                                </li>
                            </ul>
                        </div>
                        <div v-else> <!-- searched for something already -->
                            <ul>
                                <li v-for="(data, index) in this.searchedData" v-bind:key="data.index" v-bind:class="(index%2 == 0)?'list-even':'list-odd'">
                                    <div style="display:flex;">
                                        <div v-if="currentUser.uid==data.seller">
                                            <img @click="toProfile(data.buyer)" class="profile-img" :src="data.chatProfilePic">
                                        </div>
                                        <div v-if="currentUser.uid==data.buyer">
                                            <img @click="toProfile(data.seller)" class="profile-img" :src="data.chatProfilePic">
                                        </div>
                                        <div style="display:flex;">
                                            <div>    
                                                <p class="partnerName"> {{data.partnerName}}
                                                <br>
                                                <b>{{ data.itemName }}</b>
                                                </p>
                                                <input v-model="data.lastMessage" :readonly=true>
                                            </div>
                                            <div class="item-img"> 
                                                <img class="item-img" :src="data.imageRef">
                                            </div>
                                            <div class="buttons">
                                                <ul>
                                                    <li class="button-list">
                                                        <button class="chat-button-full" @click="redirect(data.buyer, data.seller, data.count)">Full Chat Page</button>
                                                    </li>
                                                    <li class="button-list">
                                                        <button class="chat-button-preview" @click="showPreview(data)">Show Preview</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <br><br><br>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="chat-preview" v-if="preview==true">
                    <div id="chat-window">
                        <ul class="preview-messages">
                            <li v-for="message in this.messages" v-bind:key="message.index" v-bind:class="(currentUser.uid==message.id)?'me':'other'"> 
                                {{message.sender}} : {{ message.message}}
                            </li>
                        </ul> 
                    </div>
                    <br><br>
                    <input id="message" v-model="this.message" placeholder="Enter message..." autocomplete="off">
                    <button class="send" @click="sendMessage()" type="submit">Send</button>       
                </div>  
            </div>
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
                    this.fetchItems();
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },
        fetchItems() {
            //var storageRef = firebase.storage().ref();
            var db = firebase.firestore();

            //instance 1: this user is a buyer
            db.collection('groups').where('buyer', '==', this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection('marketplace').where('user', '==', doc.data().seller).where('count', '==', parseInt(doc.data().count))
                    .get().then((query) => {
                        const result = query.docs[0];
                        
                        //user is a buyer, so retrieve dp of the seller
                        db.collection('community').where('user', '==', doc.data().seller).get().then((query) => {
                            const result2 = query.docs[0]
                                        
                            db.collection('community').where('user', '==', this.currentUser.uid).get().then((query) => {
                                const result3 = query.docs[0];

                                //save all the necessary data to an object, an push it into displayData so we can v-for over each object later
                                this.displayData.push({buyer:doc.data().buyer, seller:doc.data().seller, count:parseInt(doc.data().count), 
                                        myName:result3.data().name, partnerName: result2.data().name, itemName: doc.data().itemName, 
                                                lastMessage: doc.data().lastMessage, lastMessageTiming: doc.data().lastMessageTiming,
                                                        imageRef: result.data().imageRef, chatProfilePic: result2.data().imageRef});
                            });                    
                        });
                    });
                });
            });

            //instance 2: this user is a seller
            db.collection('groups').where('seller', '==', this.currentUser.uid).get().then((querySnapshot) => {//where this user is a seller
                querySnapshot.forEach((doc) => {
                    db.collection('marketplace').where('user', '==', doc.data().seller).where('count', '==', parseInt(doc.data().count))
                    .get().then((query) => {
                        const result = query.docs[0];

                        //user is a seller, so retrieve dp of the buyer
                        db.collection('community').where('user', '==', doc.data().buyer).get().then((query) => {
                            const result2 = query.docs[0]

                            db.collection('community').where('user', '==', this.currentUser.uid).get().then((query) => {
                                const result3 = query.docs[0];
                
                            //save all the necessary data to an object, an push it into displayData so we can v-for over each object later
                            this.displayData.push({buyer:doc.data().buyer, seller:doc.data().seller, count:parseInt(doc.data().count), 
                                    myName:result3.data().name, partnerName: result2.data().name, itemName: doc.data().itemName, 
                                            lastMessage: doc.data().lastMessage, lastMessageTiming: doc.data().lastMessageTiming, 
                                                    imageRef: result.data().imageRef, chatProfilePic: result2.data().imageRef});
                            });
                        });
                    });
                });
            });
        },
        back(){ 
            this.searched = false;
            this.searchWord = '';
            this.searchedData = [];
        },
        search(){
            this.searchedData=[];
            this.searched = true;
            for(var data of this.displayData){
                if(data.itemName.toUpperCase().includes(this.searchWord.toUpperCase())){
                    this.searchedData.push(data);
                }
            }
            this.preview=false;
        },
        redirect(buyer, seller, count){
            window.location.href="/chat?buyer=" + buyer + "&seller=" + seller + "&count=" + parseInt(count);
        },
        toProfile(user){
            window.location.href="/userprofile?user=" + user;
        },
        sendMessage() { //upon clicking send button
            if (document.getElementById("message").value == ''){
                return false;
            } else{
                var db = firebase.firestore();
                var d = new Date();
                var message=document.getElementById("message").value; //get the message value
                if(this.currentUser.uid==this.chosenData.buyer){
                    this.messages.push({id:this.chosenData.buyer, sender:this.chosenData.myName, message:message})
                }
                else{
                    this.messages.push({id:this.chosenData.seller, sender:this.chosenData.myName, message:message})
                }
                db.collection("messages").doc(this.chosenData.buyer + '&' + this.chosenData.seller + '&' + this.chosenData.count).update({
                    messages:this.messages
                });
                db.collection("groups").where('messagesRef', '==', this.chosenData.buyer + '&' + this.chosenData.seller + '&' + this.chosenData.count).get()
                .then((query) => {
                    const result = query.docs[0];
                    result.ref.update({
                        lastMessage: message,
                        lastMessageTiming: d.getTime(),
                    });
                });
                this.message=''
                for(var data of this.displayData){
                    if(data.buyer==this.chosenData.buyer && data.seller==this.chosenData.seller && data.count==this.chosenData.count){
                        data.lastMessage=message;
                    }
                }
            }
        },
        showPreview(data){
            this.chosenData=data;
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0; 
            var db = firebase.firestore();
            this.messages=[];
            this.preview=true;
            db.collection('messages').doc(data.buyer+'&'+data.seller+'&'+data.count).get()
            .then((doc) => {
                if(doc.exists) {
                    for(var message of doc.data().messages){
                        if(message.id==this.currentUser.uid){
                            message.sender=this.chosenData.myName;
                        }else{
                            message.sender=this.chosenData.partnerName;
                        }
                        this.messages.push(message);
                    }
                }
            });
        }
    },

    data(){
        return {
            loggedIn: false,
            currentUser: false,
            userID: this.$route.query.user,
            searchWord:'',
            searched: false,
            displayData:[], 
            //^^ contains objects of {profile picture of the person you are speaking with, name of the person you are speaking with,
                                    //item name, last sent message},
            searchedData:[],
            selectedMessages:[],
            preview:false,
            messages:[],
            message:'',
            chosenData:{},
        }
    }
}
</script>

<style scoped>
input{
    width:250px;
    font-size:18px;
    margin-left:20px;
    line-height:0.1
}
#message{
    font-size:15px;
    width:250px;
}
.chat-page{
    height: 500px;
}
#chat-window{
    margin-top: 5px;
    height:253.3px;
    width:400px;
    margin-left: 50px;
    overflow:auto;
    display:flex;
    flex-direction: column-reverse;
    border: 5px solid #D3EAC1;
    outline: 5px solid #376C12;
}
.list-even{
    border:solid 1px #3F3726;
    background-color: #F2ECE0;
}
.list-odd{
    border:solid 1px #3F3726;
    background-color: #EBF2E0;
}
.chat-container{
    display:flex;
}
.search-bar{
    margin-top:50px;
    margin-left:35px;
}
.chat-list{
    margin-left:16px;
    display:flex;
}
.chat-search{
    width:323px;
    height:20px;
    font-size:13.3px;
}
button{
    height:26px;
    font-size:13.3px;
    cursor: pointer;
}
.item-img{
    height:83.3px;
    width:83.3px;
}
img{
    cursor:pointer;
}
.profile-img{
    width: 70px;
    height: 70px;
    border-radius: 50%;
}
.chat-preview{
    margin-left: 90px;
    margin-top: 15px;
}
.me{
    float:right;
    background: #0084ff;
    color: #fff;
    clear: both;
    padding: 13.3px;
    border-radius: 20px;
    margin-bottom: 1px;
    font-family: Helvetica, Arial, sans-serif;
    font-size:12px;
    margin: 1px;
}.other{
    background: #eee;
    float: left;
    clear: both;
    padding: 13.3px;
    border-radius: 20px;
    margin-bottom: 1px;
    font-family: Helvetica, Arial, sans-serif;
    font-size:12px;
    margin: 1px;
}
.other + .me{
  border-bottom-right-radius: 5px;
}

.me + .me{
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.me:last-of-type {
  border-bottom-right-radius: 30px;
}
.chat-button-full{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    background: #376C12;
    border:solid 3px black;
    cursor: pointer;
    width: 107px;
}
.chat-button-preview{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    background: black;
    border:solid 3px black;
    cursor: pointer;
    width: 107px;
}
.preview-messages{
    text-align:left;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    margin: 0;
}
ul{
    list-style: none;
}
li{
    margin:0 0 35px 0;  
}
.button-list{
    margin:0 0 3.3px 0;
    margin-left:25px;
}
#send{
    height:29px;
    font-size:20px;
}
.partnerName{
    font-size:18px;
    margin-top:10px;
    margin-left: 20px;
    text-align: left;
}
h1{
    text-decoration: underline #376C12;
    font-size: 45px;
}
</style>