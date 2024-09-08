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

    verificarCompatibilidade(animal, animaisExistentes, bioma) {
        const animalInfo = this.animaisPermitidos[animal];
    
        const existeCarnivoro = animaisExistentes.some(a => this.animaisPermitidos[a.especie].carnivoro);
        if (animalInfo.carnivoro || existeCarnivoro) {
            return animaisExistentes.every(a => a.especie === animal);  // carnívoros só podem ficar com a mesma espécie
        }
    
        // regra para animais nao carnivoros (macoco e gazela) poderem viver no mesmo habitate savana e rio com o hipopotamo
        if (bioma === "savana e rio") {
            return true;  // macacos, gazelas e hipopótamos podem compartilhar espaço nesse bioma
        }
    
        // se o bioma for apenas savana, não permitir hipopotamos com outras especies
        if (bioma === "savana" && animal === "HIPOPOTAMO") {
            return animaisExistentes.length === 0;  // hipopótamo só pode ficar sozinho na savana
        }
    
        // outros casos gerais
        return true;
    }
    

    encontrarRecintos(animal, quantidade) {
        const recintosViaveis = [];
        const animalInfo = this.animaisPermitidos[animal];
        let espacoNecessario = animalInfo.tamanho * quantidade;

        // ordenar recintos pela ordem numerica atribuida
        this.recintos.sort((a, b) => a.numero - b.numero);

        this.recintos.forEach((recinto) => {
            const espacoOcupado = recinto.animaisExistentes.reduce((acumulado, animalExistente) => {
                const especieInfo = this.animaisPermitidos[animalExistente.especie];
                return acumulado + (especieInfo.tamanho * animalExistente.quantidade);
            }, 0);

            let espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

            // verifica se há outra espécie e aplica regra de um espaço extra se houver espécies diferentes
            const haOutraEspecie = recinto.animaisExistentes.some(a => a.especie !== animal);
            if (haOutraEspecie) {
                espacoDisponivel -= 1;  // subtrai 1 unidade de espaco extra apenas se houver outra espécie
            }

            // verifica se o bioma é compatível, se há espaço suficiente e se é compatível com as espécies no recinto
            if (
                animalInfo.biomas.includes(recinto.bioma) &&
                espacoDisponivel >= espacoNecessario &&
                this.verificarCompatibilidade(animal, recinto.animaisExistentes, recinto.bioma)
            ) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoDisponivel - espacoNecessario,
                    tamanhoTotal: recinto.tamanhoTotal
                });
            }
        });

        return recintosViaveis;
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

        return {
            recintosViaveis: recintosViaveis.map(recinto => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`)
        };
    }
}


export { RecintosZoo as RecintosZoo };
