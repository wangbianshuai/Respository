((ns) => {
    const { Index } = ns.api

    ns.api.DataAccess = class DataAccess extends Index {
        constructor(options) {
            super(options)
        }

        Request(type, entityName, request) {
            const data = {
                EntityName: entityName,
                Request: request
            }
            return this.PostFetch(`DataAccess/${type}`, data)
        }

        Query(entityName, request) {
            return this.Request("Query", entityName, request)
        }

        Create(entityName, request) {
            return this.Request("Create", entityName, request)
        }

        Update(entityName, request) {
            return this.Request("Update", entityName, request)
        }

        Delete(entityName, request) {
            return this.Request("Delete", entityName, request)
        }
    }

})($ns);