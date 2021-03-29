<template>
    <div class="slider">
        <div class="slides">
            <input type="radio" name="radio-btn" id="radio1">
            <input type="radio" name="radio-btn" id="radio2">

            <div class="slide first">
                <ul>
                    <li><router-link to="/AddItem2" tag="img" src="https://i.postimg.cc/L6qpR96r/top.png"></router-link></li>
                    <li><router-link to="/AddItem2" tag="img" src="https://i.postimg.cc/Y0bHd0RS/outerwear.png"></router-link></li>
                    <li><router-link to="/AddItem2" tag="img" src="https://i.postimg.cc/593b4KJM/bottom.png"></router-link></li>
                    <li><router-link to="/AddItem2" tag="img" src="https://i.postimg.cc/YqD7g4jn/footwear.png"></router-link></li>
                </ul>
            </div>
            <div class="slide">
                <ul>
                    <li><router-link to="/AddItem2" tag="img" src="https://i.postimg.cc/wTFB781s/Headwear.png"></router-link></li>
                    <li><router-link to="/AddItem2" tag="img" src="https://i.postimg.cc/d1GxS688/Accessory.png"></router-link></li>
                    <li><router-link to="/AddItem2" tag="img" src="https://i.postimg.cc/L6qpR96r/top.png"></router-link></li>
                    <li><router-link to="/AddItem2" tag="img" src="https://i.postimg.cc/L6qpR96r/top.png"></router-link></li>
                </ul>
            </div>

        </div>
        <div class="navigation-manual">
            <label for="radio1" class="manual-btn"></label>
            <label for="radio2" class="manual-btn"></label>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.slide-first{
    width: 500px;
    height: 500px
}

.slide-first ul {
    display: flex;
    flex-flow: row wrap;
    list-style: none;
    margin: 32px 0;
}
.slide-first li {
    margin: 0 10px;
    flex-basis: calc(50% - 20px);  
}

.slide-first img {
    width: 100%;               
    height: auto;
}

.slide{
    width: 500px;
    height: 500px
}

.slide ul {
    display: flex;
    flex-flow: row wrap;
    list-style: none;
    margin: 32px 0;
}
.slide li {
    margin: 0 10px;
    flex-basis: calc(50% - 20px); 
}

.slide img {
    width: 100%;                
    height: auto;
}
.slider{
    width: 550px;
    height: 500px;
    border-radius: 10px;
    overflow: hidden;
}
.slides{
    width: 500%;
    height: 500px;
    display: flex;
}
.slides input{
    display: none;
}
.slide{
    width: 20%;
    transition: 2s;
}
.slide img{
    width: 200px;
    height: 200px;
}
.navigation-manual{
    position: absolute;
    widows: 800px;
    margin-top: -40px;
    display: flex;
    justify-content: center;
    margin-left: 260px;
}
.manual-btn{
    border: 2px solid #40D3DC;
    padding: 5px;
    border-radius: 10px;
    cursor: pointer;
    transition: 1s;

}
.manual-btn:not(:last-child){
    margin-right: 40px;
}
.manual-btn:hover{
    background: #40D3DC;
}
#radio1:checked ~ .first{
    margin-left:0;
}
#radio2:checked ~ .first{
    margin-left:-20%;
}
img{
    cursor: pointer;
}
</style>