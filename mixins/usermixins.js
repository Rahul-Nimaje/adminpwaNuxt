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
        async addUser(userData) {
            let userdata;
            try {
                userdata = await catalog.post('/users/register', userData);
                console.log("userdata", userdata);
                if (userdata) {
                    this.setToast('success', 'User Register', 'User Register Successfully')
                }
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
                    return response;
                }
            } catch (err) {
                throw new Error(err);
            }

        },
        async getUserList(condition) {
            let userData = null;
            try {
                userData = await catalog.post('/users/userlist', condition);
                console.log("userDataaaaaaa", userData)
            } catch (err) {
                throw new Error(err)
            }
            return userData
        },
        async bulkCreateUser(bulkUser) {
            let bulkCreatdUser = null
            try {
                bulkCreatdUser = await catalog.post('/users/bulkcreate', bulkUser);
                if (bulkCreatdUser) {
                    this.setToast('success', 'User Create', 'Users Created Successfully')
                }
            } catch (err) {
                this.setToast('error', 'User Create', err)
                throw new Error(err)
            }
            return bulkCreatdUser;
        },
        async deleteUsers(values) {
            console.log("values.........", values);
            try {
                const userIds = values.map(obj => obj.id);
                const deleteRes = await catalog.post('/users/deleteUsers', userIds);
                if (deleteRes) {
                    this.setToast('success', 'User Delete', 'User Deleted Successfully')
                    return deleteRes
                }
            } catch (err) {
                throw new Error(err)
            }
        }
    },
}