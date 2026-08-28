# Desafio de Codigo: Fila de Atendimento

> Desafio ficticio e educacional gerado pelo comando `/desafio`.

**Aluno:** Erick Silva  
**Tecnologia:** Java  
**Nivel:** intermediario  
**XP ficticio:** 350 XP  
**Tempo estimado:** 60 minutos

## Contexto

Uma central de atendimento precisa organizar clientes em uma fila. Cada cliente informa um identificador e sua prioridade. O programa deve processar os clientes na ordem de prioridade e, em caso de empate, na ordem de chegada.

## Objetivo

Implemente uma aplicacao Java que leia os clientes, organize a fila e exiba a ordem de atendimento.

## Requisitos

- Criar uma classe `Cliente` com identificador, prioridade e ordem de chegada.
- Usar uma estrutura de dados adequada para representar a fila de prioridade.
- Prioridades maiores devem ser atendidas primeiro.
- Clientes com a mesma prioridade devem manter a ordem de chegada.
- Nao fornecer a solucao completa neste desafio.

## Entrada e saida

A primeira linha informa a quantidade `N` de clientes. Cada uma das `N` linhas seguintes informa `identificador prioridade`.

A saida deve listar os identificadores na ordem de atendimento, separados por espacos.

### Exemplo 1

**Entrada**

```text
4
A101 1
B202 3
C303 2
D404 3
```

**Saida**

```text
B202 D404 C303 A101
```

### Exemplo 2

**Entrada**

```text
3
X001 2
X002 2
X003 1
```

**Saida**

```text
X001 X002 X003
```

## Restricoes e avaliacao

- `1 <= N <= 100000`.
- Identificadores nao se repetem.
- Prioridades sao inteiros entre 1 e 5.
- Avaliacao: corretude (50%), desempate por ordem de chegada (25%), complexidade (15%) e organizacao do codigo (10%).

**Dica:** compare prioridade e ordem de chegada no mesmo criterio de ordenacao.
