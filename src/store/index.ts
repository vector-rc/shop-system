import { createStore } from 'vuex'

export default createStore({
  state: {
    hola: 'jajjajajaja',
    products: []
  },
  mutations: {
    test () {
      console.log('hola desde vuex')
    },
    hola () {
      return '123456'
    }

  },
  actions: {
    hola () {
      return '123456'
    },
    async fetchProducts ({ state }) {
      const req = await fetch(`${process.env.VUE_APP_URL_API}/products`)
      const res = await req.json()
      if (res.success) {
        state.products = res.data
      }
      return res
    },
    async saveProduct (_, { action, product }) {
      console.log(product)

      const req = await fetch(`${process.env.VUE_APP_URL_API}/product`, {
        method: action === 'add' ? 'POST' : 'PUT',
        headers: {
          Authorization: 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyTmFtZSI6InRlc3Q3In0.hwfJ7t6ua28NzQYUXflhJtogxoN3cJWdXWyJrJgTkzmtCJCiILUQ-R7B5Fk8jkMY791uMb1RrmjDqoIyxkqpDSXtG0Mwgd13bWBBB5JbSaakhZrU9lBlkb093jhGrGAUueVoHzQ7p0dfwRkSSJu-DDI-qk_pAY5H2XFYPitH2lE'
        },
        body: JSON.stringify(product)

      })
      const res = await req.json()
      return res
    }
  },
  modules: {
  }
})
