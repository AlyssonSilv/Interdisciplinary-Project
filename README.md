# LabManager Backend

Sistema de Gerenciamento de Laboratórios Acadêmicos - Backend desenvolvido em Spring Boot 3.4.5 com Java 21.

## 🚀 Tecnologias Utilizadas

- **Java 21** - Linguagem de programação
- **Spring Boot 3.4.5** - Framework principal
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **MySQL 8** - Banco de dados
- **JWT** - Autenticação baseada em tokens
- **BCrypt** - Criptografia de senhas
- **Maven** - Gerenciamento de dependências

## 📋 Pré-requisitos

- Java 21 ou superior
- MySQL 8.0 ou superior
- MySQL Workbench (recomendado)
- Maven 3.6 ou superior

## 🛠️ Instalação e Configuração

### 1. Configuração do Banco de Dados

1. Abra o MySQL Workbench
2. Execute o script `database/create_database.sql` para criar o banco
3. Execute o script `database/initial_data.sql` para inserir dados de exemplo

### 2. Configuração da Aplicação

1. Clone o repositório
2. Configure as credenciais do banco no `application.properties`:
   ```properties
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   \`\`\`

### 3. Compilação e Execução

\`\`\`bash
# Compilar o projeto
mvn clean compile

# Executar testes
mvn test

# Gerar JAR
mvn package

# Executar a aplicação
mvn spring-boot:run
\`\`\`

A aplicação estará disponível em: `http://localhost:8080/api`

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Todos os endpoints (exceto `/api/auth/*`) requerem um token válido no header:

\`\`\`
Authorization: Bearer <seu_token_jwt>
\`\`\`

### Usuários de Teste

| Tipo | RA | Senha | Descrição |
|------|----|----|-----------|
| ADMIN | 1234 | 123456 | Administrador do sistema |
| PROFESSOR | 1-23456 | 123456 | Professor exemplo |
| ALUNO | 123456 | 123456 | Aluno exemplo |

## 📚 Endpoints da API

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/api/auth/signin` | Login do usuário | Público |
| POST | `/api/auth/signup` | Registro de usuário | Público |
| GET | `/api/auth/me` | Dados do usuário atual | Autenticado |

### Dashboard (`/api/dashboard`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/api/dashboard/stats` | Estatísticas básicas | Autenticado |
| GET | `/api/dashboard/admin/stats` | Estatísticas completas | Admin |
| GET | `/api/dashboard/activities` | Atividades recentes | Autenticado |
| GET | `/api/dashboard/upcoming` | Próximos agendamentos | Autenticado |

### Agendamentos (`/api/bookings`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/api/bookings` | Criar agendamento | Autenticado |
| GET | `/api/bookings/my-bookings` | Meus agendamentos | Autenticado |
| GET | `/api/bookings/all` | Todos os agendamentos | Admin |
| GET | `/api/bookings/pending` | Agendamentos pendentes | Admin/Professor |
| PATCH | `/api/bookings/{id}/status` | Aprovar/rejeitar | Admin |
| PATCH | `/api/bookings/{id}/cancel` | Cancelar agendamento | Proprietário/Admin |
| GET | `/api/bookings/period` | Agendamentos por período | Autenticado |

### Laboratórios (`/api/laboratories`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/api/laboratories` | Listar laboratórios | Autenticado |
| GET | `/api/laboratories/available` | Laboratórios disponíveis | Autenticado |
| GET | `/api/laboratories/{id}` | Buscar laboratório | Autenticado |
| POST | `/api/laboratories` | Criar laboratório | Admin |
| PUT | `/api/laboratories/{id}` | Atualizar laboratório | Admin |
| DELETE | `/api/laboratories/{id}` | Remover laboratório | Admin |
| GET | `/api/laboratories/{id}/peripherals` | Periféricos do lab | Autenticado |
| POST | `/api/laboratories/{id}/peripherals` | Adicionar periférico | Admin |
| PUT | `/api/laboratories/peripherals/{id}` | Atualizar periférico | Admin |
| DELETE | `/api/laboratories/peripherals/{id}` | Remover periférico | Admin |

## 🏗️ Arquitetura do Projeto

\`\`\`
src/main/java/com/labmanager/
├── config/          # Configurações (Security, CORS)
├── controller/      # Controladores REST
├── dto/            # Data Transfer Objects
├── model/          # Entidades JPA
├── repository/     # Repositórios de dados
├── security/       # Configurações de segurança JWT
├── service/        # Lógica de negócio
└── LabmanagerApplication.java
\`\`\`

## 🔒 Segurança

### Autenticação JWT
- Tokens assinados com chave secreta
- Expiração configurável (padrão: 24 horas)
- Validação automática em todas as requisições

### Autorização por Roles
- **ADMIN**: Acesso total ao sistema
- **PROFESSOR**: Pode aprovar agendamentos e gerenciar suas aulas
- **ALUNO**: Pode criar agendamentos e consultar seus dados

### Criptografia
- Senhas criptografadas com BCrypt
- Chaves JWT seguras
- Validação de entrada em todos os endpoints

## 📊 Modelo de Dados

### Principais Entidades

- **User**: Usuários do sistema (Admin, Professor, Aluno)
- **Laboratory**: Laboratórios disponíveis
- **Booking**: Agendamentos de laboratórios
- **Peripheral**: Equipamentos/periféricos dos laboratórios
- **BookingPeripheral**: Relacionamento entre agendamentos e periféricos

### Relacionamentos

- Um usuário pode ter vários agendamentos
- Um laboratório pode ter vários agendamentos e periféricos
- Um agendamento pode solicitar vários periféricos
- Relacionamentos com integridade referencial

## 🚦 Status de Agendamento

| Status | Descrição |
|--------|-----------|
| PENDING | Aguardando aprovação |
| APPROVED | Aprovado pelo administrador |
| REJECTED | Rejeitado |
| CANCELLED | Cancelado pelo usuário |
| COMPLETED | Agendamento concluído |

## 🔧 Configurações Importantes

### application.properties

```properties
# Configuração JWT
labmanager.app.jwtSecret=suaChaveSecreta
labmanager.app.jwtExpirationMs=86400000

# Configuração do banco
spring.datasource.url=jdbc:mysql://localhost:3306/labmanager
spring.jpa.hibernate.ddl-auto=update
