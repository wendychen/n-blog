module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登入');
            return res.redirect('/signin');
        }
        // This was a big bug for me, I didn't put next() here.
        // Use next() to pass control to next handler.
        next();
    },
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登入');
            return res.redirect('back');
        }
        next();
    }
};