---
name: desafio
description: "Gera um desafio de codigo aleatorio baseado em tecnologia e nivel"
argument-hint: "Informe tecnologia e nivel, por exemplo: Python, intermediario"
---

Leia o arquivo `DIO_explorer/data/trilhas_dio.json` para validar a tecnologia e os niveis disponiveis.

Entrada do usuario: ${input:tecnologia_e_nivel}

Interprete a entrada no formato `tecnologia, nivel`. Aceite tecnologia presente na lista `tecnologia` de uma trilha e os niveis `iniciante`, `intermediario` ou `avancado`, sem diferenciar maiusculas e minusculas. Se a entrada estiver incompleta ou invalida, mostre exemplos de formato e as opcoes validas.

Para uma entrada valida, gere um desafio de codigo aleatorio e inedito para a combinacao informada. Retorne em Markdown:
- Titulo e contexto do problema
- Objetivo e requisitos funcionais
- Formato de entrada e saida, quando aplicavel
- Pelo menos dois exemplos de entrada e saida
- Restrições e criterios de avaliacao
- Uma dica opcional, sem entregar a solucao
- Nivel, tecnologia, XP ficticio e tempo estimado

A dificuldade deve respeitar o nivel escolhido. Nao forneca a solucao completa a menos que o usuario peca depois. Informe que o desafio e ficticio e educacional.
