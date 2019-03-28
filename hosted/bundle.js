"use strict";

var handleDomo = function handleDomo(e, csrf) {
    e.preventDefault();

    $("#domoMessage").animate({ width: "hide" }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer(csrf);
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    // console.log(`domoForm props: ${props.csrf}`);

    return React.createElement(
        "form",
        { id: "domoForm",
            name: "domoForm",
            onSubmit: function onSubmit(e) {
                return handleDomo(e, props.csrf);
            },
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { htmlFor: "food" },
            "Favorite food: "
        ),
        React.createElement("input", { id: "domoFood", type: "text", name: "food", placeholder: "Domo's favorite food" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

// Sends a POST request to the server to delete a specific domo
var handleDelete = function handleDelete(e, csrf, domo) {
    e.preventDefault();

    // let parent = document.querySelector(`#${domo.name}DeleteForm`);
    // console.log(parent);
    // let key = parent.querySelector("input[name='_csrf']").value;
    // console.log(key);

    // console.log(`Deleted: ${domo.name} id: ${domo._id} csrf:${csrf}`);

    sendAjax("POST", $("#" + domo.name + "DeleteForm").attr("action"), $("#" + domo.name + "DeleteForm").serialize(), function () {
        loadDomosFromServer(csrf);
    });

    return false;
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        // console.log(`domoList props: ${props.csrf}`);
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                " Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                " Age: ",
                domo.age,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoFood" },
                " Favorite Food: ",
                domo.favoriteFood,
                " "
            ),
            React.createElement(
                "form",
                { id: domo.name + "DeleteForm", onSubmit: function onSubmit(e) {
                        return handleDelete(e, props.csrf, domo);
                    }, action: "/deleteDomo", method: "POST" },
                React.createElement("input", { type: "hidden", name: "domoID", value: domo._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { type: "submit", value: "Delete Domo" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
    // console.log(`Loading domos froms server. token=${csrf} caller=${caller}`);
    sendAjax("GET", "/getDomos", null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { csrf: csrf, domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { csrf: csrf, domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(messate) {
    $("#errorMessage").text(messate);
    $("#domoMessage").animate({ width: "toggle" }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: "hide" }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
