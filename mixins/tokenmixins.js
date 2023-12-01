export default{
methods:{
    setToast(severity, summary, detail) {
        this.$toast.add({
            severity,
            summary,
            detail,
            life: 3000 // Display time in milliseconds
        })
    },
}
}