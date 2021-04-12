import {Bar} from 'vue-chartjs'
import firebase from "firebase/app";
//import * as Bar from 'chart.js';


export default{

    extends: Bar,
    data: function() {
        return {
            results: [0, 0, 0, 0, 0, 0, 0, 0],
            datacollection: {
                labels: ['top', 'bottom', 'outerwear', 'footwear', 'headwear', 'jewellery', 'accessory', 'others'],
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
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    xAxes: [{
						ticks: {
							beginAtZero: true
						},
						gridLines: {
							display: false
						}
					}]
                },
                legend: {display: false},
                title: {
                    display: true,
                    text: 'Total number of each clothing'
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    methods: {

        fetchItems: function(){
            var db = firebase.firestore();
            db.collection('marketplace').get().then((SnapShot) =>{
                SnapShot.forEach((doc) => {
                    if (doc.data().category == 'top'){
                        this.results[0] += 1;
                    }else if (doc.data().category == 'bottom'){
                        this.results[1] += 1;
                    }else if (doc.data().category == 'outerwear'){
                        this.results[2] += 1;
                    }else if (doc.data().category == 'footwear'){
                        this.results[3] += 1;
                    }else if (doc.data().category == 'headwear'){
                        this.results[4] += 1;
                    }else if (doc.data().category == 'jewellery'){
                        this.results[5] += 1;
                    }else if (doc.data().category == 'accessory'){
                        this.results[6] += 1;
                    }else{
                        this.results[7] += 1;
                    }
                    
                })
                this.datacollection.datasets[0].data = this.results
                this.renderChart(this.datacollection, this.options)
            })

        }
    },
    created(){
        this.fetchItems()
    }
}

