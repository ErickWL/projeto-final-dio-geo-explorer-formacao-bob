---
name: trilha
description: "Cria um plano de estudos detalhado a partir de uma tecnologia do catalogo DIO ficticio"
argument-hint: "Digite o nome de uma tecnologia"
---

Leia o arquivo `DIO_explorer/data/trilhas_dio.json` antes de responder.

Tecnologia informada: ${input:tecnologia}

Encontre a trilha cuja lista `tecnologia` contenha a tecnologia informada, usando comparacao sem diferenciar maiusculas e minusculas. Se houver mais de uma correspondencia, apresente as trilhas encontradas e peca que o usuario escolha uma. Se nao houver correspondencia, informe as tecnologias disponiveis no catalogo.

Quando encontrar uma trilha, retorne em Markdown um plano de estudos pratico e organizado com:
- Nome da trilha, tecnologia, nivel, numero de modulos e XP total
- Um roteiro numerado para cada modulo, com objetivos de aprendizagem coerentes com a tecnologia
- Badges disponiveis, promocoes, informacao de acesso vitalicio e lives ao vivo
- Uma sugestao de projeto final e criterios objetivos de conclusao

Use somente os dados da trilha para os metadados. Os modulos podem ser detalhados de forma ficticia, mas nao invente ofertas reais da DIO. Mantenha explicito que o catalogo e ficticio.
