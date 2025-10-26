# Configuração de Variáveis de Ambiente

## Opção 1: Usando arquivo .env (Recomendado)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Database Configuration
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=postgres
DATABASE_NAME=orders

# Kafka Configuration
KAFKA_BROKERS=kafka:9092
KAFKA_TOPIC=orders

# API Configuration
API_PORT=3001

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Opção 2: Usando docker-compose.override.yml

Copie o arquivo `docker-compose.override.yml.example` para `docker-compose.override.yml` e personalize as configurações:

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
```

## Opção 3: Variáveis de ambiente do sistema

Exporte as variáveis no seu shell:

```bash
export DATABASE_HOST=postgres
export DATABASE_PORT=5432
export DATABASE_USER=postgres
export DATABASE_PASS=postgres
export DATABASE_NAME=orders
export KAFKA_BROKERS=kafka:9092
export KAFKA_TOPIC=orders
export NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Valores Padrão

Se nenhuma variável for definida, o docker-compose.yml usará os seguintes valores padrão:

- `DATABASE_HOST=postgres`
- `DATABASE_PORT=5432`
- `DATABASE_USER=postgres`
- `DATABASE_PASS=postgres`
- `DATABASE_NAME=orders`
- `KAFKA_BROKERS=kafka:9092`
- `KAFKA_TOPIC=orders`

## Executando o projeto

```bash
# Com variáveis de ambiente
docker-compose up -d

# Ou especificando um arquivo .env
docker-compose --env-file .env up -d
```
