module.exports = {
    index(req, res){
        res.status(200).render('index', { title: 'Express' });
    },
    post(req, res){
        return res.status(201).render('index', { title: 'POSTED Express' });
    },
    notindex(req, res){
        return res.status(200).render('notindex', { title: 'Express, but NOTINDEX' });
    },
}