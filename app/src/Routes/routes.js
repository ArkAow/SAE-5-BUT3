// Ici c'est les routes vers le backend !

const routes = {
  dev: {
    default: "http://localhost:8600/",
    groups: {
      getGroups: (classID) => `${routes.dev.default}groups/${classID}`,
      getHalfGroups: (groupId) => `${routes.dev.default}groups/${groupId}/half_group`,
      add: () => `${routes.dev.default}groups/add`,
      deleteGroup: (id) => `${routes.dev.default}groups/delete/${id}`,
      deleteHalfGroup: (id) => `${routes.dev.default}groups/delete/halfgroup/${id}`,
    },
    courseTypes: {
      get: () => `${routes.dev.default}coursetypes`,
      add: () => `${routes.dev.default}coursetypes/add`,
      delete: (id) => `${routes.dev.default}coursetypes/delete/${id}`,
    },

  },
  insertM3C: "http://localhost:8600/insertM3C",
  insertData: "http://localhost:8600/insert-data",

};

export default routes;