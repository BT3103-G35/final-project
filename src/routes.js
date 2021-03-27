import About from './components/About.vue'
import Landing from './components/HelloWorld.vue'
import Registration from './components/Register.vue'
import LogIn from './components/LogIn.vue'
import Profile from './components/Profile.vue'

export default[
    { path: '/', name: 'landing', component: Landing},
    { path: '/about', name: 'about', component: About},
    { path: '/register', name: 'register', component: Registration},
    { path: '/login', name: 'login', component: LogIn},
    { path: '/profile', name: 'profile', component: Profile}
]