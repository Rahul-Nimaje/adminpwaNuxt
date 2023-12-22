import catalog from '../services/catalog'
export default {
    methods: {
        async getcategoryList(query) {
            let categoryList = [];
            try {
                categoryList = await catalog.get('/category/categorlist', query)
            } catch (err) {
                throw new Error(err)
            }
            return categoryList
        },
        async addCategories(categoryData) {
            let response;
            try {
                response = await catalog.post('/category/addcategory', categoryData);
            } catch (err) {
                throw new Error(err)
            }
            return response
        }
    }
}