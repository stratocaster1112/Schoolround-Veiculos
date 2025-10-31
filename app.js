const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors'); 

const app = express();
const port = 3000;
const DADOS_PATH = path.join(__dirname, 'dados.json');
const PUBLIC_PATH = path.join(__dirname, 'PUBLIC'); 

app.use(cors()); 
app.use(express.json());

app.use(express.static(PUBLIC_PATH)); 


app.post('/veiculos', async (req, res) => {
    const novoVeiculo = req.body;

    if (!novoVeiculo || !novoVeiculo.modelo || !novoVeiculo.preco) {
        return res.status(400).json({ message: "Dados do veículo incompletos." });
    }

    try {
        const data = await fs.readFile(DADOS_PATH, 'utf-8');
        let veiculos = JSON.parse(data);

        if (!Array.isArray(veiculos)) {
            veiculos = [];
        }

        veiculos.push(novoVeiculo);

        await fs.writeFile(DADOS_PATH, JSON.stringify(veiculos, null, 2), 'utf-8');

        res.status(201).json({ 
            message: "Veículo salvo com sucesso no JSON!", 
            veiculo: novoVeiculo 
        });

    } catch (error) {
        console.error("Erro ao processar o arquivo JSON:", error);
        res.status(500).json({ 
            message: "Erro interno do servidor ao salvar os dados.",
            error: error.message
        });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});