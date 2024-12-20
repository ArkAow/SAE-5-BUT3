// Ici c'est les routes vers le backend !

const routes = {
  dev: {
    default: "http://localhost:8600/",
    groups: {
      getGroups: (classID) => `${routes.dev.default}groups/${classID}`,
      getSubGroups: (groupId) => `${routes.dev.default}groups/${groupId}/half_group`,
      addGroups: () => `${routes.dev.default}groups/add`,
      addSubGroups: () => `${routes.dev.default}groups/add/halfgroup`,
      deleteGroup: (id) => `${routes.dev.default}groups/delete/${id}`,
      deleteSubGroup: (id) => `${routes.dev.default}groups/delete/halfgroup/${id}`,
    },
    courseTypes: {
      get: () => `${routes.dev.default}coursetypes`,
      add: () => `${routes.dev.default}coursetypes/add`,
      delete: (id) => `${routes.dev.default}coursetypes/delete/${id}`,
    },
    subjects: {
      get: (semesterId) => `${routes.dev.default}semester/${semesterId}/subjects`
    },
    semesters: {
      get: (curriculumId) => `${routes.dev.default}curriculum/${curriculumId}/semesters`
    },
    teachers: {
      add: () => `${routes.dev.default}teacher/add`,
      get: () => `${routes.dev.default}teacher`,
      delete: () => `${routes.dev.default}teacher/delete`,
      update: () => `${routes.dev.default}teacher/update`,
    },
    courses: {
      getAll: () => `${routes.dev.default}courses`,
      getBySubject: (id) => `${routes.dev.default}subject/${id}/courses`,
      getByTeacher: (id) => `${routes.dev.default}teacher/${id}/courses`,
      add: () => `${routes.dev.default}courses/add`,
      delete: (id) => `${routes.dev.default}courses/${id}`,
      update: (id) => `${routes.dev.default}courses/${id}`,
    },
  },
  insertM3C: "http://localhost:8600/insertM3C",
  insertData: "http://localhost:8600/insert-data",

};

export default routes;