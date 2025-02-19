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
    ldap: {
      login: () => `${routes.dev.default}ldap/login`,
    },
    groups: {
      addFormationLevel: (departmentId) => `${routes.dev.default}formation-levels/add/${departmentId}`,
      addGroup: (formationLevelId) => `${routes.dev.default}groups/add/${formationLevelId}`,
      addSubGroup: (groupId) => `${routes.dev.default}subgroups/add/${groupId}`,
      deleteFormationLevel: (formationLevelId) => `${routes.dev.default}formation-levels/delete/${formationLevelId}`,
      deleteGroup: (groupId) => `${routes.dev.default}groups/delete/${groupId}`,
      deleteSubGroup: (subgroupId) => `${routes.dev.default}subgroups/delete/${subgroupId}`,
      getFormationLevels: (departmentId) => `${routes.dev.default}departments/${departmentId}/formation-levels`,
    },
    semesters: {
      get: (curriculumId) => `${routes.dev.default}curriculum/${curriculumId}/semesters`,
    },
    statistics: {
      getCoursesForTeacher: (teacheId) =>`${routes.dev.default}week_request/${teacheId}`,
      getCoursesForHalfGroup: (halfGroupId) =>`${routes.dev.default}week_request/half_group/${halfGroupId}`
    },
    subjects: {
      getFromSemester: (semesterId) => `${routes.dev.default}semester/${semesterId}/subjects`,
      getFromDepartment: (departmentId) => `${routes.dev.default}department/${departmentId}/subjects`
    },
    teachers: {
      addForDepartment: (departmentId) => `${routes.dev.default}teacher/add/department/${departmentId}`,
      addSubject: (teacheId, subjectId) => `${routes.dev.default}teacher/${teacheId}/add-subject/${subjectId}`,
      deleteForDepartment: (teacheId, departmentId) => `${routes.dev.default}teacher/delete/${teacheId}/${departmentId}`,
      deleteSubject: (teacheId, subjectId) => `${routes.dev.default}teacher/${teacheId}/remove-subject/${subjectId}`,
      getFromDepartment: (departmentId) => `${routes.dev.default}teacher/department/${departmentId}`,
      update: () => `${routes.dev.default}teacher/update`,
    },
    users: {
      add: () => `${routes.dev.default}users/add`,
      delete: (userId) => `${routes.dev.default}users/delete/${userId}`,
      getAll: () => `${routes.dev.default}users`,
      getByEmail: (email) => `${routes.dev.default}users/email?email=${email}`,
      update: () => `${routes.dev.default}users/update`,
    },
    insertData: (fileId) => `http://localhost:8600/insert-data/${fileId}`,
    insertM3C: () => `http://localhost:8600/insertM3C`,
  },
};

export default routes;