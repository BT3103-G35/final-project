<template>
    <div class="chat-container">
        <div class="chat-title">
            <h1> Message Board </h1>
        </div>
        <div class="chat-body">
            <div class="item">
                <img class="img" :src=this.item[0].imageRef>
            </div>
            
            <div class="chat">
                <div v-if="this.messages.length==0">
                    <p> Send the lister a message! </p>
                </div>
                <div v-else>
                    <ul>
                        <li v-for="message in this.messages" v-bind:key="message.index"> 
                        <!-- this.messages is a array containing one array of objects -->
                            {{message.sender}} : {{ message.message}}
                        </li>
                    </ul> 
                </div>
                <input id="message" placeholder="Enter message..." autocomplete="off">
                <button @click="sendMessage" type="submit">Send</button>        
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
        //console.log(this.messages);
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
                        seller: this.seller,
                        count: this.count,
                        messagesRef: this.buyer + '&' + this.seller + '&' + this.count 
                    });
                    db.collection('messages').doc(this.buyer + '&' + this.seller + '&' + this.count).set({
                    });
                }
            });
        },

        sendMessage() { //upon clicking send button
            var db = firebase.firestore();
            var message=document.getElementById("message").value; //get the message value
            if(this.currentUser.uid==this.buyer){
                this.messages.push({sender:this.buyerName, message:message})
            }
            else{
                this.messages.push({sender:this.sellerName, message:message})
            }
            db.collection("messages").doc(this.buyer + '&' + this.seller + '&' + this.count).update({
                messages:this.messages
            });
        }
    },

    data(){
        return {
            loggedIn: false,
            currentUser: false,
            buyer: this.$route.query.buyer,
            seller: this.$route.query.seller,
            buyerName:'',
            sellerName:'',
            count: parseInt(this.$route.query.count),
            item:[],
            messages:[],
        }
    }
}
</script>

<style>
.chat-body{
    display:flex;
}
.img{
    height:400px;
    width:400px;
}
.item{
    width:40%;
    margin-top:100px;
}
.chat{
    width:60%;
    margin-top:100px;
    text-align:left;
}
ul {
    text-align:left;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
}
h1{
    text-decoration: underline #EC6041;
    font-size: 70px;
    text-align: center;
}
</style>