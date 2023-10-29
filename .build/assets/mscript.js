console.log("кукареку");


function User_Login() {

    event.preventDefault();

    const data_reg = new FormData(document.forms.form_reg);
    const q_str = new URLSearchParams(data_reg).toString() + "&login=1";

    console.log("User_Login: " + q_str);

    const opt = {
        method: 'POST',
        body: q_str,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    };

    fetch('/api/v1/user', opt)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            const div_status = document.querySelector("#reg_user_status");

            if (data.result === "ok") {

                div_status.innerHTML = "" + data_reg.get("name") + " - user login succes";
                document.cookie = data.data.cook;
                window.location.reload();
                return;

            } else if (data.result === "error") {
                div_status.innerHTML = "" + data.message;

            } else {
                div_status.innerHTML = "";

            }

            User_LogOut();
        })
        .catch(
            () => { User_LogOut(); }
        )
}

function User_Register(event) {

    event.preventDefault();

    const data_reg = new FormData(document.forms.form_reg);
    const q_str = new URLSearchParams(data_reg).toString();

    console.log("User_Register: " + q_str);

    const opt = {
        method: 'POST',
        body: q_str,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    };

    fetch('/api/v1/user', opt)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            const div_status = document.querySelector("#reg_user_status");

            if (data.result === "ok") {
                div_status.innerHTML = "" + data_reg.get("name") + " - user registered. Please login.";

            } else if (data.result === "error") {
                div_status.innerHTML = "" + data.message;

            } else {
                div_status.innerHTML = "";

            }
        })
}

function User_LogOut(event) {

    // event.preventDefault();
    console.log("User_LogOut");
    document.cookie = "s_uid=0; max-age=0";

    if (event) {
        const div_status = document.querySelector("#reg_user_status");
        div_status.innerHTML = 'User LogOut';
        window.location.reload();
    }

}

function Add_ToCart(a_ID, a_sum, a_name) {
    console.log("Add_ToCart - ", a_ID);

    const q_str = `idp=${a_ID}&sum=${a_sum}&name=${a_name}`;

    const opt = {
        method: 'POST',
        body: q_str,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    };

    fetch('/api/v1/cart', opt)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            const div_status = document.querySelector("#reg_user_status");

            if (data.result === "ok") {

                console.log(data.data);
                //div_status.innerHTML = "" + data_reg.get("name") + " - user registered";

            } else if (data.result === "error") {
                div_status.innerHTML = "" + data.message;

            } else {
                div_status.innerHTML = "";

            }
        })
}

function CartStatus() {

    let div_CartStatus = document.querySelector("#CartStatus");
    if (div_CartStatus) {

        const opt = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        };

        fetch('/api/v1/cart', opt)
            .then((response) => response.json())
            .then((data) => {

                //console.log(data);

                if (data.result === "ok") {

                    //console.log(data.data);
                    div_CartStatus.innerHTML = 'items in cart: ' + data.data;

                } else if (data.result === "error") {
                    //div_CartStatus.innerHTML = "" + data.message;
                    div_CartStatus.innerHTML = "";

                } else {
                    div_CartStatus.innerHTML = "";

                }

            })

    }

    setTimeout(CartStatus, 2000);
}

document.addEventListener("DOMContentLoaded", () => {


    let btn_User_Register = document.querySelector("#btn_reg");
    if (btn_User_Register) {
        btn_User_Register.addEventListener('click', User_Register);
    }


    let btn_LogOut = document.querySelector("#btn_logout");
    if (btn_LogOut) {
        btn_LogOut.addEventListener('click', User_LogOut);
    }

    setTimeout(CartStatus, 2000);


});

