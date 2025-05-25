const dispositivos = [];

// Conecta ao broker MQTT via WebSocket
const client = mqtt.connect("wss://test.mosquitto.org:8081");

client.on("connect", () => {
  console.log("MQTT conectado!");
  client.subscribe("iotconnect/dispositivo1");
});

client.on("message", (topic, message) => {
  const comando = message.toString();
  console.log("Recebido:", comando);

  if (topic === "iotconnect/dispositivo1" && dispositivos[0]) {
    dispositivos[0].ligado = comando === "ligar";
    atualizarLista();
  }
});

document.getElementById("cadastrar").addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite o nome do dispositivo.");

  dispositivos.length = 0; // só permitimos 1 nesse exemplo
  dispositivos.push({
    nome,
    ligado: false
  });

  atualizarLista();
});

function atualizarLista() {
  const lista = document.getElementById("lista-dispositivos");
  lista.innerHTML = "";

  dispositivos.forEach((d, index) => {
    const div = document.createElement("div");
    div.className = "dispositivo";
    div.innerHTML = `
      <h3>${d.nome}</h3>
      <p>Status: <span class="${d.ligado ? "ligado" : "desligado"}">
        ${d.ligado ? "Ligado" : "Desligado"}
      </span></p>
    `;
    lista.appendChild(div);
  });
}