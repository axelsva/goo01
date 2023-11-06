import ejs from 'ejs';

export async function get_body(param_obj: object) {

    let result = '';

    const _data = {
        title: 'Home',
        body: JSON.stringify(param_obj)
    }

    await ejs.renderFile('./pages/home.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });

    return result;

}
