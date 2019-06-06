module.exports = {
    index(req, res){
        res.status(200).render('countries', { title: 'Countries' });
    }
}