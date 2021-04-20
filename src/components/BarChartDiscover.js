import {Bar} from 'vue-chartjs'
import firebase from "firebase/app";
//import * as Bar from 'chart.js';


export default{
    extends: Bar,
    created(){
        this.setupFirebase();
    },
    data: function() {
        return {
            loggedIn: false,
            currentUser: false,
            results: [0, 0, 0, 0, 0, 0, 0, 0],
            datacollection: {
                labels: ['top', 'bottom', 'outerwear', 'footwear', 'dress', 'headwear', 'accessory', 'others'],
                datasets: [{
                    label: 'Number of clothing',
                    data: [],
                    backgroundColor: ['#0b6e00', '#006ca2', '#ff3333', '#d60001', '#f87979', '#f10979', '#d60001', '#0b6e00']
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks :{
                            beginAtZero: true,
                            fontSize: 15,
                            stepSize: 1,
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    xAxes: [{
						ticks: {
							beginAtZero: true,
                            fontSize: 15,
						},
						gridLines: {
							display: false
						}
					}]
                },
                legend: {display: false},
                title: {
                    display: true,
                    text: 'Total number of each clothing type in Discover',
                    fontSize: 25,
                },
                responsive: true,
                maintainAspectRatio: false
            },
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
            db.collection('marketplace').get().then((querySnapShot) =>{
                querySnapShot.forEach((doc) => {
                    if (doc.data().category == 'top'){
                        this.results[0] += 1;
                    }else if (doc.data().category == 'bottom'){
                        this.results[1] += 1;
                    }else if (doc.data().category == 'outerwear'){
                        this.results[2] += 1;
                    }else if (doc.data().category == 'footwear'){
                        this.results[3] += 1;
                    }else if (doc.data().category == 'dress'){
                        this.results[4] += 1;
                    }else if (doc.data().category == 'headwear'){
                        this.results[5] += 1;
                    }else if (doc.data().category == 'accessory'){
                        this.results[6] += 1;
                    }else{
                        this.results[7] += 1;
                    }
                });
                this.datacollection.datasets[0].data = this.results;
                this.renderChart(this.datacollection, this.options);           
            });
        }
    }
}