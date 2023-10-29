import * as mDB from './db_module.js';
import * as mClass from './_clases.js';

//import QRCode = require("qrcode");
import QRCode from 'qrcode'

async function getQR_net() {

    return new Promise((resolve) => {

        var os = require('os');
        let ifaces = os.networkInterfaces();

        Object.keys(ifaces).forEach(function (ifname) {
            let alias = 0;

            ifaces[ifname].forEach(async function (iface: object) {

                if (('family' in iface) && ('internal' in iface) && ('address' in iface)) {

                    if ('IPv4' !== iface.family || iface.internal !== false) {
                        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                        return;
                    }

                    if (alias >= 1) {
                        // this single interface has multiple ipv4 addresses
                        //console.log(ifname + ':' + alias, iface.address);
                    } else {
                        // this interface has only one ipv4 adress
                        //console.log(ifname, iface.address);

                        // With promises
                        const _str = `https://${iface.address}:8000`;
                        await QRCode.toDataURL(_str)
                            .then((url) => {
                                //console.log('qr:', url);
                                
                                const _res  = `<br><b>${_str} </b> <br> <img src="${url}" /> <br>`;
                                resolve(_res);
                            })
                            .catch((err) => {
                                console.error((err as Error).message)
                            })
                    }
                    ++alias;
                }
            });

        });
    })
}


export async function get_body(param_obj: mClass.RouteParam) {

    let result = `
    <h1>INIT page</h1>
    </br>
    <form  method="get">
        <button value=cmd_dbcreate  type="submit" name="btn" formaction="/init"> DB Create </button>
    </form>
    </br>
    `;

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
                            .then(() => { result += 'DataBase created' })
                            .catch((err) => { result += err.message });

                    } catch (err) {

                        result += (err as Error).message;

                    }

                    break;

            }

        }

    }

    const qr_data = await getQR_net();
    result += qr_data;


    return result;
}
