import { createStore } from 'vuex'

export default createStore({
  state: {
    products: [] as any[],
    user: {} as any,
    isAuthenticated: false

  },
  mutations: {
    test () {
      console.log('hola desde vuex')
    }

  },
  actions: {
    async fetchProducts ({ state }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/products`)
        const res = await req.json()
        if (res.success) {
          state.products = res.data.reverse()
        }
        return res
      } catch (error: any) {
        console.log(error.type)

        return { success: true, message: error }
      }
    },
    async fetchSales ({ state }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/sales`, { headers: { Authorization: `bearer ${state.user.token} ` } })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error.type)
        return { success: false, message: error }
      }
    },
    async fetchUsers ({ state }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/users`, { headers: { Authorization: `bearer ${state.user.token} ` } })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error.type)
        return { success: false, message: error }
      }
    },
    async fetchBoletas ({ state }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/boletas`, { headers: { Authorization: `bearer ${state.user.token} ` } })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error.type)
        return { success: false, message: error }
      }
    },
    async fetchFacturas ({ state }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/facturas`, { headers: { Authorization: `bearer ${state.user.token} ` } })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error.type)
        return { success: false, message: error }
      }
    },
    async fetchSaleDetail ({ state }, { id }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/saleDetail/${id}`, { headers: { Authorization: `bearer ${state.user.token} ` } })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error.type)
        return { success: false, message: error }
      }
    },
    async fetchBoletaDetail ({ state }, { id }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/boletaDetail/${id}`, { headers: { Authorization: `bearer ${state.user.token} ` } })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error.type)
        return { success: false, message: error }
      }
    },
    async fetchFacturaDetail ({ state }, { id }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/facturaDetail/${id}`, { headers: { Authorization: `bearer ${state.user.token} ` } })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error.type)
        return { success: false, message: error }
      }
    },

    async fetchPackProducts ({ state }, { id }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/pack_product/${id}`, { headers: { Authorization: `bearer ${state.user.token} ` } })
        const res = await req.json()
        return res
      } catch (error: any) {
        return { data: null, success: true, message: error }
      }
    },
    async fetchRoles () {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/user_roles`)
        const res = await req.json()
        return res
      } catch (error: any) {
        return { success: true, message: error }
      }
    },

    async userLogin ({ state }, { credentials }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/login`, {
          method: 'POST',
          body: JSON.stringify(credentials)

        })
        const res = await req.json()
        console.log(res)

        if (res.success) {
          state.user = res.data
          state.isAuthenticated = res.success
          localStorage.token = res.data.token
        }
        return res
      } catch (error: any) {
        console.log(error)

        return { success: false, message: error }
      }
    },
    async userSignup ({ state }, { user }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/signup`, {
          method: 'POST',
          headers: { Authorization: `bearer ${state.user.token} ` },
          body: JSON.stringify(user)

        })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error)

        return { success: false, message: error }
      }
    },
    async changePassword ({ state }: any, { currentPassword, newPassword }: any) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/changePassword`, {
          method: 'POST',
          headers: { Authorization: `bearer ${state.user.token} ` },
          body: JSON.stringify({ currentPassword, newPassword })

        })
        const res = await req.json()
        return res
      } catch (error: any) {
        console.log(error)

        return { success: false, message: error }
      }
    },

    async saveProduct ({ state }, { action, product }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/product`, {
          method: action === 'add' ? 'POST' : 'PUT',
          headers: { Authorization: `bearer ${state.user.token} ` },
          body: JSON.stringify(product)

        })
        const res: any = await req.json()
        if (res.success) {
          if (action === 'add') state.products.unshift(res.data)
          if (action === 'edit') {
            const index = state.products.findIndex(el => el.id === product.id)
            console.log(index)
            state.products[index] = res.data
          }
        }
        return res
      } catch (error) {

      }
    },
    async savePackingProduct ({ state }, { action, data }) {
      console.log({ action })
      data.packedProducts = data.packedProducts.map(({ id, productId, code, packing, measureUnit, priceBuy, priceSale, stock }: any) => ({
        id,
        productId,
        code,
        packing,
        measureUnit,
        priceBuy,
        priceSale,
        stock
      }))

      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/product`, {
          method: action === 'add' ? 'POST' : 'PUT',
          headers: { Authorization: `bearer ${state.user.token} ` },
          body: JSON.stringify(data)

        })
        const res: any = await req.json()
        // if (res.success) {
        //   if (action === 'add') state.products.unshift(res.data)
        //   if (action === 'edit') {
        //     const index = state.products.findIndex(el => el.id === product.id)
        //     console.log(index)
        //     state.products[index] = res.data
        //   }
        // }
        return res
      } catch (error) {

      }
    },
    async deleteProduct ({ state }, { productId }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/product/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `bearer ${state.user.token} ` }
        })
        const res: any = await req.json()
        return res
      } catch (error) {
        return { success: false, message: 'Ocurrio un error al eliminar el producto' }
      }
    },
    async printerTicket (_, { text, qrContent }) {
      if (!text.includes('TICKET')) { text += '\n\n Consulte los detalle de su comprobante en:\n www.inversionesvilver.com/vilcherrez/comprobante/consultar' }
      console.log(text)

      const req:any = await fetch(`${process.env.VUE_APP_URL_PRINTER}/printer/${localStorage.printer}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          qr_content: qrContent
        })
      })
      const res = await req.text()
      return res
    },
    async testEncode (_, { text }) {
      const req = await fetch(`${process.env.VUE_APP_URL_PRINTER}/decodeurl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          qr_content: 'hola mundo'
        })
      })
      const res = await req.text()
      return res
    },
    async getInfoDoc ({ state }, { typeDoc, document }) {
      let req: any
      console.log(typeDoc)
      if (typeDoc === 1) req = await fetch(`${process.env.VUE_APP_URL_API}/dni/${document}`, { headers: { Authorization: `bearer ${state.user.token} ` } })
      if (typeDoc === 6) req = await fetch(`${process.env.VUE_APP_URL_API}/ruc/${document}`, { headers: { Authorization: `bearer ${state.user.token} ` } })

      const res = await req.json()
      return res.data
    },
    async saveSale ({ state }, { soldProducts, client, typeProof, currency }) {
      console.log('currency ', currency)

      const req = await fetch(`${process.env.VUE_APP_URL_API}/sale`,
        {
          method: 'POST',
          headers: { Authorization: `bearer ${state.user.token} ` },
          body: JSON.stringify({
            soldProducts,
            client,
            userId: state.user.id,
            typeProof,
            currency
          })
        })

      const res = await req.json()
      return res.data
    },
    async sendSummaries ({ state }) {
      const req = await fetch(`${process.env.VUE_APP_URL_API}/sendResumenes`,
        {
          method: 'POST',
          headers: { Authorization: `bearer ${state.user.token} ` }
        })

      const res = await req.json()
      return res
    },
    async testEmail ({ state }) {
      const req = await fetch(`${process.env.VUE_APP_URL_API}/testEmail`,
        {
          headers: { Authorization: `bearer ${state.user.token} ` }
        })

      const res = await req.json()
      return res
    },
    async darBaja ({ state }, { proofId, typeProof, motivoBaja }) {
      let endpoint = ''
      let body = ''
      if (typeProof === 'boleta') {
        endpoint = 'bajaBoleta'
        body = JSON.stringify({ idBoleta: proofId })
      }
      if (typeProof === 'factura') {
        endpoint = 'bajaFactura'
        body = JSON.stringify({ idFactura: proofId, motivoBaja })
      }

      const req = await fetch(`${process.env.VUE_APP_URL_API}/${endpoint}`,
        {
          method: 'POST',
          headers: { Authorization: `bearer ${state.user.token} ` },
          body
        })

      const res = await req.json()
      return res
    },
    async fetchProof (_, { proof }) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/comprobante`,
          {
            method: 'POST',
            body: JSON.stringify(proof)
          })

        const res = await req.json()
        return res
      } catch (error) {
        return { success: false, message: error }
      }
    },
    async sendProofByEmail ({ state }: any, { dataProof, email }: any) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/sendProofByEmail`,
          {
            method: 'POST',
            headers: { Authorization: `bearer ${state.user.token} ` },
            body: JSON.stringify({ dataProof, email })
          })

        const res = await req.json()
        return res
      } catch (error) {
        return { success: false, message: error }
      }
    },
    async editUser ({ state }: any, { user }: any) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/user`,
          {
            method: 'PUT',
            headers: { Authorization: `bearer ${state.user.token} ` },
            body: JSON.stringify(user)
          })

        const res = await req.json()
        return res
      } catch (error) {
        return { success: false, message: error }
      }
    },
    async deleteUser ({ state }: any, { userId }: any) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/user/${userId}`,
          {
            method: 'DELETE',
            headers: { Authorization: `bearer ${state.user.token} ` }
          })

        const res = await req.json()
        return res
      } catch (error) {
        return { success: false, message: error }
      }
    },
    async restoreUser ({ state }: any, { userId }: any) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/restoreUser/${userId}`,
          {
            method: 'POST',
            headers: { Authorization: `bearer ${state.user.token} ` }
          })

        const res = await req.json()
        return res
      } catch (error) {
        return { success: false, message: error }
      }
    },
    async donwloadProofReports ({ state }: any, { dateFrom, dateTo }: any) {
      try {
        const req = await fetch(`${process.env.VUE_APP_URL_API}/proofReports`,
          {
            method: 'POST',
            headers: { Authorization: `bearer ${state.user.token} ` },
            body: JSON.stringify({
              dateFrom, dateTo
            })
          })

        const res = await req.blob()
        return res
      } catch (error) {
        return { success: false, message: error }
      }
    }

  },
  modules: {
  }
})
