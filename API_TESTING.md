# Guia de Teste da API

## 🚀 Como executar a API

### Opção 1: Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker-compose up api -d
```

### Opção 2: Desenvolvimento local

```bash
cd backend/api
npm install
npm run start:dev
```

## 📋 Endpoints Disponíveis

### 1. **Health Check**

```bash
GET http://localhost:3001/health
```

**Resposta esperada:**

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "kafka": {
      "status": "up",
      "message": "Kafka is healthy",
      "connected": true
    }
  }
}
```

### 2. **Hello World**

```bash
GET http://localhost:3001/
```

**Resposta esperada:**

```
Hello World!
```

### 3. **Orders - Criar Order**

```bash
POST http://localhost:3001/orders
Content-Type: application/json

{
  "clientName": "João Silva",
  "productName": "Notebook Dell",
  "value": 2500.00
}
```

**Resposta esperada:**

```json
{
  "id": "uuid-gerado",
  "clientName": "João Silva",
  "productName": "Notebook Dell",
  "value": 2500.0,
  "status": "Pendente",
  "creationDate": "2024-01-15T10:30:00.000Z"
}
```

### 4. **Orders - Listar todas**

```bash
GET http://localhost:3001/orders
```

**Resposta esperada:**

```json
[
  {
    "id": "uuid-1",
    "clientName": "João Silva",
    "productName": "Notebook Dell",
    "value": 2500.0,
    "status": "Pendente",
    "creationDate": "2024-01-15T10:30:00.000Z"
  }
]
```

### 5. **Orders - Buscar por ID**

```bash
GET http://localhost:3001/orders/{id}
```

**Resposta esperada:**

```json
{
  "id": "uuid-1",
  "clientName": "João Silva",
  "productName": "Notebook Dell",
  "value": 2500.0,
  "status": "Pendente",
  "creationDate": "2024-01-15T10:30:00.000Z"
}
```

## 🧪 Testando com cURL

### Health Check

```bash
curl -X GET http://localhost:3001/health
```

### Criar Order

```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Maria Santos",
    "productName": "iPhone 15",
    "value": 4500.00
  }'
```

### Listar Orders

```bash
curl -X GET http://localhost:3001/orders
```

## 🧪 Testando com Postman/Insomnia

1. **Importe a collection:**

   - Base URL: `http://localhost:3001`
   - Métodos: GET, POST

2. **Teste os endpoints na ordem:**
   1. Health Check
   2. Criar Order
   3. Listar Orders
   4. Buscar Order por ID

## 🧪 Testando com JavaScript/Fetch

```javascript
// Health Check
fetch("http://localhost:3001/health")
  .then((res) => res.json())
  .then((data) => console.log(data));

// Criar Order
fetch("http://localhost:3001/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    clientName: "Pedro Costa",
    productName: "MacBook Pro",
    value: 8000.0,
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## 🔍 Verificando Logs

### Docker Compose

```bash
# Ver logs da API
docker-compose logs -f api

# Ver logs do worker
docker-compose logs -f worker
```

### Desenvolvimento local

```bash
# Os logs aparecem no terminal onde você executou npm run start:dev
```

## ⚠️ Troubleshooting

### API não responde

1. Verifique se a porta 3001 está livre
2. Verifique se o PostgreSQL está rodando
3. Verifique se o Kafka está rodando

### Erro de conexão com banco

```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps postgres

# Verifique os logs
docker-compose logs postgres
```

### Erro de conexão com Kafka

```bash
# Verifique se o Kafka está rodando
docker-compose ps kafka

# Verifique os logs
docker-compose logs kafka
```

## 🎯 Fluxo de Teste Completo

1. **Inicie todos os serviços:**

   ```bash
   docker-compose up -d
   ```

2. **Teste o health check:**

   ```bash
   curl http://localhost:3001/health
   ```

3. **Crie uma order:**

   ```bash
   curl -X POST http://localhost:3001/orders \
     -H "Content-Type: application/json" \
     -d '{"clientName":"Teste","productName":"Produto","value":100}'
   ```

4. **Verifique se a order foi criada:**

   ```bash
   curl http://localhost:3001/orders
   ```

5. **Observe o worker processando:**

   ```bash
   docker-compose logs -f worker
   ```

6. **Verifique o status da order novamente:**
   ```bash
   curl http://localhost:3001/orders
   ```
   (Deve mostrar status "Finalizado" após ~5 segundos)
