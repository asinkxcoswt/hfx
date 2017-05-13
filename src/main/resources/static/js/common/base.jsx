function bind( obj, ...methods ) {
    methods.forEach(( method ) => {
        try {
            obj[method] = obj[method].bind( obj );
        } catch (err) {
            throw `Cannot bind method ${method} to object ${obj} : ` + err;
        }
    });
}

export { bind }