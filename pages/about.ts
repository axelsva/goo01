import ejs from 'ejs';

export async function get_body(param_obj: object) {

    let result = '';

    const _data = {
        title: 'About',
        body: JSON.stringify(param_obj)
    }

    await ejs.renderFile('./pages/about.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });

    return result;

}
