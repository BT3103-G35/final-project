<template>
    <div class="about-container">
        <div class="wrapper">
            <header>
                <div class="page-content">
                    <h1>About Us</h1>
                    <p>
                At Ainran, we work hard everyday to solve problems that plague our world.. The fashion industry accounts for 10% of global carbon emissions, generating a lot of greenhouse gases due to the energy used during its production, manufacturing, and transportation of the millions garments purchased each year.
                    </p>
                    <p>
                We decided to harness the power of individuals to help address this problem, by building this platform to allow each and every one of you to track what clothes you own and what you don't need. Our mission at Ainran is to get you to rethink what clothes you need and how you can get them, so as to prevent garment wastage and help reduce emissions.
                    </p>
                </div>
                <div class="image-container">
                    <img src="https://i.postimg.cc/jq7C1Xyr/About-Us.jpg">
                </div>
            </header>
            <div class="social-icons">
            <h2>Stay In Touch</h2>
                
                <a href = "https://www.instagram.com/ainran_your_online_wardrobe/" target="_blank">
                    <img id="insta" src="https://i.postimg.cc/9F6LHV8Q/insta.jpg">
                </a>
                <a href = "https://twitter.com/Ainran6" target="_blank">
                    <img id="twitter" src="https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/twitter-logo.png.twimg.768.png">
                </a>
                <a href="mailto:bt3103g35@gmail.com">
                    <img id="email" src="https://i.postimg.cc/6QYVqN0R/email.jpg">
                </a>
            </div>
        </div>
    </div>
</template>



<script>


export default {

}

</script>

<style scoped>

.wrapper{
    width: 2000px;
}
.about-container{
    display: flex;
}
header{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
p{
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 28px;
    text-align: left;
}
.page-content{
    width: 471px;
    margin-left: 200px;
    margin-top: 50px;
}
.image-container{
    margin-right: 200px;
    margin-top: 45px;
}

.social-icons img{
    margin-right: 50px;
}
.social-icons{
    text-align: left;
    margin-left: 200px;
}
h2{
    display: inline-block;
    vertical-align: middle;
}
.social-icons img{
    vertical-align: middle;
}
#insta{
    margin-left: 30px;
}
#twitter{
    height: 45px;
    width: 45px;
}
#fb{
    height: 45px;
    width: 26px;
}
#email{
    height: 37px;
    width: 47px;
}
h1{
    text-decoration: underline #376C12;
}
</style>