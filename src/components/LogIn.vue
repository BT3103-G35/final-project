<template>
    <div class="login-container">
        <div style="text-align:center">
            <br>                
            <h1><b>Welcome Back!</b></h1>
            <br>
        </div>
        <div>
            <form id="loginform">
                    <label for="email">Email Address:</label><br>
                    <input type="text" id="email" name="email" size="65" required><br>
                    <label for="password">Password:</label><br>
                    <input type="text" id="password" name="password" size="65" required><br>
                </form>  
            </div>
            <div class="img">
                <img src="https://www.bdo.com.co/getmedia/ba0d22a6-ae5e-45fb-a3e4-d7d56008fcbf/apparel-attire-blur-994517.jpg.aspx?width=1110&height=706&ext=.jpg">
            </div>
    </div>
</template>

<script>

export default {

}
</script>

<style scoped>

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
    font-size: 75px;
    color:darkorange
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

</style>