class RecintosZoo {
    constructor() {
        this.animaisPermitidos = {
            "LEAO": { tamanho: 3, biomas: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, biomas: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, biomas: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, biomas: ["savana", "floresta", "savana e rio"], carnivoro: false },
            "GAZELA": { tamanho: 2, biomas: ["savana", "savana e rio"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, biomas: ["savana", "rio", "savana e rio"], carnivoro: false }
        };

        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animaisExistentes: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animaisExistentes: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animaisExistentes: [{ especie: "LEAO", quantidade: 1 }] }
        ];
    }

    validarAnimal(animal) {
        return this.animaisPermitidos.hasOwnProperty(animal);
    }

    validarQuantidade(quantidade) {
        return quantidade > 0;
    }

    encontrarRecintos(animal, quantidade) {
        const recintosViaveis = [];
        const animalInfo = this.animaisPermitidos[animal];
        let espacoNecessario = animalInfo.tamanho * quantidade;

        // ordenar recintos pela ordem numérica
        this.recintos.sort((a, b) => a.numero - b.numero);

        this.recintos.forEach((recinto) => {
            const espacoOcupado = recinto.animaisExistentes.reduce((acumulado, animalExistente) => {
                const especieInfo = this.animaisPermitidos[animalExistente.especie];
                return acumulado + (especieInfo.tamanho * animalExistente.quantidade);
            }, 0);

            let espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

            // verifica se há outra espécie no recinto e subtrai 1 unidade de espaço se for o caso
            const haOutraEspecie = recinto.animaisExistentes.some(a => a.especie !== animal);
            if (haOutraEspecie) {
                espacoDisponivel -= 1; // Subtrai 1 de espaço extra apenas se as espécies forem diferentes
            }

            // verifica se o bioma é compatível e se há espaço suficiente
            if (animalInfo.biomas.includes(recinto.bioma) && espacoDisponivel >= espacoNecessario) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoDisponivel - espacoNecessario,
                    tamanhoTotal: recinto.tamanhoTotal
                });
            }
        });

        // retornar no máximo 3 recintos viáveis
        return recintosViaveis.slice(0, 3);
    }

    analisaRecintos(animal, quantidade) {
        if (!this.validarAnimal(animal)) {
            return { erro: "Animal inválido" };
        }

        if (!this.validarQuantidade(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const recintosViaveis = this.encontrarRecintos(animal, quantidade);
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // garante que a função `map` retorne os recintos corretamente
        return {
            recintosViaveis: recintosViaveis.map(recinto => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`)
        };
    }
}

export { RecintosZoo as RecintosZoo };
