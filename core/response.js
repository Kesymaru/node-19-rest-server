module.exports = class Response {
    static Options () {
        return {
            'Status-Code': 200,
            'Content-Type': 'application/json'
        }
    }

    static Send (res, data, options = {}) {
        options = Object.assign(Response.Options(), options);

        Object.keys(options).forEach(h => res.setHeader(h, options[h]));
        // res.statusCode = options.statusCode;
        // res.setHeader('Content-Type', options.contentType);

        let response = data;
        if(typeof data !== 'string') response = JSON.stringify(data);
        res.end(response);
    }

    static BadRequest (res, error = new Error('Something when wrong!')) {
        let data = {success: false, error: error.message};
        Response.Send(data, {
            statusCode: 404,
            contentType: 'application/json'
        });
    }

    static ApplicationError (res, error) {
        console.error(error);
        let data = {success: false, error: error.message};
        Response.Send(res, data, {
            statusCode: 500,
            contentType: 'application/json'
        });
    }
}