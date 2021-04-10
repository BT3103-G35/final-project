<template>
    <div>
        <h1> My Chats </h1>
        <h2> Click on the item image to go the conversation! </h2>
        <div class="chat-container">
            <div class="chat-list">
                <div class="search-bar">
                    <input class="chat-search" type="text" placeholder="Search for item name..." v-model="searchWord" name="search">
                    <button @click="search" type="submit">Search</button>
                    <button @click="back" type="submit">Back</button>
                    <br><br><br>
                </div>

                <div v-if="displayData.length==0">
                    <p style="font-size:20px;"> You do not have any chats. Chat with a lister to start one! </p>
                </div>

                <div class="chat-preview" v-else>
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
                                            <input style="font-size:27px; margin-left:35px; line-height:0.1" :value="data.lastMessage" :readonly=true>
                                        </div>
                                        <div> 
                                            <img style="margin-left:80px;" class="item-img" :src="data.imageRef" @click="redirect(data.buyer, data.seller, data.count)">
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
                                            <input style="font-size:27px; margin-left:35px; line-height:0.1" :value="data.lastMessage" :readonly=true>
                                        </div>
                                        <div> 
                                            <img style="margin-left:300px;" class="item-img" :src="data.imageRef" @click="redirect(data.buyer, data.seller, data.count)">
                                        </div>
                                    </div>
                                </div>
                                <br><br><br><br><br>
                            </li>
                        </ul>
                    </div>
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

    /*computed() {
        compare:function(a,b){
            return b.lastMessageTiming-a.lastMessageTiming;
        }
    },*/

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
                                    partnerName: doc.data().sellerName, itemName: doc.data().itemName, 
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

                        //user is a seller, so retrieve dp of the buyer and save it to a value
                        db.collection('community').where('user', '==', doc.data().buyer).get().then((query) => {
                            const result2 = query.docs[0]
            
                        //save all the necessary data to an object, an push it into displayData so we can v-for over each object later
                        this.displayData.push({buyer:doc.data().buyer, seller:doc.data().seller, count:parseInt(doc.data().count), 
                                partnerName: doc.data().buyerName, itemName: doc.data().itemName, 
                                        lastMessage: doc.data().lastMessage, lastMessageTiming: doc.data().lastMessageTiming, 
                                                imageRef: result.data().imageRef, chatProfilePic: result2.data().imageRef});
                        });
                    });
                });
            });
            /*this.displayData.sort(function(a,b) {
                if(a.lastMessageTiming < b.lastMessageTiming) {
                    return -1;
                }
                if(a.lastMessageTiming > b.lastMessageTiming) {
                    return 1;
                }
                return 0;
                return b.lastMessageTiming-a.lastMessageTiming
            });*/
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
            imageRef: '' //placeholder to store each imageRef before they are pushed into displayData array
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
}
.chat-list{
    margin-left:35px;
}
.chat-search{
    width:400px;
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
</style>