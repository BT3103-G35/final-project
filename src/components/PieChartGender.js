import {Doughnut} from 'vue-chartjs'
import firebase from "firebase/app";
//import * as Bar from 'chart.js';


export default{
    extends: Doughnut,
    created(){
        this.setupFirebase();
    },
    data: function() {
        return {
            results: [0, 0, 0],
            datacollection: {
                labels: ['Male', 'Female', 'Others'],
                datasets: [{
                    label: 'Demographic',
                    data: [],
                    backgroundColor: ['#0b6e00', '#006ca2', '#ff3333']
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Community's Demograaphic",
                    fontSize: 25,
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    methods: {
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
        fetchItems: function(){
            var db = firebase.firestore();
            db.collection('gender').get().then((querySnapShot) =>{
                querySnapShot.forEach((doc) => {
                    if (doc.data().gender == 'Male'){
                        this.results[0] += 1;
                    }else if (doc.data().gender == 'Female'){
                        this.results[1] += 1;
                    }else{
                        this.results[2] += 1;
                    }
                });
                this.datacollection.datasets[0].data = this.results;
                this.renderChart(this.datacollection, this.options);
            });
        }
    }
}

