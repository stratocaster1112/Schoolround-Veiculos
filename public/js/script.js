const frm = document.querySelector("#formVeiculo");
const btnCalcular = document.querySelector("#btnCalcular");
const btnSalvar = document.querySelector("#btnSalvar");
const resp1 = document.querySelector("#Resp1");
const resp2 = document.querySelector("#Resp2");
const resp3 = document.querySelector("#Resp3");

let veiculoAtual = null;

const classificarVeiculo = (ano) => {
  const anoAtual = new Date().getFullYear();
  if (ano === anoAtual) return "Novo";
  if (ano === anoAtual - 1 || ano === anoAtual - 2) return "Seminovo";
  return "Usado";
};

function calcularEntrada(valor, status) {
  return status === "Novo" ? valor * 0.5 : valor * 0.3;
}

function tratarPreco(valor) {
  return Number(valor.replace(/\./g, "").replace(",", "."));
}

btnCalcular.addEventListener("click", () => {
  const modelo = frm.inModelo.value;
  const ano = Number(frm.inAno.value);
  const preco = tratarPreco(frm.inPreco.value);

  if (!modelo || !ano || !preco) {
    alert("Preencha todos os campos.");
    return;
  }

  const classificacao = classificarVeiculo(ano);
  const entrada = calcularEntrada(preco, classificacao);
  const parcela = (preco - entrada) / 10;

  resp1.innerText = `${modelo} - ${classificacao}`;
  resp2.innerText = `Entrada R$: ${entrada.toFixed(2)}`;
  resp3.innerText = `+10x de R$: ${parcela.toFixed(2)}`;

  veiculoAtual = {
    modelo,
    ano,
    preco,
    classificacao,
    entrada: entrada.toFixed(2),
    parcela: parcela.toFixed(2),
  };
});

btnSalvar.addEventListener("click", async () => {
  if (!veiculoAtual) {
    alert("Primeiro, calcule a entrada e parcelas do veículo.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/veiculos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(veiculoAtual),
    });

    if (!response.ok) {
      throw new Error(`Erro de rede: ${response.status}`);
    }

    const result = await response.json();
    alert(`Veículo salvo com sucesso!\nStatus: ${result.message}`);

    frm.reset();
    resp1.innerText = "";
    resp2.innerText = "";
    resp3.innerText = "";
    veiculoAtual = null;
  } catch (error) {
    console.error("Erro ao salvar o veículo:", error);
    alert(
      `Falha ao salvar o veículo. Veja o console para detalhes: ${error.message}. Verifique se o app.js está rodando.`
    );
  }
});
