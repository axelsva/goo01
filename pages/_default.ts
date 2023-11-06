import ejs from 'ejs';
import * as mClass from './_clases';



export async function getPage(param_obj: mClass.RouteParam) {

    let result = '';
    
    const _data = {
        site_name: mClass.app_cfg.get('site_name'),
        site_tel: mClass.app_cfg.get('site_tel'),
        isUser: '',
        isUserID: 0,
        glRight: '<%- glBody %>',
        glBottom: JSON.stringify(param_obj)
    };

    if ('user' in param_obj) {
        _data.isUser = mClass.getNameUserRegistr(param_obj.user);
        _data.isUserID = mClass.getIDUserRegistr(param_obj.user);
    };


    await ejs.renderFile('./pages/_default.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });


    return result;
}
