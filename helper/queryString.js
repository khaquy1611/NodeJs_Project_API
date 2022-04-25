export const QueryString = (req) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = req.query.perPage ? parseInt(req.query.perPage) : 10;
    let skip = (page - 1) * perPage;
    let sort = {};
    if (req.query.sortBy && req.query.sortOrder) {
      sort[req.query.sortBy] = req.query.sortOrder == "asc" ? 1 : -1;
    } else {
      sort["createdAt"] = -1;
    }

    return {
        page ,
        perPage ,
        skip ,
        sort
    };
}



