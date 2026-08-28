---
name: certificado
description: "Gera um certificado ficticio em Markdown para uma trilha concluida"
argument-hint: "Informe nome do usuario e nome da trilha"
---

Leia o arquivo `DIO_explorer/data/trilhas_dio.json` antes de gerar o certificado.

Dados informados pelo usuario: ${input:nome_e_trilha}

Interprete a entrada no formato `Nome do usuario, Nome da trilha`. Valide a trilha pelo campo `nome`, aceitando diferenca de maiusculas e minusculas. Se a trilha nao existir, mostre os nomes disponiveis e nao gere um certificado como se fosse real.

Para uma trilha valida, gere um certificado ficticio em Markdown contendo:
- Titulo centralizado: "Certificado de Conclusao"
- Nome completo do usuario em destaque
- Nome exato da trilha concluida
- Tecnologias, nivel, numero de modulos e XP total da trilha
- Data atual e um identificador ficticio unico no formato `DIO-FICT-[AAAA]-[XXXX]`
- Uma declaracao de conclusao e uma area de assinatura da plataforma ficticia

Inclua no inicio e no fim um aviso claro: este documento e ficticio, educacional e nao representa um certificado oficial da DIO. Nao atribua autenticidade, verificacao ou validade profissional ao documento.
