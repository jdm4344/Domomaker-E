const handleDomo = (e, csrf) => {
    e.preventDefault();

    $("#domoMessage").animate({width:"hide"},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer(csrf);
    });

    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm" 
            name="domoForm"
            onSubmit={(e) => handleDomo(e, props.csrf)}
            action="/maker"
            method="POST"
            className="domoForm"
          >
          <label htmlFor="name">Name: </label>
          <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
          <label htmlFor="age">Age: </label>
          <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
          <label htmlFor="food">Favorite food: </label>
          <input id="domoFood" type="text" name="food" placeholder="Domo's favorite food"/>
          <input type="hidden" name="_csrf" value={props.csrf}/>
          <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const handleDelete = (e, csrf) => {
    e.preventDefault();

    sendAjax("POST", $("#deleteForm").attr("action"), $("#deleteForm").serialize());

    loadDomosFromServer(csrf);

    return false;
};

const DomoList = (props) => {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoFood"> Favorite Food: {domo.favoriteFood} </h3>
                <form id="deleteForm" onSubmit={(e) => handleDelete(e, props.csrf)} action="/deleteDomo" method="POST">
                    <input type="hidden" name="domoID" value={domo._id}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input id="deleteDomoSubmit" type="submit" value="Delete Domo"/>
                </form>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = (csrf) => {
    sendAjax("GET", "/getDomos", null, (data) => {
        ReactDOM.render(
            <DomoList csrf={csrf} domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList csrf={csrf} domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});