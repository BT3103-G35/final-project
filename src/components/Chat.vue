<template>
    <div class="chat-container">
        <div class="chat-title">
            <h1> Message Board </h1>
        </div>
        <div class="chat-body">
            <div class="item">
                <img class="img" :src="this.item[0].imageRef">
                <br> <br>
                <h2> Name: {{ this.item[0].name }} </h2>
                <h2> Details: {{ this.item[0].detail }} </h2>
                <h2> Notes: {{ this.item[0].notes }} </h2>
                <button class="back-to-chatlist-button" @click="redirect">Back to my chats</button>
            </div>
            
            <div class="chat">
                <div v-if="this.messages.length==0">
                    <p> Send the lister a message! </p>
                </div>
                <div id="message-window" v-else>
                    <ul>
                        <li v-for="message in this.messages" v-bind:key="message.index" v-bind:class="(currentUser.uid==message.id)?'me':'other'"> 
                            {{message.sender}} : {{ message.message}}
                        </li>
                    </ul> 
                </div>
                <br><br>
                <input style="font-size:20px; width:400px;" id="message" v-model="this.message" placeholder="Enter message..." autocomplete="off">
                <button style="height:29px; font-size:20px;" @click="sendMessage" type="submit">Send</button>        
            </div>
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
                    this.fetchItems();
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    this.currentUser = false;
                }
            });
        },

        fetchItems() {
            var db = firebase.firestore();
            
            db.collection('marketplace').where('user', '==', this.seller).where('count', '==', this.count)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.item.push(doc.data());
                });
            }); //retrieve item

            db.collection('community').where('user', '==', this.buyer).get()
            .then((query) => {
                    const result = query.docs[0];
                    this.buyerName = result.data().name;
            });

            db.collection('community').where('user', '==', this.seller).get()
            .then((query) => {
                    const result = query.docs[0];
                    this.sellerName = result.data().name;
            });

            db.collection('marketplace').where('user', '==', this.seller).where('count', '==', this.count).get()
            .then((query) => {
                    const result = query.docs[0];
                    this.itemName = result.data().name;
            })
            
            var messagesRef = db.collection('messages').doc(this.buyer+'&'+this.seller+'&'+this.count);
            messagesRef.get()
            .then((doc) => {
                if(doc.exists) {
                    for(var message of doc.data().messages){
                        this.messages.push(message);
                    }
                } else{            
                    db.collection('groups').add({
                        buyer: this.buyer,
                        buyerName: this.buyerName,
                        seller: this.seller,
                        sellerName:this.sellerName,
                        count: this.count,
                        messagesRef: this.buyer + '&' + this.seller + '&' + this.count,
                        itemName: this.itemName
                    });
                    db.collection('messages').doc(this.buyer + '&' + this.seller + '&' + this.count).set({
                    });
                }
            });
        },
        sendMessage() { //upon clicking send button
            if (document.getElementById("message").value == ''){
                return false;
            } else{
                var db = firebase.firestore();
                var d = new Date();
                var message=document.getElementById("message").value; //get the message value
                if(this.currentUser.uid==this.buyer){
                    this.messages.push({id:this.buyer, sender:this.buyerName, message:message})
                }
                else{
                    this.messages.push({id:this.seller, sender:this.sellerName, message:message})
                }
                db.collection("messages").doc(this.buyer + '&' + this.seller + '&' + this.count).update({
                    messages:this.messages
                });
                db.collection("groups").where('messagesRef', '==', this.buyer + '&' + this.seller + '&' + this.count).get()
                .then((query) => {
                    const result = query.docs[0];
                    result.ref.update({
                        lastMessage: message,
                        lastMessageTiming: d.getTime(),
                    });
                });
                this.message=''
            }
        },
        redirect(){
            window.location.href="/chatlist?user=" + this.currentUser.uid;
        }
    },

    data(){
        return {
            loggedIn: false,
            currentUser: false,
            buyer: this.$route.query.buyer, //id
            seller: this.$route.query.seller, //id
            buyerName:'', //displayed name
            sellerName:'', //displayed name
            itemName:'',
            count: parseInt(this.$route.query.count),
            item:[],
            messages:[],
            message:''
        }
    }
}
</script>

<style>
.chat-body{
    display:flex;
    height:800px;
}
.img{
    height:300px;
    width:300px;
}
#info{
    text-align:left;
    font-size:15px;
    padding: 12px 20px;
    font-weight: bold;
}
.item{
    width:40%;
    margin-top:40px;
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
.chat{
    width:60%;
    margin-top:40px;
    text-align:left;
}
ul{
    text-align:left;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    margin: 0;
}
h1{
    text-decoration: underline #376C12;
    font-size: 70px;
    text-align: center;
}
h2{
    width: 300px;
    margin-left: 150px;
}
textarea{
    resize: none;
    overflow: hidden;
    min-height: 0px;
    max-height: 100px;
}
.back-to-chatlist-button{
    height: 40px;
    width: 250px;
    font-size: 20px;
    background-color: black;
    color: white;
    background: black;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    cursor:pointer;
}
#message-window{
    height:460px;
    width:750px;
    overflow:auto;
    display:flex;
    flex-direction: column-reverse;
    border: 5px solid #D3EAC1;
    outline: 5px solid #376C12;
}
</style>