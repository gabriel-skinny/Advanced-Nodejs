# Advanced NodeJS

- Curso Avanced Nodejs com instrutor StephenGrider

## NodeJs Internals

V8: Intepretador de javascript para C++
Libuv: Biblioteca em C++ para acessar o sistema operacional

NodeJs: Fornece uma interface para usarmos esses dois componentes e escrever nosso código em javascript do lado do servidor. E possui uma API para se comunicar com o Libuv implementado em Javascript.

Como nodeJs Faz isso:

- Faz uma implementação de validações e regras especificas da função em Javascript
- Chama uma função process.bind e importa o arquivo que implementa alguma funcionalidade do Libuv ou do V8
- Executa essa função e retorna para a função javascript

## Processos e Threads

Processo: É uma instancia de um programa de computador que está sendo executado
Thread: Uma thread carrega uma lista de instruções que precisam ser executadas pelo seu CPU do seu computador uma a uma. Um processo pode ter varias threads.

OS Scheduler: Define em que momento certa thread será executada

Duas soluções para executar Threads:

- Adicionar mais CPU's
- Deixar o OS Scheduler detecar pausas em Threads e para-las para executar outras

## Event-Loop

Event-loop: Uma estrutura de controle que define o que essa unica thread deve estar fazendo

NodeJs e Single-Threading: Executa o Event-loop em um thread, porém as funções das blibiotecas do nodejs podem executar em mais de uma thread.

Linha de execução do Node:

- Le todo o contéudo do arquivo
- Event Loop roda o primeiro tick
- Executa todo código que está pronto para ser executado
- Event Loop verifica se possui alguma operação pendente
  - 1 Algum timer pendente (SetTimout, SetInterval, SetImediate)
  - 2 Alguma Task do Sistema operacional pendentes (Ex: Servidor esperando requests HTTP)
  - 3 Alguma Operação Longa async (Thread-Pool)
- Se sim roda outro tick
- Verifica se as funções pendentes foram resolvidas e executa seu callback
- Pausa a execução do tick e só inicia uma nova execução quando alguma função pendente emite um evento que está pronta para ser executada.
- Se não existe nenhuma operação pendente finaliza o processo.

Funcionamento interno do Event Loop:

- 1 Verifica se os timers pendentes foram resolvidos e pode ser executados seus callbacks
- 2 Verifica se tem as task do Sistema Operacional e executa se tiverem prontas
- 3 Pausa a execução e só continua se alguma função pendente for resolvida
- 4 Olha os timers pendentes (SetImediate)
- 5 Trata o evento "close" e roda código de limpeza

## Libuv Thread Pool

Algumas funções do libuv podem executar fora do Event Loop e utilizar uma Thread-Pool para lidar com as tasks.

Multi-Threading: Alguns computadores possuem Cpu's core que tem a funcionalidade de executar mais de uma thread em paralelo.

Thread-Pool: É uma solução usada para executar programas que são intensivos em CPU usando paralelismo. Ele o faz criando varias threas ante-mão, esperando tasks chegarem para serem executadas e o programa vai dispondo as thrdeas disponiveis para executa-las. A vantagem é não precisar ficar criando e apagando threads, o que gasta tempo de execucação e aumenta a latencia das respostas.

Libuv: Cria por padrão 4 threads na sua Thread Pool, mas o ideal é seguir o número de threds que sua CPU pode executar ao mesmo tempo.

Thread-Pool e Event Loop: Só resolve o callback das funções quando a Thread Pool inteira é resolvida.

## Libuv Tasks do Sistema Operacional

A libuv para fazer operações de baixo nivel delega isso para funções do sistema operacional, o qual executa fora do event loop e fora de uma thread-pool. Normalmente todas as funções que lidam com networking são lidadas pelo sistema operacional.

## Referencias

Nodejs - Event Loop(https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## Melhorar a perfomance do Nodejs

Problema: Quando executamos uma tarefa pessada de modo sincrono o event loop da aplicação fica travado executando esse código, e como rodamos o processo em um thread todas as requisições que chegarem ficarão travadas.

Nodejs: É melhor em tarefas I/O. Sua solução de assincronicidade com o event loop sempre vai superar estrategias de multi-threading para operações I/O.

Soluções para CPU's intensive tasks no Nodejs:

- Cluster: Inicia varios processos do Nodejs, ou seja, varios event loops. Usado quando é necessario que cada processo tenha uma execução isolada.
- Worker Threads: Cria varias threads de uma instância que roda Nodejs. Diferente do Cluster elas compartilham memoria entre si.

Exemplos de CPU's invenstive taks: Compreesão de Video, Algoritimos de Busca, Ordenar muitos dados.

### Cluster

Uso: Quando uma rota de nossa aplicação tem uma tarefa CPU intensive, podemos usar o Cluster Maneger para criar um novo fork da nossa aplicação, e deixa-lo lidar com novas requisições fornecendo esse novo processo com um novo event-loop limpo

Cluster-Manager: Quando rodamos nossa aplicação o nodejs cria uma instância do Cluster Manager que pode fazer um fork do nosso código e roda-lo em um Worker Instance

Worker Instance: Instancia do nosso programa criada pelo Cluster maneger

Estrategias do Cluster-Maneger para selecionar um processo:

- round-robin(Default, menos no Windows): O processo primario escuta uma porta e conforme chega requisições distribui para as workers instances usando o algoritimo round-robin
- Direct socket: O processo primario manda um socket com evento, e os workers lidam com ele diretamente

CPU e Processos: Nossa CPU tem um limite de threas que pode executar ao mesmo tempo, de modo que quando ela tem varios processos para serem executados ao mesmo tempo, ela se divide no seu processamento, ficando tudo mais lento.

Trade-off do Cluster: Ao criar muitos Workers, vamos atender mais requisições, porém elas ficaram mais lentas, por ficarem dividas pela CPU.

Ideal de Cluster: Precisa ser igual aos logical cores ou physicial cores da sua CPU.

Physical Cores:
Logical Core: Número de Threads que os Phyisical cores da sua CPU conseguem executar com Multi-Threading.

PM2: Bliobioteca desenvolvida para cuidar dos clusters da sua aplicação que tem um algoritimo de Load-Balacing e mantem sua aplicação viva.

- Beneficios:

  - Utiliza todos os cores disponiveis da CPU
  - Facilita o load balacing entre os processos
  - Simplifica a tratativa de novas requisições fornecendo uma porta compartilhada para os processos

- Maleficios:
  - Mais complexos de debugar
  - Ruins para tasks de I/O
  - Gasta mais memória do que criar uma thread

### Worker Threads

Worker Threads: Não é tão util no Nodejs pois a maioria das funções CPU' invensive que chamamos já são executadas em uma Thread separada que não trava o event loop pela LibUv. Só faz sentido se queremos executar em uma thread separada um código que nós criamos.

WebWorker-therds

### Referencias

Multhi-treading on Nodejs Blog rocket(https://blog.logrocket.com/multithreading-node-js-worker-threads/)
Aumentando a performance do Nodejs - Erick Wendell (https://www.youtube.com/watch?v=EnK8-x8L9TY)
