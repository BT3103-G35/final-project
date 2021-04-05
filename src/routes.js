import About from './components/About.vue'
import Landing from './components/HelloWorld.vue'
import Registration from './components/Register.vue'
import LogIn from './components/LogIn.vue'
import Profile from './components/Profile.vue'
import AddItem from './components/AddItem.vue'
import Community from './components/Community.vue'
import AddItem2 from './components/AddItem2.vue'
import Wishlist from './components/Wishlist.vue'
import Marketplace from './components/Marketplace.vue'
import Item from './components/Item.vue'

export default[
    { path: '/', name: 'landing', component: Landing},
    { path: '/about', name: 'about', component: About},
    { path: '/register', name: 'register', component: Registration},
    { path: '/login', name: 'login', component: LogIn},
    { path: '/profile', name: 'profile', component: Profile},
    { path: '/community', name: 'community', component: Community},
    { path: '/additem', name: 'additem', component: AddItem},
    { path: '/additem2', name: 'additem2', component: AddItem2},
    { path: '/wishlist', name: 'wishlist', component: Wishlist},
    { path: '/marketplace', name: 'marketplace', component: Marketplace},
    { path: '/item', name: 'item', component: Item},
]