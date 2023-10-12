import medusaRequest from "../../../../admin-ui/ui/src/services/request";

export default {
  bundles: {
    // create(payload) {
    //   const path = `/admin/bundles`;
    //   return medusaRequest("POST", path, payload);
    // },

    // retrieve(id) {
    //   const path = `/admin/bundles/${id}`;
    //   return medusaRequest("GET", path);
    // },

    // list(search = {}) {
    //   const path = `/admin/bundles`;
    //   return medusaRequest("GET", path);
    // },

    addProducts(id, payload) {
      const path = `/admin/bundles/${id}/products/batch`;
      return medusaRequest("POST", path, payload);
    },

    removeProducts(id, payload) {
      const path = `/admin/bundles/${id}/products/batch`;
      return medusaRequest("DELETE", path, payload);
    },
  },
};
