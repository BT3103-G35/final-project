import About from './components/About.vue'
import Landing from './components/HelloWorld.vue'
import Registration from './components/Register.vue'

export default[
    { path: '/', component: Landing},
    { path: '/about', component: About},
    { path: '/register', component: Registration}
]