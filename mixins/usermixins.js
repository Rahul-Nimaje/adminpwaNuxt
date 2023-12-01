import catalog from "@/services/catalog"
export default {
    data() {
        return {
            mixinData: 'This is from the mixin',
        };
    },
    methods: {
        getToken() {
            return this.$store.state.user.user.token;
        },
        async adduser(condition) {
            let userdata;
            try {
                userdata = await catalog.post('/users/userList', condition);
                console.log("userdata", userdata);
            } catch (err) {
                throw new Error(err)
            }
            return userdata
        },
        async updateUser(userInfo, toast) {
            console.log("toast.......", toast)
            try {
                const response = await catalog.post(
                    "/users/updateProfile",
                    userInfo
                );
                if (response) {
                    console.log("response.data", response)
                    this.$store.dispatch('userInfo', response)
                    this.setToast(
                        toast.severity,
                        toast.subject,
                        toast.details
                    );
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getUserList(condition) {
            let userData = null;
            try {
                userData = await catalog.post('/users/userlist', condition);
                console.log("userDataaaaaaa",userData)
            } catch (err) {
                throw new Error(err)
            }
            return userData
        }
    },
}