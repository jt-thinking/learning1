/**
 * Created by lifetea on 16/9/20.
 */


import conf from '../config/index'

const { menu, config,user } = conf;

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

Vue.config.debug = true;

var count = 1;

var role = []


const store = new Vuex.Store({
    state: {
        menu,
        config,
        // user,
        count,
        role,
    },
    mutations: {
        doLogin (state) {
            state.user.status = true;
        },
        expanded (state,ob){
            ob.el.meta.expanded = ob.bool;
        },
        SIDEBAR (state, status = true) {
            state.config.sidebar = status
        },
        setRole(state,role){
            state.role = role
        }
    },
    actions: {
        doLogin (commit) {
            commit('doLogin');
        },
        expanded (commit,ob){
            store.commit('expanded',ob);
        },
        // Sidebar: show, hide, toggle
        SHOW_SIDEBAR ({ commit }) {
            commit('SIDEBAR', true)
        },
        HIDE_SIDEBAR ({ commit }) {
            commit('SIDEBAR', false)
        },
        TOGGLE_SIDEBAR ({ commit, state }) {
            commit('SIDEBAR', !state.config.sidebar)
        }
    },
    modules: {
        // auth
    },
    strict: debug,
})

export default store