module.exports = {
    index(req, res){
        return res.status(200).send('We are the users, we are the users ' +
        '<br /><img src="/images/owl.png"></img>');
    }
}