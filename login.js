function login(event) {
  event.preventDefault(); // impede o envio do formulário

  const username = document.getElementById("username").value;
  const password = document.getElementById("senha").value;

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    document.getElementById("message").innerText = "Nenhum usuário cadastrado.";
    return;
  }

  // Verifica se o username digitado é igual ao email ou ao primeiro nome e se a senha está correta
  if ((username === usuario.email || username === usuario.nome) && password === usuario.senha) {
    localStorage.setItem("logado", "true");
    window.location.href = "index.html"; // redireciona para a página principal
  } else {
    document.getElementById("message").innerText = "Usuário ou senha incorretos.";
  }
}
