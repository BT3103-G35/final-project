<template>
    <div class="chat-container">
        <div class="chat-title">
            <h1> Message Board </h1>
        </div>
        <div class="chat-body">
            <div class="item">
                <img class="img" :src="this.item[0].imageRef">
                <br>
                <p> Name: {{ this.item[0].name }} </p>
                <p> Details: {{ this.item[0].detail }} </p>
                <p> Notes: {{ this.item[0].notes }} </p>
                <button class="back-to-chatlist-button" @click="redirect"><b>Back to my chats</b></button>
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
                <input id="message" v-model="this.message" placeholder="Enter message..." autocomplete="off">
                <button id="send" @click="sendMessage" type="submit">Send</button>        
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
                        //update the names in case users have changed them
                        if(message.id==this.buyer){
                            message.sender=this.buyerName;
                        }
                        else{
                            message.sender=this.sellerName;
                        }
                        this.messages.push(message);
                    }
                    db.collections('groups').doc(this.buyer+'&'+this.seller+'&'+this.count).update({
                        buyerName:this.buyerName,
                        sellerName:this.sellerName
                    })
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

<style scoped>
.chat-body{
    display:flex;
    height:500px;
}
.img{
    height:200px;
    width:200px;
}
#info{
    text-align:left;
    font-size:10px;
    padding: 8px 13.3px;
    font-weight: bold;
}
.item{
    width:37%;
    margin-top:40px;
    font-size: 17px;
    font-weight: bold;
}
.me{
    float:right;
    background: #0084ff;
    color: #fff;
    clear: both;
    padding: 13.3px;
    border-radius: 20px;
    margin-bottom: 2px;
    font-family: Helvetica, Arial, sans-serif;
    font-size:15px;
}
.other{
    background: #eee;
    float: left;
    clear: both;
    padding: 13.3px;
    border-radius: 20px;
    margin-bottom: 2px;
    font-family: Helvetica, Arial, sans-serif;
    font-size:15px;
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
    margin-top:33.3px;
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
    font-size: 45px;
    text-align: center;
}
textarea{
    resize: none;
    overflow: hidden;
    min-height: 0px;
    max-height: 67px;
}
.back-to-chatlist-button{
    height: 27px;
    width: 167px;
    font-size: 13.3px;
    background-color: black;
    color: white;
    background: black;
    /*box-shadow: 4px 4px 0px #F1876F, 8px 8px 0px #F5AE9E;*/
    cursor:pointer;
}
#message-window{
    height:307px;
    width:575px;
    overflow:auto;
    display:flex;
    flex-direction: column-reverse;
    border: 5px solid #D3EAC1;
    outline: 5px solid #376C12;
}
input{
    font-size:15px;
    width:450px;
}
#send{
    height:23px;
    font-size:15px;
}
</style>