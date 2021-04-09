<template>
    <div class="chat-container">
        
        <div class="chat-list">
            <div class="search-bar">
                <input class="chat-search" type="text" :placeholder="'Search...'" v-model="searchWord" name="search">
                <button @click="search" type="submit">Submit</button>
                <button @click="back" type="submit">Back</button>
            </div>
            <div class="chats">
                <ul>
                    <li v-for="chat in this.chats" v-bind:key="chat.index">
                        <!-- insert profile pic -->
                        <img class="mini-profile" src="https://i.postimg.cc/Bv8WQqrJ/Goat.png">
                    </li>
                </ul>
            </div>
        </div>
        
        <div v-if="chosen!=''">
        </div>
    
    </div>

</template>

<script>
//import firebase from "firebase/app";
export default {
    data(){
        return {
            loggedIn: false,
            currentUser: false,
            userID: this.$route.query.user,
            chosen:'',
            searchWord:''
        }
    }
}
</script>

<style>
.chat-container{
    display:flex;
}
.mini-profile{
    height:50px;
    width:50px;
    border-radius:50%;
}
.search-bar{
    margin-top:50px;
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
</style>