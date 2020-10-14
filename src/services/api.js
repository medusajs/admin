import medusaRequest, { multipartRequest } from "./request"

export default {
  apps: {
    authorize(data) {
      const path = `/admin/apps/authorizations`
      return medusaRequest("POST", path, data)
    },

    list() {
      const path = `/admin/apps`
      return medusaRequest("GET", path)
    },
  },
  auth: {
    session() {
      const path = `/admin/auth`
      return medusaRequest("GET", path)
    },
    authenticate(details) {
      const path = `/admin/auth`
      return medusaRequest("POST", path, details)
    },
    deauthenticate(details) {
      return Promise.resolve()
      // const path = `/admin/auth`
      // return medusaRequest("DELETE", path)
    },
  },
  customers: {
    retrieve(customerId) {
      const path = `/admin/customers/${customerId}`
      return medusaRequest("GET", path)
    },
    list(search = "") {
      const path = `/admin/customers${search}`
      return medusaRequest("GET", path)
    },
  },
  store: {
    retrieve() {
      const path = `/admin/store`
      return medusaRequest("GET", path)
    },

    update(update) {
      const path = `/admin/store`
      return medusaRequest("POST", path, update)
    },

    addCurrency(code) {
      const path = `/admin/store/currencies/${code}`
      return medusaRequest("POST", path)
    },

    removeCurrency(code) {
      const path = `/admin/store/currencies/${code}`
      return medusaRequest("DELETE", path)
    },
  },
  shippingProfiles: {
    list() {
      const path = `/admin/shipping-profiles`
      return medusaRequest("GET", path)
    },

    create(data) {
      const path = `/admin/shipping-profiles`
      return medusaRequest("POST", path, data)
    },

    retrieve(profileId) {
      const path = `/admin/shipping-profiles/${profileId}`
      return medusaRequest("GET", path)
    },

    update(profileId, update) {
      const path = `/admin/shipping-profiles/${profileId}`
      return medusaRequest("POST", path, update)
    },
  },
  products: {
    create(product) {
      const path = `/admin/products`
      return medusaRequest("POST", path, product)
    },

    retrieve(productId) {
      const path = `/admin/products/${productId}`
      return medusaRequest("GET", path)
    },

    update(productId, update) {
      const path = `/admin/products/${productId}`
      return medusaRequest("POST", path, update)
    },

    delete(productId) {
      const path = `/admin/products/${productId}`
      return medusaRequest("DELETE", path)
    },

    list(search = "") {
      let path = `/admin/products${search}`
      return medusaRequest("GET", path)
    },

    variants: {
      create(productId, variant) {
        const path = `/admin/products/${productId}/variants`
        return medusaRequest("POST", path, variant)
      },

      retrieve(productId, variantId) {
        const path = `/admin/products/${productId}/variants/${variantId}`
        return medusaRequest("GET", path)
      },

      update(productId, variantId, update) {
        const path = `/admin/products/${productId}/variants/${variantId}`
        return medusaRequest("POST", path, update)
      },

      delete(productId, variantId) {
        const path = `/admin/products/${productId}/variants/${variantId}`
        return medusaRequest("DELETE", path)
      },

      list(productId) {
        const path = `/admin/products/${productId}/variants`
        return medusaRequest("GET", path)
      },
    },

    options: {
      create(productId, option) {
        const path = `/admin/products/${productId}/options`
        return medusaRequest("POST", path, option)
      },

      delete(productId, optionId) {
        const path = `/admin/products/${productId}/options/${optionId}`
        return medusaRequest("DELETE", path)
      },

      update(productId, optionId, update) {
        const path = `/admin/products/${productId}/options/${optionId}`
        return medusaRequest("POST", path, update)
      },
    },
  },

  orders: {
    create(order) {
      const path = `/admin/orders`
      return medusaRequest("POST", path, order)
    },

    retrieve(orderId) {
      const path = `/admin/orders/${orderId}`
      return medusaRequest("GET", path)
    },

    update(orderId, update) {
      const path = `/admin/orders/${orderId}`
      return medusaRequest("POST", path, update)
    },

    list(search = "") {
      let path = `/admin/orders${search}`
      return medusaRequest("GET", path)
    },

    complete(orderId) {
      const path = `/admin/orders/${orderId}/complete`
      return medusaRequest("POST", path, {})
    },

    archive(orderId) {
      const path = `/admin/orders/${orderId}/archive`
      return medusaRequest("POST", path, {})
    },

    capturePayment(orderId) {
      const path = `/admin/orders/${orderId}/capture`
      return medusaRequest("POST", path, {})
    },

    createShipment(orderId, payload) {
      const path = `/admin/orders/${orderId}/shipment`
      return medusaRequest("POST", path, payload)
    },

    createFulfillment(orderId, payload) {
      const path = `/admin/orders/${orderId}/fulfillment`
      return medusaRequest("POST", path, payload)
    },

    refund(orderId, payload) {
      const path = `/admin/orders/${orderId}/refund`
      return medusaRequest("POST", path, payload)
    },

    requestReturn(orderId, payload) {
      const path = `/admin/orders/${orderId}/return`
      return medusaRequest("POST", path, payload)
    },

    receiveReturn(orderId, returnId, payload) {
      const path = `/admin/orders/${orderId}/return/${returnId}/receive`
      return medusaRequest("POST", path, payload)
    },

    cancel(orderId) {
      const path = `/admin/orders/${orderId}/cancel`
      return medusaRequest("POST", path, {})
    },
  },

  shippingOptions: {
    create(shippingOption) {
      const path = `/admin/shipping-options`
      return medusaRequest("POST", path, shippingOption)
    },

    retrieve(id) {
      const path = `/admin/shipping-options/${id}`
      return medusaRequest("POST", path)
    },

    delete(id) {
      const path = `/admin/shipping-options/${id}`
      return medusaRequest("DELETE", path)
    },

    list(search) {
      const params = Object.keys(search)
        .map(k => `${k}=${search[k]}`)
        .join("&")
      const path = `/admin/shipping-options${params && `?${params}`}`
      return medusaRequest("GET", path)
    },

    update(id, update) {
      const path = `/admin/shipping-options/${id}`
      return medusaRequest("POST", path, update)
    },
  },

  discounts: {
    create(discount) {
      const path = `/admin/discounts`
      return medusaRequest("POST", path, discount)
    },

    retrieve(discountId) {
      const path = `/admin/discounts/${discountId}`
      return medusaRequest("GET", path)
    },

    update(discountId, update) {
      const path = `/admin/discounts/${discountId}`
      return medusaRequest("POST", path, update)
    },

    delete(discountId) {
      const path = `/admin/discounts/${discountId}`
      return medusaRequest("POST", path, update)
    },

    list() {
      const path = `/admin/discounts`
      return medusaRequest("GET", path)
    },
  },

  regions: {
    list() {
      const path = `/admin/regions`
      return medusaRequest("GET", path)
    },

    retrieve(id) {
      const path = `/admin/regions/${id}`
      return medusaRequest("GET", path)
    },

    create(region) {
      const path = `/admin/regions`
      return medusaRequest("POST", path, region)
    },

    update(id, region) {
      const path = `/admin/regions/${id}`
      return medusaRequest("POST", path, region)
    },

    delete(id) {
      const path = `/admin/regions/${id}`
      return medusaRequest("DELETE", path)
    },

    fulfillmentOptions: {
      list(regionId) {
        const path = `/admin/regions/${regionId}/fulfillment-options`
        return medusaRequest("GET", path)
      },
    },
  },

  uploads: {
    create(files) {
      const formData = new FormData()
      for (const f of files) {
        formData.append("files", f)
      }

      return multipartRequest("/admin/uploads", formData)
    },

    delete(file) {
      const path = `/admin/uploads/delete`
      return medusaRequest("POST", path, { file })
    },
  },
}
