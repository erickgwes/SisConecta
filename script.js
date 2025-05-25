// index.js (adicione no topo do script principal)
if (localStorage.getItem("logado") !== "true") {
  window.location.href = "login.html"; // redireciona para o login se não estiver logado
}

const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.getElementById("menuLateral");
const secoes = document.querySelectorAll(".secao"); 
const botoesMenu = document.querySelectorAll(".nav-links a");//const secoes e botoes menu serão para navegar entre as seções da página

botaoMenu?.addEventListener("click", () => {
  menuLateral.classList.toggle("ativo");
  botaoMenu.classList.toggle("ativo");
});

// Navegação entre seções
botoesMenu.forEach((botao) => { //esse pega todas as seções da página e os botoes do menu
  botao.addEventListener("click", (e) => { 
    e.preventDefault();   //impede que o link recarregue a página                    

    // Alterna visibilidade de seções
    secoes.forEach((secao) => secao.classList.remove("ativa"));
    document.getElementById(botao.dataset.secao).classList.add("ativa");

    // Destaca o item ativo no menu
    botoesMenu.forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");

    // Atualiza lista da tela inicial se necessário
    if (botao.dataset.secao === "inicio") {
      atualizarListaInicio();
    }
  });
});

// Cadastro de dispositivos
const tipoSelect = document.getElementById("tipo"); //essas linhas pegam os elementos do HTML que o JAVA vai usar. por ex; um <select> com id tipo (onde escolhe a tv ar condicionado etc)
const campoTemperatura = document.getElementById("campo-temperatura"); // esse campo só aparece quando o tipo é ar condicionado
const temperaturaInput = document.getElementById("temperatura");// um controle de temperatura, slider
const valorTemperatura = document.getElementById("valor-temperatura");// uma caixa <span> que mostra o valor atual da temperatura escolhida

tipoSelect.addEventListener("change", () => {
  campoTemperatura.style.display = tipoSelect.value === "Ar-condicionado" ? "block" : "none";
}); //se a pessoa escolher "ar-condicionado", o campo de temperatura aparece, se for outro tipo ele esconde no display:none

//  Atualiza o valor ao mover o slider
temperaturaInput.addEventListener("input", () => {
  valorTemperatura.textContent = `${temperaturaInput.value}º`; // quando vc mexe no slider de temperatura, o numero ao lado do slider (span) é atualizado para mostrar o novo valor (tipo"24º")
});

// aqui ele tenta pegar os dispositivos salvos no navegador, se não tiver nenhum salvo ainda, começa com uma lista vazia ([])
let dispositivos = JSON.parse(localStorage.getItem("dispositivos")) || []; 
atualizarLista(); // mostra os dispositivos salvos ao carregar a página

function salvarDispositivos() {
  localStorage.setItem("dispositivos", JSON.stringify(dispositivos)); //transforma o array em texto com JSON.stringify() e salva.
}

document.getElementById("cadastrar").addEventListener("click", () => { 
// pega os valores do formulario

  const nome = document.getElementById("nome").value.trim();
  const tipo = tipoSelect.value;
  const local = document.getElementById("local").value;
  const temperatura = tipo === "Ar-condicionado" ? temperaturaInput.value : null;

  if (!nome) {
    alert("Insira um nome para o dispositivo.");
    return;
  }

  dispositivos.push({
    nome,
    tipo,
    local,
    ligado: false,
    temperatura
  });

  atualizarLista();
  salvarDispositivos(); // salva no localStorage

  // limpa os campos
  document.getElementById("nome").value = "";
  document.getElementById("tipo").selectedIndex = 0;
  document.getElementById("local").selectedIndex = 0;
  campoTemperatura.style.display = "none";


});

function atualizarLista() {
  const lista = document.getElementById("lista-dispositivos"); 
  lista.innerHTML = "";

  dispositivos.forEach((dispositivo, index) => {  //cria elementos e adiciona as informaçoes, se for ar-condicionado, mostra temperatura e slider e adiciona botões de ligar/desligar e apagar
    const div = document.createElement("div");
    div.className = "dispositivo";
    div.innerHTML = `
      <h3>${dispositivo.nome.toUpperCase()}</h3>
      <p>Tipo: ${dispositivo.tipo}</p>
      <p>Local: ${dispositivo.local}</p>
      <p>Status: <span class="${dispositivo.ligado ? "ligado" : "desligado"}">
        ${dispositivo.ligado ? "Ligado" : "Desligado"}</span>
      </p>
      ${
        dispositivo.tipo === "Ar-condicionado"
          ? `
        <p>Temperatura: <span id="temp-${index}">${dispositivo.temperatura}°C</span></p>
        <input type="range" min="16" max="30" value="${dispositivo.temperatura}" 
               onchange="ajustarTemperatura(${index}, this.value)" />
        `
          : ""
          //aqui temos um botao que muda o texto para "ligar" ou "desligar", dependendo do estado atual e quando clicado, chama a função alternarStatus(index).
      } 
      <button onclick="alternarStatus(${index})"> 
        ${dispositivo.ligado ? "Desligar" : "Ligar"} 
      </button>
      
      <button onclick="removerDispositivo(${index})" style="margin-left: 10px; background-color: red; color: white;">
        Apagar
      </button>
    `; //acima temos um botao vermelho para apagar o dispositivo, ele chama removerDispositivo(index) quando clicado.
    lista.appendChild(div); // ao final de tudo, colocamos o div do dispositivo dentro da lista do HTML atualizando o que aparece pro usuario
  });
}

