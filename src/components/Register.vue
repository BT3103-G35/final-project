<template>
    <div class="register-container">
        <div class="wrapper">
            <div class="img">
                <img src="https://i.postimg.cc/3w2jGpJm/wardrobe-half.jpg">
            </div>

            <div class="content">
                <h1>Create a new account</h1>
                <p><strong>There are so many opportunities to make a difference in your wardrobe! Sign up to join us!</strong></p>
                <div class="inputForm">
                    <form id="nameform">
                        <label for="name">Name:</label><br>
                        <input type="text" id="name" name="name" size="65" required><br>
                        <label for="email">Email Address:</label><br>
                        <input type="text" id="email" name="email" size="65" required><br>
                        <label for="password">Password:</label><br>
                        <input type="text" id="password" name="password" size="65" required><br>
                        <label for="message">Message:</label><br>
                        <textarea id="message" name="message" rows="4" cols="60"></textarea>
                    </form>
                    <button type="submit" form="nameform" value="Submit">SIGN UP</button>

                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {

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
    margin-left: 100px;
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
</style>