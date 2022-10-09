const loadInitialTemplate = () => {
  const template = `
		<h1>Animales</h1>
		<form id="animal-form">
			<div>
				<label>Nombre</label>
				<input name="name" />
			</div>
			<div>
				<label>Tipo</label>
				<input name="type" />
			</div>
			<button type="submit">Enviar</button>
		</form>
		<ul id="animal-list"></ul>
	`;
  const body = document.getElementsByTagName("body")[0];
  body.innerHTML = template;
};

const loadLoginTemplate = () => {
  const template = `
		<h1>Login</h1>
		<form id="login-form">
			<div>
				<label>Correo</label>
				<input name="email" />
			</div>
			<div>
				<label>Contraseña</label>
				<input type="password" name="password" />
			</div>
			<button type="submit">Enviar</button>
		</form>
		<div id="error">
		</div>
	`;
  const body = document.getElementsByTagName("body")[0];
  body.innerHTML = template;
};

const addLoginListener = () => {
  const loginForm = document.getElementById("login-form");
  loginForm.onsubmit = async (e) => {
    // esto es para que no se ejecute la accion por defecto al refrescar la pagina
    e.preventDefault();
    //aqui vamos a buscar los datos de nuestro formulario
    const formData = new FormData(loginForm);
    //aqui convertirmos los datos del form en un objeto js
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const response = await fetch("/login", {
      method: "POST",
      //aqui convertimos el objeto a un string pa que el server lo lea
      body: JSON.stringify(data),
      header: {
        //esto es para que nuestro servidor express pueda interpretar correctamente los datos que les estamos enviando y asi los convierta en un
        //objeto js en el lado del servidor
        "Content-Type": "application/json",
      },
    });
    //luego de eso vamos a necesitar la respuesta, que podria ser un mensaje de error o un jwt y ambos seran strings
    const responseData = await response.text();
    console.log(response);
    //con status podemos obtener el numero de estado que nos a devuelto el servidor. si es mayor o = a  300 es xq fue error
    if (response.status >= 300) {
      console.log("error");
      const errorNode = document.getElementById("error");
      errorNode.innerHTML = responseData;
    } else {
      console.log("error2");
      console.log(responseData);
    }
  };
};

const getAnimals = async () => {
  const response = await fetch("/animals");
  const animals = await response.json();
  const template = (animal) => `
		<li>
			${animal.name} ${animal.type} <button data-id="${animal._id}">Eliminar</button>
		</li>
	`;

  const animalList = document.getElementById("animal-list");
  animalList.innerHTML = animals.map((animal) => template(animal)).join("");
  animals.forEach((animal) => {
    animalNode = document.querySelector(`[data-id="${animal._id}"]`);
    animalNode.onclick = async (e) => {
      await fetch(`/animals/${animal._id}`, {
        method: "DELETE",
      });
      animalNode.parentNode.remove();
      alert("Eliminado con éxito");
    };
  });
};

const addFormListener = () => {
  const animalForm = document.getElementById("animal-form");
  animalForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(animalForm);
    const data = Object.fromEntries(formData.entries());
    await fetch("/animals", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    animalForm.reset();
    getAnimals();
  };
};

const checkLogin = () => {
  localStorage.getItem("jwt");
};

const animalsPage = () => {
  loadInitialTemplate();
  addFormListener();
  getAnimals();
};

window.onload = () => {
  const isLoggedIn = checkLogin();
  if (isLoggedIn) {
    animalsPage();
  } else {
    loadLoginTemplate();
    addLoginListener();
  }
};
