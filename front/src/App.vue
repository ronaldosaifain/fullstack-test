<template>
  <div id="app">
  <b-form>
     <b-col md="6" sm="6" align="center" inline>
           <b-form-input type="text" v-model="cidade.nome" placeholder="Informe o nome da Cidade..." />
                  <span>OU</span>
           <b-form-input type="text" v-model="cidade.lat" placeholder="Informe a Latitude da Cidade..." />
           <b-form-input type="text" v-model="cidade.lon" placeholder="Informe a Longitude da Cidade..." />
                   <b-button @click="getPlaylist">Buscar</b-button>
    </b-col>
</b-form>
     <p v-if="errors.length">
    <b>Por favor, corrija o seguinte erro:</b>
    <ul>
      <li v-for="error in errors" :key="error">{{ error}}</li>
    </ul>
  </p>
    <ul >
    <h1>PlayList</h1>
    <li v-for="musica in playlists" :key="musica.track.album.artists.id">
     {{musica.track.album.artists[0].name}} - {{ musica.track.album.name }}
     </li>
    </ul>
 
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'App',
  components: {
  },
  data: function () {
    return {
    playlists: [],
    cidade: {},
    errors: [],
    }
  },
  methods:{
  getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
      e = r.exec(q)
      while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
 }
 return hashParams;
},  
  getPlaylist(){
        const parametros = this.getHashParams();
        if(this.isEmpty(parametros)){
          window.location.href = 'http://localhost:8888/';
          return
        }
        const token = `Bearer ${parametros.access_token}`;
        this.verifyErros(this.cidade)

       if(!this.errors.length) {    
          axios.defaults.headers.common['Authorization'] = token
            axios.post(`http://localhost:3000/playlist`, this.cidade)
                 .then(res => this.playlists = res.data)
                 .catch(() => this.errors.push('Cidade não encontrada. Por favor, verifique e corrija os campos.'))
       }      
},
   isEmpty(obj) {
     return Object.keys(obj).length === 0;
},
  verifyErros(cidade){
    this.errors = []
    this.playlists = []
    if(!cidade.nome){
        if(!cidade.lat || !cidade.lon)
            this.errors.push('Adicionar pelo menos o nome da Cidade Ou a Latitude e Longitude')          
   }
}
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
