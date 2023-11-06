import ejs from 'ejs';
import QRCode from 'qrcode'

import * as mDB from './db_module';
import * as mClass from './_clases';



function get_ipv4() {

    let result: Array<string> = [];

    var os = require('os');
    let ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        let alias = 0;

        ifaces[ifname].forEach(function (iface: object) {

            if (('family' in iface) && ('internal' in iface) && ('address' in iface)) {

                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }

                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    //console.log(ifname + ':' + alias, iface.address);
                    result.push('' + iface.address);
                } else {
                    // this interface has only one ipv4 adress
                    //console.log(ifname, iface.address);
                    result.push('' + iface.address);
                }
                ++alias;
            }
        });

    });
    return result;
}

async function get_QR(address: Array<string>) {

    let result = '';

    for (let i = 0; i < address.length; i++) {

        const _str = `https://${address[i]}:8000`;
        await QRCode.toDataURL(_str)
            .then((url) => {
                result += `<br>${_str}<br><img src="${url}" /><br>`;
            })
            .catch((err) => { throw err })
    }

    return result
}


export async function get_body(param_obj: mClass.RouteParam) {

    let result = '';

    const _data = {
        title: 'INIT',
        msg: ''
    }


    if (param_obj && ('user' in param_obj)) {

        const user_id = mClass.getIDUserRegistr(param_obj.user);
        if (!user_id) {
            throw new Error("Error: Please Login");
        }

        if (!mClass.isRoleAdmin(param_obj.user)) {
            throw new Error("Error: User role not Admin");
        }
    }


    if (param_obj && ('arg' in param_obj)) {
        if (param_obj.arg && ('btn' in param_obj.arg)) {

            switch (param_obj.arg.btn) {

                case 'cmd_dbcreate':
                    try {

                        await mDB.db_CreateDataBase()
                            .then(() => { _data.msg = 'DataBase created ' })
                            .catch((err) => { throw err });

                    } catch (err) {
                        throw err;
                    }

                    break;
            }
        }
    }


    const _address = get_ipv4();
    _address.push('localhost');
    _data.msg += await get_QR(_address);

    

    await ejs.renderFile('./pages/init.ejs', _data, {}, function (err, str) {
        if (err)
            throw err;

        result = str;
    });


    return result;
}
