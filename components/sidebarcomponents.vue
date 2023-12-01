<template>
    <div>
<Button  icon="pi pi-align-justify" @click="visibleLeft = true" class="ma-2 p-button-text" style="color:white"  />
<Sidebar class="sidebarCss" :visible.sync="visibleLeft" :baseZIndex="1000">
    <TieredMenu v-if="visibleLeft" :model="items"/>
</Sidebar>
    </div>
</template>
<script>
export default {
    data(){
        return{
            visibleLeft:false,
            items:[
                {
                    label:"Profile",
                    icon:"pi pi-user",
                    to:"/userprofile"
                },
                {
                    label:"Users",
                    to:"/alluser"
                }
            ]
        }
    }
}
</script>