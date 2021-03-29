<template>
    <div id="app">
            <div v-if="!this.image">
                <br><br>
                <h2>Select an image</h2>
                <input type="file" @change="onFileChange($event)">
            </div>
            <div v-else>
                <img :src="this.image" />
                <button @click="removeImage()">Remove image</button>
            </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            image: false

        }
    },
methods: {
    onFileChange(e) {
      //var files = e.target.files //|| e.dataTransfer.files;
      //if (!files.length)
        //return;
      this.createImage(e.target.files[0]);
    },
    createImage(file) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function () {
      this.image = false; 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
    text-align: center;
    background-image: url("https://i.postimg.cc/hGwHp57H/upload.jpg");
    background-size: 450px 350px;
    width: 450px;
    height: 330px;
    border-radius: 5px;
}
img {
  width: 450px;
  height: 330px;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
input{
    margin-left: 70px;
}


</style>