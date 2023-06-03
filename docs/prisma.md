npx prisma migrate dev => Lê o arquivo `schema.prisma` e compara com formato do banco de dados e executa as migrations para tentar sincronizar o banco de dados com o `schema.prisma` (pode haver conflito).

npx prisma studio => Abre workbench

npx prisma migrate deploy => Pega toda configuração no arquivo `schema.prisma` e aplica no banco de dados.


1-1 => um para um

1-N => um para muitos

N-N => muitos para muitos