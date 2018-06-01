import {Model} from 'mongoose';
import * as testModel from '../models/testModel';
import TestCtrl from './testController';
import * as path from 'path';

module.exports = function (passport: any) {
    const testCtrl = new TestCtrl<Model<testModel.ITestModel>>(testModel.default);

    let publicModule: any = {};

    publicModule.home_get = (req: any, res: any) => {
        res.sendFile(path.resolve('public/index.html'));
    };

    publicModule.login_post = (req: any, res: any, next: any) => {
        passport.authenticate('local-login', function(err: any, user: any, info: any) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting signup
            if (! user) {
                return res.send({ success : false, message : 'login failed' });
            }
            return res.send({ success : true, message : 'login succeeded' });
        })(req, res);
    };

    publicModule.signup_post = (req: any, res: any, next: any) => {
        passport.authenticate('local-signup', function(err: any, user: any, info: any) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting signup
            if (! user) {
                return res.send({ success : false, message : 'signup failed' });
            }
            return res.send({ success : true, message : 'signup succeeded' });
        })(req, res);
    };

    publicModule.logout_get = (req: any, res: any) => {
        req.logout();
        res.redirect('/');
    };

    /**
     * Test examples for api callback functions
     * */
    publicModule.test_get = (req: any, res: any) => {
        testCtrl.getAll(req, res);
    };

    publicModule.test_post = (req: any, res: any) => {
        testCtrl.insert(req, res);
    };

    publicModule.test_delete = (req: any, res: any) => {
        testCtrl.delete(req, res);
    };
    /**
     * ============================================
     * */

    return publicModule;
};


let is_logged_in = (req: any, res: any, next: any) => {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}