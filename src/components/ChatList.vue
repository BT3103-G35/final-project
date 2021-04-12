<template>
    <div>
        <h1> My Chats </h1>
        <h2> Click on the item image to go the conversation! </h2>
        <div style="text-align:left;" class="search-bar">
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
                                <li class="list" v-for="data in this.displayData" v-bind:key="data.index">
                                    <div style="display:flex;">
                                        <div v-if="currentUser.uid==data.seller">
                                            <img @click="toProfile(data.buyer)" class="profile-img" :src="data.chatProfilePic">
                                        </div>
                                        <div v-else>
                                            <img @click="toProfile(data.seller)" class="profile-img" :src="data.chatProfilePic">
                                        </div>
                                        <div style="display:flex;">
                                            <div>    
                                                <p style="font-size:22px; margin-left:35px; margin-top:10px;"> {{data.partnerName}}
                                                <br>
                                                <b>{{ data.itemName }}</b>
                                                </p>
                                                <input style="font-size:27px; margin-left:35px; line-height:0.1" v-model="data.lastMessage" :readonly=true>
                                            </div>
                                            <div class="item-img"> 
                                                <img style="margin-left:80px;" class="item-img" :src="data.imageRef">
                                            </div>
                                            <div class="buttons">
                                                <ul>
                                                    <li>
                                                        <button class="chat-button" style="margin-left:100px;" @click="redirect(data.buyer, data.seller, data.count)">Go to full Chat Page</button>
                                                    </li>
                                                    <li>
                                                        <button class="chat-button" style="margin-left:100px;" @click="showPreview(data)">Show Preview</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <br><br><br><br><br>
                                </li>
                            </ul>
                        </div>
                        <div v-else> <!-- searched for something already -->
                            <ul>
                                <li class="list" v-for="data in this.searchedData" v-bind:key="data.index">
                                    <div style="display:flex;">
                                        <div v-if="currentUser.uid==data.seller">
                                            <img @click="toProfile(data.buyer)" class="profile-img" :src="data.chatProfilePic">
                                        </div>
                                        <div v-if="currentUser.uid==data.buyer">
                                            <img @click="toProfile(data.seller)" class="profile-img" :src="data.chatProfilePic">
                                        </div>
                                        <div style="display:flex;">
                                            <div>    
                                                <p style="font-size:22px; margin-left:35px; margin-top:10px;"> {{data.partnerName}}
                                                <br>
                                                <b>{{ data.itemName }}</b>
                                                </p>
                                                <input style="font-size:27px; margin-left:35px; line-height:0.1" v-model="data.lastMessage" :readonly=true>
                                            </div>
                                            <div class="item-img"> 
                                                <img style="margin-left:80px;" class="item-img" :src="data.imageRef">
                                            </div>
                                            <div class="buttons">
                                                <ul>
                                                    <li style="margin-bottom:10px;">
                                                        <button class="chat-button" style="margin-left:100px;" @click="redirect(data.buyer, data.seller, data.count)">Go to full Chat Page</button>
                                                    </li>
                                                    <li>
                                                        <button class="chat-button" style="margin-left:100px;" @click="showPreview(data)">Show Preview</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <br><br><br><br><br>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="chat-preview" v-if="preview==true">
                    <div style="height:300px; width:450px; overflow:auto; display:flex; flex-direction: column-reverse">
                        <ul>
                            <li v-for="message in this.messages" v-bind:key="message.index" v-bind:class="(currentUser.uid==message.id)?'me':'other'"> 
                                {{message.sender}} : {{ message.message}}
                            </li>
                        </ul> 
                    </div>
                    <br><br>
                    <input style="font-size:20px; width:400px;" id="message" v-model="this.message" placeholder="Enter message..." autocomplete="off">
                    <button style="height:29px; font-size:20px;" @click="sendMessage()" type="submit">Send</button>       
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

                            //save all the necessary data to an object, an push it into displayData so we can v-for over each object later
                            this.displayData.push({buyer:doc.data().buyer, seller:doc.data().seller, count:parseInt(doc.data().count), 
                                    myName:doc.data().buyerName, partnerName: doc.data().sellerName, itemName: doc.data().itemName, 
                                            lastMessage: doc.data().lastMessage, lastMessageTiming: doc.data().lastMessageTiming,
                                                    imageRef: result.data().imageRef, chatProfilePic: result2.data().imageRef});
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
            
                        //save all the necessary data to an object, an push it into displayData so we can v-for over each object later
                        this.displayData.push({buyer:doc.data().buyer, seller:doc.data().seller, count:parseInt(doc.data().count), 
                                myName:doc.data().sellerName, partnerName: doc.data().buyerName, itemName: doc.data().itemName, 
                                        lastMessage: doc.data().lastMessage, lastMessageTiming: doc.data().lastMessageTiming, 
                                                imageRef: result.data().imageRef, chatProfilePic: result2.data().imageRef});
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
            chosenData:{}
        }
    }
}
</script>

<style scoped>
.chat-container{
    display:flex;
}
.mini-profile{
    height:100px;
    width:100px;
    border-radius:10%;
}
.search-bar{
    margin-top:75px;
    margin-left:60px;
}
.chat-list{
    margin-left:35px;
    display:flex;
}
.chat-search{
    width:487px;
    height:30px;
    font-size:20px;
}
button{
    height:33px;
    font-size:20px;
}
.list{
    font-size:20px;
}
.item-img{
    height:125px;
    width:125px;
}
img{
    cursor:pointer;
}
.profile-img{
    width: 75px;
    height: 75px;
    border-radius: 50%;
}
.chat-preview{
    margin-left:20%;
}
.me{
    float:right;
    background: #0084ff;
    color: #fff;
    clear: both;
    padding: 20px;
    border-radius: 30px;
    margin-bottom: 2px;
    font-family: Helvetica, Arial, sans-serif;
    font-size:18px;
}
.other{
    background: #eee;
    float: left;
    clear: both;
    padding: 20px;
    border-radius: 30px;
    margin-bottom: 2px;
    font-family: Helvetica, Arial, sans-serif;
    font-size:18px;
}
.chat-button{
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: white;
  background: #EC6041;
  cursor: pointer;
  width: 200px;
}
button{
    cursor: pointer;
}
</style>