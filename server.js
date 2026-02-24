const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

let leads = [];
let metaSemanal = 5;

// Função cálculo regional
function calcularRegional(km) {
  const base = 3000;
  if (km <= 100) return base;
  return base + (km * 6);
}

// Criar lead
app.post("/lead", (req, res) => {
  const { tipo, nome, telefone, cidade, km } = req.body;

  let valor = 0;

  if (tipo === "regional") {
    valor = calcularRegional(km);
  }

  if (tipo === "prefeitura") {
    valor = 15000;
  }

  const novoLead = {
    id: leads.length + 1,
    tipo,
    nome,
    telefone,
    cidade,
    km,
    valor,
    status: "Novo Lead",
    criadoEm: new Date()
  };

  leads.push(novoLead);

  res.json({
    mensagem: "Lead registrado com sucesso",
    lead: novoLead
  });
});

// Atualizar status
app.put("/status/:id", (req, res) => {
  const { status } = req.body;
  const lead = leads.find(l => l.id == req.params.id);

  if (!lead) {
    return res.status(404).json({ erro: "Lead não encontrado" });
  }

  lead.status = status;

  res.json({ mensagem: "Status atualizado", lead });
});

// Listar leads
app.get("/leads", (req, res) => {
  res.json(leads);
});

// Meta semanal
app.get("/meta", (req, res) => {
  const fechados = leads.filter(l => l.status === "Fechado").length;

  res.json({
    meta: metaSemanal,
    fechados,
    faltam: metaSemanal - fechados
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