function ajustarTemperatura(index, novaTemp) { 
  dispositivos[index].temperatura = novaTemp;
  document.getElementById(`temp-${index}`).textContent = `${novaTemp}°C`;
  salvarDispositivos(); // salva alteração
}

function alternarStatus(index) { 
  dispositivos[index].ligado = !dispositivos[index].ligado;
  atualizarLista();
  salvarDispositivos(); // salva alteração
}

function removerDispositivo(index) {
  dispositivos.splice(index, 1);
  atualizarLista();
  salvarDispositivos(); // salva alteração
}

// aqui pegamos os elementos do html com id lista-dispositivos, onde os dispositivos aparecem, e limpa tudo com innerHTML = "" para recomeçar a lista do zero.
function atualizarListaInicio() {
  const lista = document.getElementById("lista-inicio"); //serve para mostrar na tela "home" um resumo dos dispositivos
  lista.innerHTML = "";//limpa a lista antes de desenhar de novo

  dispositivos.forEach((dispositivo) => { // dispositivos é o array com todos os dispositivos salvos, index é o numero do item (tipo posicao na lista)
    const div = document.createElement("div"); //cria uma div nova no javascript, e da a ela a classe dispositivo (util para estilizar no css)
    div.className = "dispositivo";
    
    //o codigo abaixo mostra o nome do dispositivo em maiusculas, mostra o tipo o local e o status atual (ligado ou desligado) e o status tbm muda de cor usando a classe CSS ligado ou desligado dependendo do valor de dispositivo.ligado
    div.innerHTML = `
      <h3>${dispositivo.nome.toUpperCase()}</h3>
      <p>Tipo: ${dispositivo.tipo}</p>
      <p>Local: ${dispositivo.local}</p>
      <p>Status: <span class="${dispositivo.ligado ? "ligado" : "desligado"}">
        ${dispositivo.ligado ? "Ligado" : "Desligado"}</span>
      </p>
      ${
        dispositivo.tipo === "Ar-condicionado" //aqui temos um IF disfarçado, se o tipo for "ar-condicionado", ele mostra a temperatura e um controle range (quase um slider) para o usuario ajustar, esse slider chaama a funçao ajustarTemperatura() quando é alterado.
          ? `<p>Temperatura: ${dispositivo.temperatura}°C</p>`
          : ""
      }
    `;
    lista.appendChild(div);
  });
}

function logout() { 
  localStorage.removeItem("logado"); //remove o estado de login
  window.location.href = "login.html"; // redireciona para a tela de login
}

//dados de perfil salvos em localStorage ou valores padrão
let profileData = JSON.parse(localStorage.getItem("profileData")) || {  //o localstorage getitem "profiledata" tenta pegar os dados de perfil já salvos no navegador, o JSON.parse transforma o texto salvo em um objeto de verdade e o || se não existir nada salvo, usa valores padroes nomes genericos emails falsos
   name: "Nome do Usuário",
   email: "email@exemplo.com",
   organization: "Nome da Organização"
}

const profileNameElement = document.getElementById("profile-name");
const profileEmailElement = document.getElementById("profile-email");
const accountNameElement = document.getElementById("account-name");
const accountEmailElement = document.getElementById("account-email");
const accountOrganizationElement = document.getElementById("profile-name");
 
const editForm = document.getElementById("edit-form");
const editButton = document.getElementById("edit-button");
const editNameInput = document.getElementById("edit-name-input");
const editEmailInput = document.getElementById("edit-email-input");
const editOrganizationInput = document.getElementById("edit-organization-input");

function updateProfileDisplay() { //essa funçao pega os dados do objeto profileData e mostra na tela (coloca nos lugares certos do HTML)
  profileNameElement.textContent = profileData.name;
  profileEmailElement.textContent = profileData.email;
  accountNameElement.textContent = profileData.name;
  accountEmailElement.textContent = profileData.email;
  accountOrganizationElement.textContent = profileData.organization;
}

updateProfileDisplay();//essa funcao e chamada logo apos declarar o profileData, pra garantir que a tela fique atualizada:

editButton.addEventListener("click", () => { 
  editForm.style.display = "block";
  editNameInput.value = profileData.name;
  editEmailInput.value = profileData.email;
  editOrganizationInput.value = profileData.organization;
});// mostra o formulario (style.display = "block") e preenche os campos com os dados atuais (para o usuario editar)

editForm.addEventListener("submit", (e) => { //quando clicamos em salvar no formulario, ele chama essa funçao
  e.preventDefault(); //aqui impede o formulario de recarregar a pagina
  const newName = editNameInput.value.trim();
  const newEmail = editEmailInput.value.trim();
  const newOrg = editOrganizationInput.value.trim();

  if (newName && newEmail && newOrg) {
    profileData = {
      name: newName,
      email: newEmail,
      organization: newOrg,
    };
    localStorage.setItem("profileData", JSON.stringify(profileData)); //salva tudo no localStorage (em formato texto, com JSON.stringify)
    updateProfileDisplay();
    alert("Perfil atualizado!");
    editForm.style.display = "none";
  } else {
    alert("Preencha todos os campos!");
  }
});

