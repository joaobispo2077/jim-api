# App

GymPass Checkin style api

## RFs (Requisitos Funcionais)

- [ ] Deve ser possível se cadastrar
- [ ] Deve ser possível se autenticar
- [ ] Deve ser possível obter o perfil de um usuário logado
- [ ] Deve ser possível o usuário realizar check-in em uma academia
- [ ] Deve ser possível validar o checkin de um usuário
- [ ] Deve ser possível obter o número de checkins de um usuário logado
- [ ] Deve ser possível o usuário visualizar o histórico de checkins
- [ ] Deve ser possível o usuário buscar academias próximas
- [ ] Deve ser possível buscar academias pelo nome
- [ ] Deve ser possível cadastrar uma academia

# RNs (Regras de Negócio)

- [ ] Não deve ser possível cadastrar um usuário com email já existente
- [ ] O usuário deve poder realizar 2 checkins no mesmo dia
- [ ] O usuário não pode fazer check-in se não estiver perto (100m) de uma academia
- [ ] O check-in só pode ser validado até 20 minutos após criado
- [ ] O check-in só pode ser validado por administradores
- [ ] A academia só pode ser cadastrada por administradores

## RNFs (Requisitos Não Funcionais)

- [ ] A senha do usuário precisa ser criptografada
- [ ] O sdados da aplicação precisam estar persistido em um banco PostgreSQL
- [ ] Todas listas de dados precisam estar paginadas com 20 items por página
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token)