# App

GymPass Checkin style api

## RFs (Requisitos Funcionais)

- [X] Deve ser possível se cadastrar
- [X] Deve ser possível se autenticar
- [X] Deve ser possível obter o perfil de um usuário logado
- [X] Deve ser possível o usuário realizar check-in em uma academia
- [X] Deve ser possível validar o checkin de um usuário
- [X] Deve ser possível obter o número de checkins de um usuário logado
- [X] Deve ser possível o usuário visualizar o histórico de checkins
- [X] Deve ser possível o usuário buscar academias próximas (1OKm)
- [X] Deve ser possível buscar academias pelo nome
- [X] Deve ser possível cadastrar uma academia

# RNs (Regras de Negócio)

- [X] Não deve ser possível cadastrar um usuário com email já existente
- [X] O usuário não deve poder realizar 2 checkins no mesmo dia
- [X] O usuário não pode fazer check-in se não estiver perto (100m) de uma academia
- [X] O check-in só pode ser validado até 20 minutos após criado
- [X] O check-in só pode ser validado por administradores
- [X] A academia só pode ser cadastrada por administradores
- [] Somente um Admin pode cadastrar outro Admin

## RNFs (Requisitos Não Funcionais)

- [X] A senha do usuário precisa ser criptografada
- [X] O dados da aplicação precisam estar persistido em um banco PostgreSQL
- [X] Todas listas de dados precisam estar paginadas com 20 items por página
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token)
