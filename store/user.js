export const state = () => ({
    user: {},
    auth: {
        loggedIn: false
    }
})
export const mutations = {
    userInfo(state, userInfo) {
        delete userInfo?.password;
        state.user = userInfo
        console.log("check......", state.userData);
        if (userInfo.token) {
            state.auth.loggedIn = true;
            localStorage.setItem('app-token', userInfo.token)
        }
    },
    logoutUser(state) {
        state.user = {};
        state.auth.loggedIn = false;
        localStorage.removeItem('app-token');
        this.$router.push('/');
    }
}
export const actions = {
    userInfo({ commit }, user) {
        console.log("commmmmmmm", user)
        commit('userInfo', user)
    },
}
export default {
    state,
    actions,
    mutations
}