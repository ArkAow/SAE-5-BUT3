// Ici c'est les routes vers le backend !

const routes = {
  dev: {
    default: "http://localhost:8600/",
    courseTypes: {
      add: () => `${routes.dev.default}coursetypes/add`,
      delete: (id) => `${routes.dev.default}coursetypes/delete/${id}`,
      get: () => `${routes.dev.default}coursetypes`,
    },
    courses: {
      delete: (id) => `${routes.dev.default}courses/delete/${id}`,
      getAll: () => `${routes.dev.default}courses`,
      getBySubject: (id) => `${routes.dev.default}subject/${id}/courses`,
      getByTeacher: (id) => `${routes.dev.default}teacher/${id}/courses`,
      save: () => `${routes.dev.default}courses/save`,
    },
    curriculums: {
      getCurriculums: () => `${routes.dev.default}curriculums`,
    },
    departments: {
      add: () => `${routes.dev.default}department/add`,
      delete: (id) => `${routes.dev.default}department/delete/${id}`,
      get: () => `${routes.dev.default}department`,
      update: () => `${routes.dev.default}department/update`,
    },
    groups: {
      addGroups: () => `${routes.dev.default}groups/add`,
      addSubGroups: () => `${routes.dev.default}groups/add/halfgroup`,
      deleteGroup: (id) => `${routes.dev.default}groups/delete/${id}`,
      deleteSubGroup: (id) => `${routes.dev.default}groups/delete/halfgroup/${id}`,
      getGroups: (classID) => `${routes.dev.default}groups/${classID}`,
      getSubGroups: (groupId) => `${routes.dev.default}groups/${groupId}/half_group`,
    },
    semesters: {
      get: (curriculumId) => `${routes.dev.default}curriculum/${curriculumId}/semesters`,
    },
    subjects: {
      get: (semesterId) => `${routes.dev.default}semester/${semesterId}/subjects`,
    },
    teachers: {
      add: () => `${routes.dev.default}teacher/add`,
      delete: () => `${routes.dev.default}teacher/delete`,
      get: () => `${routes.dev.default}teacher`,
      update: () => `${routes.dev.default}teacher/update`,
    },
    users: {
      getAll: () => `${routes.dev.default}users`,
    },
  },
  insertData: "http://localhost:8600/insert-data",
  insertM3C: "http://localhost:8600/insertM3C",
};

export default routes;